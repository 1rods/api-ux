import { Router } from "express";
import { pool } from "../db";
import { authUser } from "../middlewares/authUser";

const router = Router();

router.put("/:cart_id", authUser, async (req, res) => {
  const cartId = parseInt(req.params.cart_id, 10);
  const newQty = Number(req.body.qtd_produto_cart);
  const userId = req.user?.id;

  if (isNaN(cartId) || cartId < 1) return res.status(400).json({ error: "erro cart_id" });
  if (!Number.isInteger(newQty) || newQty < 0) return res.status(400).json({ error: "erro qtd_produto_cart" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const cartRes = await client.query("SELECT * FROM cart WHERE id = $1 FOR UPDATE", [cartId]);
    if (cartRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "item do carrinho não encontrado" });
    }

    const cartItem = cartRes.rows[0];
    if (cartItem.user_id !== userId) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "não autorizado a modificar este item" });
    }

    if (newQty === 0) {
      const qtdAtual = cartItem.qtd_produto_cart;

      await client.query("DELETE FROM cart WHERE id = $1", [cartId]);
      await client.query("UPDATE produtos SET qtd_produto = qtd_produto + $1 WHERE id = $2", [
        qtdAtual,
        cartItem.produto_id,
      ]);

      await client.query("COMMIT");
      return res.json({ message: "deletado ok, estoque ok", cart_id: cartId });
    }

    const prodRes = await client.query("SELECT qtd_produto FROM produtos WHERE id = $1 FOR UPDATE", [
      cartItem.produto_id,
    ]);
    if (prodRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "produto não encontrado" });
    }

    const estoqueAtual = prodRes.rows[0].qtd_produto;
    const diff = newQty - cartItem.qtd_produto_cart;

    if (diff > 0) {
      if (estoqueAtual < diff) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "estoque insuficiente" });
      }
      await client.query("UPDATE produtos SET qtd_produto = qtd_produto - $1 WHERE id = $2", [
        diff,
        cartItem.produto_id,
      ]);
    } else if (diff < 0) {
      await client.query("UPDATE produtos SET qtd_produto = qtd_produto + $1 WHERE id = $2", [
        Math.abs(diff),
        cartItem.produto_id,
      ]);
    }

    const updated = await client.query("UPDATE cart SET qtd_produto_cart = $1 WHERE id = $2 RETURNING *", [newQty, cartId] );

    await client.query("COMMIT");
    return res.json({ message: "quantidade atualizada", cart: updated.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "erro ao atualizar item do carrinho" });
  } finally {
    client.release();
  }
});

router.delete("/:cart_id", authUser, async (req, res) => {
  const cartId = parseInt(req.params.cart_id, 10);
  const userId = req.user?.id;

  if (isNaN(cartId) || cartId < 1) return res.status(400).json({ error: "cart_id inválido" });

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const cartRes = await client.query("SELECT * FROM cart WHERE id = $1 FOR UPDATE", [cartId]);
    if (cartRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "item do carrinho não encontrado" });
    }

    const cartItem = cartRes.rows[0];
    if (cartItem.user_id !== userId) {
      await client.query("ROLLBACK");
      return res.status(403).json({ error: "não autorizado a remover este item" });
    }

    const qtdAtual = cartItem.qtd_produto_cart;
    await client.query("DELETE FROM cart WHERE id = $1", [cartId]);
    await client.query("UPDATE produtos SET qtd_produto = qtd_produto + $1 WHERE id = $2", [
      qtdAtual,
      cartItem.produto_id,
    ]);

    await client.query("COMMIT");
    return res.json({ message: "deletado ok, estoque ok", cart_id: cartId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "erro ao remover item do carrinho" });
  } finally {
    client.release();
  }
});

export default router;
