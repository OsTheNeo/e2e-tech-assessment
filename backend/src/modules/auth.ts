import { Request, Response, NextFunction } from "express";
import { API_KEY } from "../data";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const key = req.header("x-api-key");

  if (!key) {
    return res.status(401).json({ error: "unauthorized", message: "Missing x-api-key header" });
  }

  if (key !== API_KEY) {
    return res.status(401).json({ error: "unauthorized", message: "Invalid api key" });
  }

  return next();
}
