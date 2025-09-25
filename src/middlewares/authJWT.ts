import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtBlacklist } from "../cache";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env";


const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET não definido!");

export async function authJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token JWT necessário" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const isBlacklisted = await jwtBlacklist.check(token);
    if (isBlacklisted) {
      return res.status(401).json({ error: "Token inválido (logout realizado)" });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    (req as any).user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
    next();
  } catch (err) {
    console.log('Erro na verificação JWT:', err);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}