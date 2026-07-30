/** Scenario: create a cart. Owns the POST /cart request and its 201 contract. */
import { spec } from "pactum";
import { authHeaders } from "../../support/auth";
import { Cart } from "./types";

/** Creates an empty cart and asserts the fresh-cart contract. Returns it so a workflow can carry the id forward. */
export async function createCart(): Promise<Cart> {
  const response = await spec()
    .post("/cart")
    .withHeaders(authHeaders())
    .expectStatus(201)
    .toss();

  const cart = response.json as Cart;

  expect(cart.id).toMatch(/^cart_[a-z0-9]+$/);
  expect(cart.items).toEqual([]);
  expect(cart.total).toBe(0);
  expect(cart.couponCode).toBeNull();

  return cart;
}
