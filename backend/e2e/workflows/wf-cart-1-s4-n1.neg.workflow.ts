/**
 * WF-CART-1-S4-N* — Remove-item negatives
 *
 * Two 404s with distinct messages, so the test asserts the message too:
 * a bad cart id ("Unknown cart") vs a line that is not in an existing cart
 * ("Sku not in cart").
 *
 * | ID                | Condition                          | Expected                        |
 * |-------------------|------------------------------------|---------------------------------|
 * | WF-CART-1-S4-N1   | remove a sku not in the cart       | 404 not_found "Sku not in cart" |
 * | WF-CART-1-S4-N2   | remove from an unknown cart        | 404 not_found "Unknown cart"    |
 */
import { TAGS, title } from "../config/tags";
import { createCart } from "../scenarios/cart/createCart.scenario";
import { removeItemIsRejected } from "../scenarios/cart/removeItem.scenario";

const TAGSET = [TAGS.NEGATIVE];

describe(title("WF-CART-1", TAGSET, "remove-item negatives"), () => {
  let cartId: string;

  beforeAll(async () => {
    cartId = (await createCart()).id;
  });

  it("WF-CART-1-S4-N1 — removing a sku that is not in the cart is not_found", async () => {
    await removeItemIsRejected(cartId, "SKU-1001", { status: 404, error: "not_found", message: "Sku not in cart" });
  });

  it("WF-CART-1-S4-N2 — removing from an unknown cart is not_found", async () => {
    await removeItemIsRejected("cart_does_not_exist", "SKU-1001", { status: 404, error: "not_found", message: "Unknown cart" });
  });
});
