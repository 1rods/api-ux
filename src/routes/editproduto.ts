import { Router } from "express";
import { pool } from "../db";
import { redisClient } from "../cache";
import { authAdmin } from "../middlewares/authAdmin";

const router = Router();

router.get("/:id", authAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "ID inválido" });

    const cacheKey = `produto:${id}`;
    const cache = await redisClient.get(cacheKey);
    if (cache) return res.json(JSON.parse(cache));

    const result = await pool.query("SELECT * FROM produtos WHERE id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });

    const produto = result.rows[0];
    await redisClient.setEx(cacheKey, 60, JSON.stringify(produto));

    res.json(produto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar produto" });
  }
});

router.put("/:id", authAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ error: "ID inválido" });

    const { name_produto, valor_produto, desc_produto, qtd_produto, img_produto } = req.body;

    const existing = await pool.query("SELECT * FROM produtos WHERE id = $1", [id]);
    if (existing.rows.length === 0) return res.status(404).json({ error: "Produto não encontrado" });

    const produtoAtual = existing.rows[0];

    const updatedProduto = { name_produto: name_produto ?? produtoAtual.name_produto, valor_produto: valor_produto ?? produtoAtual.valor_produto, desc_produto: desc_produto ?? produtoAtual.desc_produto, qtd_produto: qtd_produto ?? produtoAtual.qtd_produto, img_produto: img_produto ?? produtoAtual.img_produto,};

    const result = await pool.query(`UPDATE produtos SET name_produto=$1, valor_produto=$2, desc_produto=$3, qtd_produto=$4, img_produto=$5 WHERE id=$6 RETURNING *`,
      [updatedProduto.name_produto, updatedProduto.valor_produto, updatedProduto.desc_produto, updatedProduto.qtd_produto, updatedProduto.img_produto, id,]
    );

    const cacheKey = `produto:${id}`;
    await redisClient.setEx(cacheKey, 60, JSON.stringify(result.rows[0]));

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar produto" });
  }
});

export default router;
