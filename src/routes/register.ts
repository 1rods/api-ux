import { Router, Request, Response } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";
import crypto from "crypto";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: "username, password e email são obrigatórios" });
  }

  try {
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "user/email ja cadastrado" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const activationToken = crypto.randomBytes(32).toString("hex");

    const result = await pool.query(
      `INSERT INTO users (username, email, password, role, ativado, activation_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, role, activation_token`,
      [username, email, hashedPassword, "user", false, activationToken]
    );

    const newUser = result.rows[0];
    const fakeActivationLink = `http://localhost:3000/activate/${newUser.activation_token}`;

    return res.status(201).json({
      message: "Cadastrado, ative a conta usando o link",
      activation_link: fakeActivationLink,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "erro no cadastro" });
  }
});

export default router;
