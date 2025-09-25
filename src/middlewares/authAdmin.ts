import { Response, NextFunction } from "express";
import { authJWT, AuthenticatedRequest } from "./authJWT";

export function authAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authJWT(req, res, () => {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "te falta poderes" });
    }
    next();
  });
}