/**
 * WF-CART-1-S3-N* — Add-item negatives (validation contract)
 *
 * The server validates in a fixed order: unknown cart (404) -> bad qty (400) ->
 * unknown sku (404). N6 pins that precedence: an unknown sku *and* a bad qty is
 * a 400, because qty is checked before the sku lookup.
 *
 * | ID                | Condition                        | Expected                                    |
 * |-------------------|----------------------------------|---------------------------------------------|
 * | WF-CART-1-S3-N1   | qty = 0                          | 400 bad_request "qty must be an integer >= 1" |
 * | WF-CART-1-S3-N2   | qty = -1 / 1.5 / "2" / missing   | 400 bad_request                             |
 * | WF-CART-1-S3-N3   | unknown sku                      | 404 not_found (message names the sku)       |
 * | WF-CART-1-S3-N4   | add to an unknown cart           | 404 not_found "Unknown cart"                |
 * | WF-CART-1-S3-N5   | unknown sku + qty 0 (precedence) | 400 bad_request (qty checked before sku)    |
 * | WF-CART-1-S3-N6   | huge qty (edge, documented)      | 200 accepted; total = unitPrice * qty       |
 */
import { TAGS, title } from "../config/tags";
import { createCart } from "../scenarios/cart/createCart.scenario";
import { addItem, addItemIsRejected } from "../scenarios/cart/addItem.scenario";

const TAGSET = [TAGS.NEGATIVE];
const QTY_MSG = "qty must be an integer >= 1";

describe(title("WF-CART-1", TAGSET, "add-item negatives"), () => {
  let cartId: string;

  beforeAll(async () => {
    cartId = (await createCart()).id;
  });

  it("WF-CART-1-S3-N1 — qty 0 is rejected as bad_request", async () => {
    await addItemIsRejected(cartId, { skuNumber: "SKU-1001", qty: 0 }, { status: 400, error: "bad_request", message: QTY_MSG });
  });

  it("WF-CART-1-S3-N2 — non-positive, non-integer and missing qty are all bad_request", async () => {
    await addItemIsRejected(cartId, { skuNumber: "SKU-1001", qty: -1 }, { status: 400, error: "bad_request" });
    await addItemIsRejected(cartId, { skuNumber: "SKU-1001", qty: 1.5 }, { status: 400, error: "bad_request" });
    await addItemIsRejected(cartId, { skuNumber: "SKU-1001", qty: "2" }, { status: 400, error: "bad_request" });
    await addItemIsRejected(cartId, { skuNumber: "SKU-1001" }, { status: 400, error: "bad_request" });
  });

  it("WF-CART-1-S3-N3 — an unknown sku is not_found", async () => {
    await addItemIsRejected(cartId, { skuNumber: "SKU-DOES-NOT-EXIST", qty: 1 }, { status: 404, error: "not_found" });
  });

  it("WF-CART-1-S3-N4 — adding to an unknown cart is not_found", async () => {
    await addItemIsRejected("cart_does_not_exist", { skuNumber: "SKU-1001", qty: 1 }, { status: 404, error: "not_found", message: "Unknown cart" });
  });

  it("WF-CART-1-S3-N5 — an unknown sku with qty 0 fails on qty first (400, not 404)", async () => {
    await addItemIsRejected(cartId, { skuNumber: "SKU-DOES-NOT-EXIST", qty: 0 }, { status: 400, error: "bad_request", message: QTY_MSG });
  });

  it("WF-CART-1-S3-N6 — a huge qty is accepted with no upper bound (documented risk)", async () => {
    // The API sets no maximum on qty, so the total can grow without limit.
    // Asserting current behaviour; the unbounded-total risk is called out in the submission note.
    const bigCart = (await createCart()).id;
    const cart = await addItem(bigCart, { skuNumber: "SKU-1003", qty: 1_000_000 });
    expect(cart.total).toBe(39_000_000);
  });
});
