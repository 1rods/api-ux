import { Router, Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";
import { generateToken } from "../middlewares/generateToken";


const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username e password são obrigatórios" });
  }

  try {
    const result = await pool.query( "SELECT * FROM users WHERE username = $1 AND ativado = true", [username] );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas ou conta não ativada" });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: "Erro no login" });
  }
});

export default router;