import { Router } from "express";
import { pool } from "../db";
import { authAdmin } from "../middlewares/authAdmin";

const router = Router();

router.post("/", authAdmin, async (req, res) => {
  try {
    let { id_produto, name_produto, valor_produto, desc_produto, qtd_produto, img_produto } = req.body;
    if (!name_produto || valor_produto == null || qtd_produto == null) {
      return res.status(400).json({ error: "name_produto, valor_produto, qtd_produto, desc_produto, img_produto" });
    }
    if (!id_produto) {
      id_produto = Math.floor(Math.random() * 1000000);
    }

    const result = await pool.query(`INSERT INTO produtos (id_produto, name_produto, valor_produto, desc_produto, qtd_produto, img_produto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [id_produto, name_produto, valor_produto, desc_produto ?? "", qtd_produto, img_produto ?? ""]
    );

    const novoProduto = result.rows[0];

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao adicionar produto" });
  }
});

export default router;
