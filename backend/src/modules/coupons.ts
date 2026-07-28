/**
 * Coupons module — EXERCISE 2. Redeeming marks the coupon as used, so a code
 * only works once per run.
 */
import { Router } from "express";
import { carts, coupons } from "../data";
import { requireApiKey } from "./auth";

export const couponsRouter = Router();

const round2 = (value: number) => Math.round(value * 100) / 100;

couponsRouter.post("/coupons/redeem", requireApiKey, (req, res) => {
  const { cartId, code } = req.body ?? {};

  const cart = carts.get(cartId);
  if (!cart) return res.status(404).json({ error: "not_found", message: "Unknown cart" });

  const coupon = coupons.get(String(code ?? "").toUpperCase());
  if (!coupon) return res.status(404).json({ error: "unknown_coupon", message: `Unknown coupon ${code}` });

  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    return res.status(409).json({ error: "coupon_expired", message: `Coupon ${coupon.code} expired` });
  }

  if (coupon.redeemed) {
    return res
      .status(409)
      .json({ error: "coupon_already_redeemed", message: `Coupon ${coupon.code} was already redeemed` });
  }

  if (cart.total < coupon.minTotal) {
    return res.status(422).json({
      error: "minimum_not_met",
      message: `Cart total ${cart.total} is below the ${coupon.minTotal} minimum for ${coupon.code}`,
    });
  }

  coupon.redeemed = true;
  cart.couponCode = coupon.code;

  const discount = round2((cart.total * coupon.percentOff) / 100);

  return res.status(200).json({
    cartId: cart.id,
    code: coupon.code,
    percentOff: coupon.percentOff,
    subtotal: cart.total,
    discount,
    total: round2(cart.total - discount),
  });
});
