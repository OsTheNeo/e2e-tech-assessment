/**
 * WF-COUPON-1-H — Coupon happy redemption (EXERCISE 2, bonus)
 *
 * User gets: a shopper with a qualifying cart redeems SAVE10 and gets 10% off.
 *
 * This is the ONLY coupon-mutating spec: redeeming flips SAVE10 to used
 * process-globally. It is isolated in its own file, uses its own cart, and uses
 * SAVE10 — a code no negative depends on — so it can never poison another test.
 *
 * | Step | Action                        | Assert                                   |
 * |------|-------------------------------|------------------------------------------|
 * | S1   | build a qualifying cart       | SKU-1001 x1 = 129.99 (>= 50 minimum)     |
 * | S2   | redeem SAVE10                 | subtotal 129.99, discount 13.00, total 116.99 |
 */
import { TAGS, title } from "../config/tags";
import { chain } from "../support/chain";
import { createCart } from "../scenarios/cart/createCart.scenario";
import { addItem } from "../scenarios/cart/addItem.scenario";
import { redeemCoupon } from "../scenarios/coupons/redeemCoupon.scenario";

const TAGSET = [TAGS.HAPPY];

describe(title("WF-COUPON-1-H", TAGSET, "redeem SAVE10 for 10% off"), () => {
  let cartId: string;
  const { step } = chain();

  it(
    "WF-COUPON-1-S1 — a cart over the minimum is ready to redeem",
    step("S1", async () => {
      cartId = (await createCart()).id;
      const cart = await addItem(cartId, { skuNumber: "SKU-1001", qty: 1 });
      expect(cart.total).toBe(129.99);
    }),
  );

  it(
    "WF-COUPON-1-S2 — redeeming SAVE10 takes 10% off the subtotal",
    step("S2", async () => {
      const result = await redeemCoupon(cartId, "SAVE10");
      expect(result.percentOff).toBe(10);
      expect(result.subtotal).toBe(129.99);
      expect(result.discount).toBeCloseTo(13.0, 2);
      expect(result.total).toBeCloseTo(116.99, 2);
    }),
  );
});
