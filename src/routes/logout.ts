import { Router, Request, Response } from "express";
import { authJWT, AuthenticatedRequest } from "../middlewares/authJWT";
import { jwtBlacklist } from "../cache";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) throw new Error("JWT_SECRET não definido!");

router.post("/", authJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(400).json({ error: "Token não encontrado" });
    }
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

    if (expiresIn > 0) {
      await jwtBlacklist.add(token, expiresIn);
    }
    res.json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao fazer logout" });
  }
});

export default router;