/**
 * WF-COUPON-1-S1-N* — Coupon redemption negatives (EXERCISE 2)
 *
 * Carts are built in `beforeAll` by reusing the Exercise 1 cart scenarios.
 * Every case short-circuits before the coupon is marked used, so this whole
 * file is NON-MUTATING and order-free (safe under the single-process runner).
 *
 * | ID                  | Condition                                   | Expected                              |
 * |---------------------|---------------------------------------------|---------------------------------------|
 * | WF-COUPON-1-S1-N1   | Unknown coupon code (real cart)             | 404 unknown_coupon                    |
 * | WF-COUPON-1-S1-N2   | Expired coupon EXPIRED5 (real cart)         | 409 coupon_expired                    |
 * | WF-COUPON-1-S1-N3   | SAVE25 on a cart below its 300 minimum      | 422 minimum_not_met                   |
 * | WF-COUPON-1-S1-N4   | USEDONCE (pre-redeemed)                      | 409 coupon_already_redeemed           |
 * | WF-COUPON-1-S1-N5   | (a) unknown cart / (b) missing code         | (a) 404 not_found / (b) 404 unknown_coupon |
 */
import { TAGS, title } from "../config/tags";
import { createCart } from "../scenarios/cart/createCart.scenario";
import { addItem } from "../scenarios/cart/addItem.scenario";
import { couponIsRejected } from "../scenarios/coupons/redeemCoupon.scenario";

const TAGSET = [TAGS.NEGATIVE];

describe(title("WF-COUPON-1", TAGSET, "coupon redemption negatives"), () => {
  /** A real, populated cart for the code-level negatives. */
  let cartId: string;
  /** A real cart whose total (39.00) is below SAVE25's 300 minimum. */
  let cheapCartId: string;

  beforeAll(async () => {
    cartId = (await createCart()).id;
    await addItem(cartId, { skuNumber: "SKU-1001", qty: 1 }); // 129.99

    cheapCartId = (await createCart()).id;
    await addItem(cheapCartId, { skuNumber: "SKU-1003", qty: 1 }); // 39.00
  });

  it("WF-COUPON-1-S1-N1 — an unknown coupon code is unknown_coupon", async () => {
    await couponIsRejected(cartId, "NOPE123", { status: 404, error: "unknown_coupon" });
  });

  it("WF-COUPON-1-S1-N2 — an expired coupon is coupon_expired", async () => {
    await couponIsRejected(cartId, "EXPIRED5", { status: 409, error: "coupon_expired" });
  });

  it("WF-COUPON-1-S1-N3 — a cart below the minimum is minimum_not_met", async () => {
    await couponIsRejected(cheapCartId, "SAVE25", { status: 422, error: "minimum_not_met" });
  });

  it("WF-COUPON-1-S1-N4 — an already-redeemed coupon is coupon_already_redeemed (not expired)", async () => {
    await couponIsRejected(cartId, "USEDONCE", { status: 409, error: "coupon_already_redeemed" });
  });

  it("WF-COUPON-1-S1-N5 — an unknown cart is not_found; a missing code is unknown_coupon", async () => {
    // (a) cart is checked before the code, so an unknown cart wins even with a valid code.
    await couponIsRejected("cart_does_not_exist", "SAVE10", { status: 404, error: "not_found", message: "Unknown cart" });
    // (b) a real cart with no code stringifies to "" and resolves to unknown_coupon (no 500).
    await couponIsRejected(cartId, undefined, { status: 404, error: "unknown_coupon" });
  });
});
