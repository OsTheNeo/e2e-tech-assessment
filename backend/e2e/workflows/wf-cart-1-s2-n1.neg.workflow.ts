/**
 * WF-CART-1-S2-N* — Read a cart that does not exist
 *
 * | ID                | Condition             | Expected                          |
 * |-------------------|-----------------------|-----------------------------------|
 * | WF-CART-1-S2-N1   | GET an unknown cart   | 404 not_found "Unknown cart"      |
 */
import { TAGS, title } from "../config/tags";
import { cartIsNotFound } from "../scenarios/cart/getCart.scenario";

const TAGSET = [TAGS.NEGATIVE];

describe(title("WF-CART-1", TAGSET, "cart read negatives"), () => {
  it("WF-CART-1-S2-N1 — an unknown cart id reads back as not_found", async () => {
    await cartIsNotFound("cart_does_not_exist");
  });
});
