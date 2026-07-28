/**
 * WF-CATALOG-1-H — Catalog read chain (WORKED EXAMPLE)
 *
 * User gets: a storefront consumer can list products and re-read one of them
 * by SKU — the SKU is carried forward between steps.
 *
 * | Step | Scenario                | Assert                             |
 * |------|-------------------------|------------------------------------|
 * | S1   | `serviceIsReady`        | 200, service reachable             |
 * | S2   | `listFirstProductPage`  | totalItems > 0; capture skuNumber  |
 * | S3   | `readProductBySku`      | same SKU echoed back               |
 *
 * Assertions live in `e2e/scenarios/**`; this file only chains them.
 * Negatives for this workflow: `wf-catalog-1-s2-n1.neg.workflow.ts`.
 */
import { TAGS, title } from "../config/tags";
import { serviceIsReady } from "../scenarios/health/ready.scenario";
import {
  listFirstProductPage,
  readProductBySku,
} from "../scenarios/catalog/getProducts.scenario";
import { chain } from "../support/chain";

const TAGSET = [TAGS.EXAMPLE, TAGS.HAPPY, TAGS.SMOKE];

describe(title("WF-CATALOG-1-H", TAGSET, "catalog list -> SKU read-back"), () => {
  /** Carried from S2 into S3. */
  let skuNumber: string;
  const { step } = chain();

  it(
    "WF-CATALOG-1-S1 — service is ready",
    step("S1", async () => {
      await serviceIsReady();
    }),
  );

  it(
    "WF-CATALOG-1-S2 — first catalog page returns a SKU",
    step("S2", async () => {
      const page = await listFirstProductPage();
      skuNumber = page.data[0].skuNumber;
    }),
  );

  it(
    "WF-CATALOG-1-S3 — captured SKU reads back",
    step("S3", async () => {
      const product = await readProductBySku(skuNumber);
      expect(product.brandId).toBe("CC");
    }),
  );
});
