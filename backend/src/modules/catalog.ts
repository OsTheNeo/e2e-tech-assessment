/** Catalog module — covered by the worked example (`WF-CATALOG-1`). */
import { Router } from "express";
import { products } from "../data";
import { requireApiKey } from "./auth";

export const catalogRouter = Router();

catalogRouter.get("/ready", (_req, res) => {
  res.status(200).json({ status: "Ok" });
});

catalogRouter.get("/products", requireApiKey, (req, res) => {
  const brandId = String(req.query.brandId ?? "CC");
  const locale = String(req.query.locale ?? "en-US");
  const pgSize = Number(req.query.pgSize ?? 10);
  const pgIndex = Number(req.query.pgIndex ?? 0);

  if (!Number.isInteger(pgSize) || pgSize < 1 || pgSize > 100) {
    return res.status(400).json({ error: "bad_request", message: "pgSize must be an integer between 1 and 100" });
  }

  const matches = products.filter((p) => p.brandId === brandId && p.locale === locale);
  const page = matches.slice(pgIndex * pgSize, pgIndex * pgSize + pgSize);

  return res.status(200).json({ totalItems: matches.length, pgIndex, pgSize, data: page });
});

catalogRouter.get("/products/:skuNumber", requireApiKey, (req, res) => {
  const product = products.find((p) => p.skuNumber === req.params.skuNumber);

  if (!product) {
    return res.status(404).json({ error: "not_found", message: `Unknown sku ${req.params.skuNumber}` });
  }

  return res.status(200).json(product);
});
