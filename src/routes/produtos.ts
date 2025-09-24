import { Router } from "express";
import { pool } from "../db";
import { redisClient } from "../cache";

const router = Router();

router.get("/", async (req, res) => {
  try {
    if (!req.query.page) {
      return res.status(400).json({
        error: "essa pagina não existe"
      });
    }

    const page = parseInt(req.query.page as string);
    if (isNaN(page) || page < 1) {
      return res.status(400).json({
        error: "essa pagina não existe '>=1'"
      });
    }

    const limit = 10;
    const offset = (page - 1) * limit;
    let order = (req.query.order as string) || "menor";
    order = order.toLowerCase() === "maior" ? "DESC" : "ASC";

    const totalResult = await pool.query("SELECT COUNT(*) FROM produtos");
    const totalProdutos = parseInt(totalResult.rows[0].count, 10);
    const totalPaginas = Math.ceil(totalProdutos / limit);

    if (page > totalPaginas && totalPaginas > 0) {
      return res.status(404).json({
        error: "essa pagina não existe"
      });
    }
    const cacheKey = `produtos:page=${page}:order=${order}`;
    const cache = await redisClient.get(cacheKey);

    if (cache) {
      return res.json(JSON.parse(cache));
    }

    const query = `SELECT * FROM produtos ORDER BY valor_produto ${order} LIMIT $1 OFFSET $2`;
    const result = await pool.query(query, [limit, offset]);
    const produtos = result.rows;

    const response = {
      page,
      total_paginas: totalPaginas,
      total_produtos: totalProdutos,
      produtos,
    };

    await redisClient.setEx(cacheKey, 60, JSON.stringify(response));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "erro na rota produto" });
  }
});

export default router;
