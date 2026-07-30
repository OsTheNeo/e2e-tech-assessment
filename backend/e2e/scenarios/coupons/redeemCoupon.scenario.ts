/** Scenario: redeem a coupon. Owns POST /coupons/redeem, its 200 contract and its parametrized negative. */
import { spec } from "pactum";
import { authHeaders } from "../../support/auth";

export type RedeemResult = {
  cartId: string;
  code: string;
  percentOff: number;
  subtotal: number;
  discount: number;
  total: number;
};

/**
 * Redeems a coupon against a cart and asserts the discount math:
 * discount = round2(subtotal * percentOff / 100), total = round2(subtotal - discount).
 * NOTE: on success the coupon is marked used process-globally, so only ever call
 * this from the isolated happy workflow, never from a negative.
 */
export async function redeemCoupon(cartId: string, code: string): Promise<RedeemResult> {
  const response = await spec()
    .post("/coupons/redeem")
    .withHeaders(authHeaders())
    .withJson({ cartId, code })
    .expectStatus(200)
    .toss();

  const result = response.json as RedeemResult;

  expect(result.cartId).toBe(cartId);
  expect(result.code).toBe(code.toUpperCase());
  const expectedDiscount = Math.round((result.subtotal * result.percentOff) / 100 * 100) / 100;
  expect(result.discount).toBeCloseTo(expectedDiscount, 2);
  expect(result.total).toBeCloseTo(Math.round((result.subtotal - result.discount) * 100) / 100, 2);

  return result;
}

/**
 * Parametrized negative: one function for every redemption rejection —
 * 404 not_found (unknown cart), 404 unknown_coupon, 409 coupon_expired,
 * 409 coupon_already_redeemed, 422 minimum_not_met. `code` is sent as-is so
 * callers can probe missing / non-string values. All of these short-circuit
 * before the coupon is marked used, so they are non-mutating and order-free.
 */
export async function couponIsRejected(
  cartId: unknown,
  code: unknown,
  { status, error, message }: { status: number; error: string; message?: string },
): Promise<void> {
  await spec()
    .post("/coupons/redeem")
    .withHeaders(authHeaders())
    .withJson({ cartId, code } as Record<string, unknown>)
    .expectStatus(status)
    .expectJsonLike(message ? { error, message } : { error })
    .toss();
}
