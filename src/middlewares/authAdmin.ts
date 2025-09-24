import { Request, Response, NextFunction } from "express";
import { pool } from "../db";
import bcrypt from "bcrypt";

export async function authAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "login necessario" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "verificar user/senha" });
    }

    const user = result.rows[0];

    if (user.role !== "admin") {
      return res.status(403).json({ error: "user sem adm" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "verificar user/senha" });
    }

    req.user = { id: user.id, username: user.username, role: user.role };
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "erro de login" });
  }
}
