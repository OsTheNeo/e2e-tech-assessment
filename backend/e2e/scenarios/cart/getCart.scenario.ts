/** Scenario: read a cart back. Owns GET /cart/:id and its contract + not-found negative. */
import { spec } from "pactum";
import { authHeaders } from "../../support/auth";
import { Cart } from "./types";

/** Reads a cart and asserts it echoes a well-formed cart with the requested id. */
export async function getCart(cartId: string): Promise<Cart> {
  const response = await spec()
    .get(`/cart/${cartId}`)
    .withHeaders(authHeaders())
    .expectStatus(200)
    .toss();

  const cart = response.json as Cart;

  expect(cart.id).toBe(cartId);
  expect(Array.isArray(cart.items)).toBe(true);
  expect(typeof cart.total).toBe("number");

  return cart;
}

/** Negative: an unknown cart id is rejected as not_found with the "Unknown cart" message. */
export async function cartIsNotFound(cartId: string): Promise<void> {
  await spec()
    .get(`/cart/${cartId}`)
    .withHeaders(authHeaders())
    .expectStatus(404)
    .expectJsonLike({ error: "not_found", message: "Unknown cart" });
}
