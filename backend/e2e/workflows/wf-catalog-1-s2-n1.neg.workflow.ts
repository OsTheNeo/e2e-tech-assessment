/**
 * WF-CATALOG-1-NEG — catalog read, step 2 branches (WORKED EXAMPLE)
 *
 * WF-CATALOG-1 (happy) reaches S2 with a valid api key and a real SKU. This
 * spec branches instead: no usable key, or a SKU that does not exist.
 * Read-only, so it is safe to run anywhere.
 *
 * | ID                  | Condition          | Expected |
 * |---------------------|--------------------|----------|
 * | WF-CATALOG-1-S2-N1  | Missing api key    | 401      |
 * | WF-CATALOG-1-S2-N2  | Wrong api key      | 401      |
 * | WF-CATALOG-1-S3-N1  | Unknown SKU        | 404      |
 */
import { TAGS, title } from "../config/tags";
import { productIsNotFound, productsAreRejected } from "../scenarios/catalog/getProducts.scenario";

const TAGSET = [TAGS.EXAMPLE, TAGS.NEGATIVE];

describe(title("WF-CATALOG-1", TAGSET, "catalog negatives"), () => {
  it("WF-CATALOG-1-S2-N1 — missing api key -> 401", async () => {
    await productsAreRejected();
  });

  it("WF-CATALOG-1-S2-N2 — wrong api key -> 401", async () => {
    await productsAreRejected({ apiKey: "not-a-valid-key" });
  });

  it("WF-CATALOG-1-S3-N1 — unknown sku -> 404", async () => {
    await productIsNotFound("SKU-DOES-NOT-EXIST");
  });
});
