/**
 * Cart module — EXERCISE 1.
 *
 * No tests exist for this module, and no test plan is given: the code below is
 * the only specification you get. Read it, decide what is worth covering, and
 * write it following the structure of the worked example.
 */
import { Router } from "express";
import { carts, products, Cart } from "../data";
import { requireApiKey } from "./auth";

export const cartRouter = Router();

const round2 = (value: number) => Math.round(value * 100) / 100;

const recalc = (cart: Cart): Cart => {
  cart.total = round2(cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0));
  return cart;
};

cartRouter.use(requireApiKey);

cartRouter.post("/cart", (_req, res) => {
  const cart: Cart = {
    id: `cart_${Math.random().toString(36).slice(2, 10)}`,
    items: [],
    total: 0,
    couponCode: null,
  };
  carts.set(cart.id, cart);
  res.status(201).json(cart);
});

cartRouter.get("/cart/:id", (req, res) => {
  const cart = carts.get(req.params.id);
  if (!cart) return res.status(404).json({ error: "not_found", message: "Unknown cart" });
  return res.status(200).json(cart);
});

cartRouter.post("/cart/:id/items", (req, res) => {
  const cart = carts.get(req.params.id);
  if (!cart) return res.status(404).json({ error: "not_found", message: "Unknown cart" });

  const { skuNumber, qty } = req.body ?? {};

  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({ error: "bad_request", message: "qty must be an integer >= 1" });
  }

  const product = products.find((p) => p.skuNumber === skuNumber);
  if (!product) {
    return res.status(404).json({ error: "not_found", message: `Unknown sku ${skuNumber}` });
  }

  const line = cart.items.find((item) => item.skuNumber === skuNumber);
  if (line) line.qty += qty;
  else cart.items.push({ skuNumber, qty, unitPrice: product.price });

  return res.status(200).json(recalc(cart));
});

cartRouter.delete("/cart/:id/items/:skuNumber", (req, res) => {
  const cart = carts.get(req.params.id);
  if (!cart) return res.status(404).json({ error: "not_found", message: "Unknown cart" });

  const index = cart.items.findIndex((item) => item.skuNumber === req.params.skuNumber);
  if (index === -1) {
    return res.status(404).json({ error: "not_found", message: "Sku not in cart" });
  }

  cart.items.splice(index, 1);
  return res.status(200).json(recalc(cart));
});
