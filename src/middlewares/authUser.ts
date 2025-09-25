import { Response, NextFunction } from "express";
import { authJWT, AuthenticatedRequest } from "./authJWT";

export function authUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authJWT(req, res, () => {
    if (req.user?.role !== "user") {
      return res.status(403).json({ error: "Precisa está logado para adicionar itens ao carrinho" });
    }
    next();
  });
}