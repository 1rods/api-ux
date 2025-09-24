import { Router } from "express";
import { pool } from "../db";
import { redisClient } from "../cache";
import { authAdmin } from "../middlewares/authAdmin";

const router = Router();

router.delete("/:id", authAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
      return res.status(400).json({ error: "erro no id" });
    }
    const existing = await pool.query("SELECT * FROM produtos WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "erro no produto" });
    }

    await pool.query("DELETE FROM produtos WHERE id = $1", [id]);
    const cacheKey = `produto:${id}`;
    await redisClient.del(cacheKey);

    res.json({ message: "Produto deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "erro ao deletar produto" });
  }
});

export default router;
