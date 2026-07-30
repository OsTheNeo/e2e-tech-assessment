/** Scenario: remove a line from a cart. Owns DELETE /cart/:id/items/:sku plus its negative. */
import { spec } from "pactum";
import { authHeaders } from "../../support/auth";
import { Cart } from "./types";

/** Removes a line and asserts the sku is gone and the total was recalculated. */
export async function removeItem(cartId: string, skuNumber: string): Promise<Cart> {
  const response = await spec()
    .delete(`/cart/${cartId}/items/${skuNumber}`)
    .withHeaders(authHeaders())
    .expectStatus(200)
    .toss();

  const cart = response.json as Cart;

  expect(cart.items.find((item) => item.skuNumber === skuNumber)).toBeUndefined();

  const expectedTotal =
    Math.round(cart.items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0) * 100) / 100;
  expect(cart.total).toBe(expectedTotal);

  return cart;
}

/**
 * Parametrized negative for DELETE — distinguishes the two 404 messages:
 * "Unknown cart" (bad cart id) vs "Sku not in cart" (line absent).
 */
export async function removeItemIsRejected(
  cartId: string,
  skuNumber: string,
  { status, error, message }: { status: number; error: string; message?: string },
): Promise<void> {
  await spec()
    .delete(`/cart/${cartId}/items/${skuNumber}`)
    .withHeaders(authHeaders())
    .expectStatus(status)
    .expectJsonLike(message ? { error, message } : { error });
}
