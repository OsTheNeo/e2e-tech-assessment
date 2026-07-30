/** Scenario: add an item to a cart. Owns POST /cart/:id/items plus its parametrized negative. */
import { spec } from "pactum";
import { authHeaders } from "../../support/auth";
import { Cart, CART_FIXTURES } from "./types";

type AddArgs = { skuNumber?: string; qty?: number };

/**
 * Adds a line to the cart and asserts the returned cart contract: the line is
 * present with the seed unit price, and the total is the recalculated sum.
 * Same-sku re-adds merge into one line server-side, so callers assert the
 * merged qty/total against the returned cart.
 */
export async function addItem(cartId: string, args: AddArgs = {}): Promise<Cart> {
  const skuNumber = args.skuNumber ?? CART_FIXTURES.skuNumber;
  const qty = args.qty ?? 1;

  const response = await spec()
    .post(`/cart/${cartId}/items`)
    .withHeaders(authHeaders())
    .withJson({ skuNumber, qty })
    .expectStatus(200)
    .toss();

  const cart = response.json as Cart;

  const line = cart.items.find((item) => item.skuNumber === skuNumber);
  expect(line).toBeDefined();
  expect(line!.qty).toBeGreaterThanOrEqual(qty);
  expect(line!.unitPrice).toBeGreaterThan(0);

  const expectedTotal =
    Math.round(cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0) * 100) / 100;
  expect(cart.total).toBe(expectedTotal);

  return cart;
}

/**
 * Parametrized negative: one function for every add-item rejection —
 * 400 bad_request (bad qty), 404 not_found (unknown sku or unknown cart).
 * `body` is sent as-is so callers can probe missing/typed qty values.
 */
export async function addItemIsRejected(
  cartId: string,
  body: unknown,
  { status, error, message }: { status: number; error: string; message?: string },
): Promise<void> {
  const request = spec()
    .post(`/cart/${cartId}/items`)
    .withHeaders(authHeaders())
    .withJson(body as Record<string, unknown>)
    .expectStatus(status)
    .expectJsonLike(message ? { error, message } : { error });

  await request.toss();
}
