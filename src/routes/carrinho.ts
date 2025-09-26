import { Router } from "express";
import { pool } from "../db";
import { authUser } from "../middlewares/authUser";

const router = Router();

router.post("/", authUser, async (req, res) => {
  const { produto_id, qtd_produto_cart } = req.body;
  const userId = req.user?.id;

  if (!Number.isInteger(produto_id) || produto_id < 1) {
    return res.status(400).json({ error: "produto_id inválido" });
  }
  if (!Number.isInteger(qtd_produto_cart) || qtd_produto_cart < 0) {
    return res.status(400).json({ error: "qtd_produto_cart inválido" });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const prodRes = await client.query( "SELECT qtd_produto FROM produtos WHERE id = $1 FOR UPDATE", [produto_id] );
    if (prodRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "produto não encontrado" });
    }

    const estoqueAtual = prodRes.rows[0].qtd_produto;

    const cartRes = await client.query( "SELECT * FROM cart WHERE user_id = $1 AND produto_id = $2 FOR UPDATE", [userId, produto_id] );

    if (cartRes.rows.length > 0) {
      const cartItem = cartRes.rows[0];

      if (qtd_produto_cart === 0) {
        await client.query("DELETE FROM cart WHERE id = $1", [cartItem.id]);
        await client.query( "UPDATE produtos SET qtd_produto = qtd_produto + $1 WHERE id = $2", [cartItem.qtd_produto_cart, produto_id] );
        await client.query("COMMIT");
        return res.json({ message: "item removido do carrinho" });
      }

      const diferenca = qtd_produto_cart - cartItem.qtd_produto_cart;

      if (diferenca > 0 && estoqueAtual < diferenca) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "estoque insuficiente" });
      }

      await client.query( "UPDATE cart SET qtd_produto_cart = $1 WHERE id = $2", [qtd_produto_cart, cartItem.id] );

      await client.query( "UPDATE produtos SET qtd_produto = qtd_produto - $1 WHERE id = $2", [diferenca, produto_id] );

      await client.query("COMMIT");
      return res.json({ message: "item atualizado no carrinho" });
    } else {
      if (estoqueAtual < qtd_produto_cart) {
        await client.query("ROLLBACK");
        return res.status(400).json({ error: "estoque insuficiente" });
      }

      const insertRes = await client.query( "INSERT INTO cart (user_id, produto_id, qtd_produto_cart) VALUES ($1, $2, $3) RETURNING *", [userId, produto_id, qtd_produto_cart] );

      await client.query( "UPDATE produtos SET qtd_produto = qtd_produto - $1 WHERE id = $2", [qtd_produto_cart, produto_id] );

      await client.query("COMMIT");
      return res.json({ message: "produto adicionado ao carrinho", cart: insertRes.rows[0] });
    }
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "erro ao adicionar item no carrinho" });
  } finally {
    client.release();
  }
});

router.get("/", authUser, async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Usuário não identificado" });
  }

  const client = await pool.connect();
  try {
    const cartRes = await client.query(`SELECT c.id, c.user_id, c.produto_id, c.qtd_produto_cart, c.created_at, p.name_produto, p.valor_produto FROM cart c JOIN produtos p ON p.id = c.produto_id WHERE c.user_id = $1 ORDER BY c.created_at ASC`, [userId] );

    return res.json({ carrinho: cartRes.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Erro ao listar carrinho" });
  } finally {
    client.release();
  }
});

router.delete("/", authUser, async (req, res) => {
  const userId = req.user?.id;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartRes = await client.query("SELECT * FROM cart WHERE user_id = $1 FOR UPDATE",[userId] );

    for (const item of cartRes.rows) { await client.query("UPDATE produtos SET qtd_produto = qtd_produto + $1 WHERE id = $2", [item.qtd_produto_cart, item.produto_id] );
    }

    await client.query("DELETE FROM cart WHERE user_id = $1", [userId]);
    await client.query("COMMIT");

    return res.json({ message: "carrinho inteiro deletado" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
    return res.status(500).json({ error: "erro ao deletar carrinho" });
  } finally {
    client.release();
  }
});

export default router;
