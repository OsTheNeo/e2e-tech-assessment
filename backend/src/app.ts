import express from "express";
import { catalogRouter } from "./modules/catalog";
import { cartRouter } from "./modules/cart";
import { couponsRouter } from "./modules/coupons";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/v1", catalogRouter);
  app.use("/api/v1", cartRouter);
  app.use("/api/v1", couponsRouter);

  app.use((_req, res) => res.status(404).json({ error: "not_found", message: "No such route" }));

  return app;
}
