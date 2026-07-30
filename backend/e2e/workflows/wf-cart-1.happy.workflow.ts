/**
 * WF-CART-1-H — Cart lifecycle happy chain (EXERCISE 1)
 *
 * User gets: a shopper builds a cart end-to-end — create, add lines, read it
 * back, merge a duplicate sku into one line, then remove lines back to empty —
 * and the server keeps the line set and the recalculated total correct at every
 * step. The cart id is carried forward between steps.
 *
 * | Step | Action                    | Assert (via scenario)                        |
 * |------|---------------------------|----------------------------------------------|
 * | S1   | createCart                | 201, empty cart, total 0                     |
 * | S2   | add SKU-1001 x2           | one line, unitPrice 129.99, total 259.98     |
 * | S3   | getCart read-back         | persisted items + total echo (259.98)        |
 * | S4   | add SKU-1003 x1           | two lines, total 298.98                       |
 * | S5   | re-add SKU-1001 x1        | still two lines, SKU-1001 qty 3, total 428.97 |
 * | S6   | remove SKU-1003           | one line, total 389.97                        |
 * | S7   | remove SKU-1001 (last)    | empty cart, total 0                           |
 *
 * Assertions live in `e2e/scenarios/cart/**`; this file only chains them.
 */
import { TAGS, title } from "../config/tags";
import { chain } from "../support/chain";
import { createCart } from "../scenarios/cart/createCart.scenario";
import { addItem } from "../scenarios/cart/addItem.scenario";
import { getCart } from "../scenarios/cart/getCart.scenario";
import { removeItem } from "../scenarios/cart/removeItem.scenario";

const TAGSET = [TAGS.HAPPY, TAGS.SMOKE];

describe(title("WF-CART-1-H", TAGSET, "cart create -> add -> merge -> remove -> empty"), () => {
  /** Carried across every step. */
  let cartId: string;
  const { step } = chain();

  it(
    "WF-CART-1-S1 — a new cart starts empty",
    step("S1", async () => {
      const cart = await createCart();
      cartId = cart.id;
    }),
  );

  it(
    "WF-CART-1-S2 — adding two drills gives one line at $259.98",
    step("S2", async () => {
      const cart = await addItem(cartId, { skuNumber: "SKU-1001", qty: 2 });
      expect(cart.items).toHaveLength(1);
      expect(cart.items[0]).toEqual({ skuNumber: "SKU-1001", qty: 2, unitPrice: 129.99 });
      expect(cart.total).toBe(259.98);
    }),
  );

  it(
    "WF-CART-1-S3 — the cart reads back with the same lines and total",
    step("S3", async () => {
      const cart = await getCart(cartId);
      expect(cart.items).toHaveLength(1);
      expect(cart.total).toBe(259.98);
    }),
  );

  it(
    "WF-CART-1-S4 — adding a tool bag makes a second line at $298.98",
    step("S4", async () => {
      const cart = await addItem(cartId, { skuNumber: "SKU-1003", qty: 1 });
      expect(cart.items).toHaveLength(2);
      expect(cart.total).toBe(298.98);
    }),
  );

  it(
    "WF-CART-1-S5 — re-adding the drill merges into the existing line (qty 3)",
    step("S5", async () => {
      const cart = await addItem(cartId, { skuNumber: "SKU-1001", qty: 1 });
      expect(cart.items).toHaveLength(2);
      const drill = cart.items.find((item) => item.skuNumber === "SKU-1001");
      expect(drill!.qty).toBe(3);
      expect(cart.total).toBe(428.97);
    }),
  );

  it(
    "WF-CART-1-S6 — removing the tool bag leaves the drill line at $389.97",
    step("S6", async () => {
      const cart = await removeItem(cartId, "SKU-1003");
      expect(cart.items).toHaveLength(1);
      expect(cart.total).toBe(389.97);
    }),
  );

  it(
    "WF-CART-1-S7 — removing the last line empties the cart",
    step("S7", async () => {
      const cart = await removeItem(cartId, "SKU-1001");
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    }),
  );
});
