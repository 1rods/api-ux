import { Router } from "express";
import { pool } from "../db";
import { redisClient } from "../cache";

const router = Router();

router.get("/", async (req, res) => {
  try {
    // 1. Tenta buscar no cache
    const cache = await redisClient.get("produtos");
    if (cache) {
      console.log("Retornando do cache");
      return res.json(JSON.parse(cache));
    }

    // 2. Se não tiver no cache, busca no PostgreSQL
    const result = await pool.query("SELECT * FROM produtos");
    const produtos = result.rows;

    // 3. Salva no cache por 60 segundos
    await redisClient.setEx("produtos", 60, JSON.stringify(produtos));

    res.json(produtos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "erro na rota produto" });
  }
});

export default router;
