/**
 * WF-CART-1-S1-N* — Cart auth negatives
 *
 * Every cart endpoint is gated by `requireApiKey`. This spec proves each one
 * rejects a missing or wrong `x-api-key` with 401 unauthorized. Read-only /
 * independent, so it is order-free.
 *
 * | ID                 | Condition                    | Expected              |
 * |--------------------|------------------------------|-----------------------|
 * | WF-CART-1-S1-N1    | Missing api key (all verbs)  | 401 unauthorized      |
 * | WF-CART-1-S1-N2    | Wrong api key (all verbs)    | 401 unauthorized      |
 */
import { TAGS, title } from "../config/tags";
import { cartRequestIsRejected } from "../scenarios/cart/cartAuth.scenario";

const TAGSET = [TAGS.NEGATIVE];

const ENDPOINTS = [
  { method: "post" as const, path: "/cart", body: {} },
  { method: "get" as const, path: "/cart/cart_whatever" },
  { method: "post" as const, path: "/cart/cart_whatever/items", body: { skuNumber: "SKU-1001", qty: 1 } },
  { method: "delete" as const, path: "/cart/cart_whatever/items/SKU-1001" },
];

describe(title("WF-CART-1", TAGSET, "cart auth negatives"), () => {
  for (const ep of ENDPOINTS) {
    it(`WF-CART-1-S1-N1 — ${ep.method.toUpperCase()} ${ep.path} without a key -> 401`, async () => {
      await cartRequestIsRejected({ method: ep.method, path: ep.path, body: ep.body });
    });

    it(`WF-CART-1-S1-N2 — ${ep.method.toUpperCase()} ${ep.path} with a wrong key -> 401`, async () => {
      await cartRequestIsRejected({ method: ep.method, path: ep.path, body: ep.body, apiKey: "not-a-valid-key" });
    });
  }
});
