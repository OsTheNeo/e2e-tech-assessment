/**
 * WF-CART-1 — EXERCISE 1. Everything below is yours to write.
 * Reference: `wf-catalog-1.happy.workflow.ts` + its scenario file.
 */
import { TAGS, title } from "../config/tags";
import { chain } from "../support/chain";

const TAGSET = [TAGS.HAPPY];

describe(title("WF-CART-1-H", TAGSET, "describe the chain here"), () => {
  const { step } = chain();

  it.todo("WF-CART-1-S1 — your first step");
});
