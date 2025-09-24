import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

router.get("/:token", async (req: Request, res: Response) => {
  const { token } = req.params;
  if (!token) return res.status(400).json({ error: "falta o token" });
  try {
    const result = await pool.query(
      "SELECT id, username, ativado FROM users WHERE activation_token = $1",
      [token]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "token inválido" });
    }
    const user = result.rows[0];

    if (user.ativado) {
      return res.status(400).json({ error: "conta já está ativada" });
    }
    await pool.query(
      "UPDATE users SET ativado = true, activation_token = NULL WHERE id = $1",
      [user.id]
    );
    return res.json({ message: "Conta ativada" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "erro em ativar" });
  }
});

export default router;
