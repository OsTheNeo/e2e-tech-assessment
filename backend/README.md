# Part 1 — Backend API testing with pactum

A small Express API (`src/`) plus an E2E suite (`e2e/`) written with [pactum](https://pactumjs.github.io/) and jest. One workflow is fully worked out as the example; two modules are left for you.

## Setup

```bash
npm install
npm run test:e2e
```

That is the whole setup — no `.env`, no credentials, no server to start by hand. The test run boots the API itself (`e2e/setup/globalSetup.ts`) on `http://localhost:4010/api/v1`. Authenticated routes take a static header: `x-api-key: assessment-key`.

The example suite must pass out of the box: **2 suites, 6 tests**.

### Commands

| Command                                   | What it runs                                                  |
| ----------------------------------------- | ------------------------------------------------------------- |
| `npm run test:e2e`                        | The whole E2E suite                                           |
| `npm run test:e2e:example`                | Only the provided example (`@example`)                        |
| `npm run test:e2e:happy`                  | Only happy chains (`@happy`)                                  |
| `npm run test:e2e:neg`                    | Only negative cases (`@negative`)                             |
| `npm run test:e2e -- -t "WF-CATALOG-1-H"` | One workflow by ID                                            |
| `npm start`                               | Runs the API on :4010 (handy for exploring with curl/Postman) |

```bash
curl -H "x-api-key: assessment-key" "http://localhost:4010/api/v1/products?pgSize=2"
```

## Layout

| Path                             | Purpose                                                                 |
| -------------------------------- | ----------------------------------------------------------------------- |
| `src/**`                         | The API under test — **do not change it**                               |
| `e2e/config/env.ts`              | Base URL, api key, fixtures (plain constants)                           |
| `e2e/config/tags.ts`             | CI tags + `title()` helper (the tag goes in the test name)              |
| `e2e/setup/`                     | API bootstrap + pactum defaults, once per run                           |
| `e2e/support/auth.ts`            | The `x-api-key` header helper                                           |
| `e2e/support/chain.ts`           | Fail-fast chains: the first failed step stops the rest                  |
| `e2e/scenarios/**/*.scenario.ts` | One exported function per scenario — the request **and** its assertions |
| `e2e/workflows/*.workflow.ts`    | One file per workflow ID — chains scenarios, one `it` per step          |

Only `*.workflow.ts` files are picked up by jest (`jest.e2e.config.js`).

## The rule: scenarios vs workflows

Requests and their assertions never live in a workflow spec. Each scenario is a standalone function in `scenarios/{domain}/{operation}.scenario.ts` that:

- takes explicit args (falling back to `env.fixtures`),
- asserts its own response contract,
- returns typed data so the caller can carry an ID to the next step.

A workflow spec then reads as the chain itself — one `it` per `-S{n}` step, shared state in `let` between them:

```ts
it(
  "WF-CATALOG-1-S2 — first catalog page returns a SKU",
  step("S2", async () => {
    const page = await listFirstProductPage();
    skuNumber = page.data[0].skuNumber;
  }),
);
```

The same scenario functions are reused by negative specs with different args (e.g. `productsAreRejected({ apiKey })`), so no request is written twice.

## IDs, file names and tags

| ID                          | Meaning           | File                                 |
| --------------------------- | ----------------- | ------------------------------------ |
| `WF-{DOMAIN}-{N}-H`         | Happy chain       | `wf-catalog-1.happy.workflow.ts`     |
| `WF-{DOMAIN}-{N}-S{s}-N{v}` | One negative case | `wf-catalog-1-s2-n1.neg.workflow.ts` |

Titles are built with `title(id, tags, description)` →
`WF-CATALOG-1-H @example @happy @l1-smoke — catalog list -> SKU read-back`,
so `jest -t` doubles as the tag filter.

Tags: `@happy`, `@negative`, `@l0-sanity`, `@l1-smoke`, `@l2-regression`.

## Worked example — read this first

| File                                               | What to look at                                              |
| -------------------------------------------------- | ------------------------------------------------------------ |
| `e2e/scenarios/catalog/getProducts.scenario.ts`    | Scenario functions, contract assertions, reuse for negatives |
| `e2e/workflows/wf-catalog-1.happy.workflow.ts`     | The chain: state carried between steps, `chain()` fail-fast  |
| `e2e/workflows/wf-catalog-1-s2-n1.neg.workflow.ts` | Negative cases documented as a table                         |

---

## Exercise 1 — Cart module (`src/modules/cart.ts`)

No tests exist for this module, and **no test plan is given on purpose**. The source in `src/modules/cart.ts` is the only specification you get: read it, run the API (`npm start`) and explore it, then decide what deserves a test.

This exercise is about your judgement. Be inventive: cover the happy path, the negative cases, the edge cases and anything you consider a real risk in a cart — the list is yours to build, and what you choose to test says more than the count of tests.

**Start from** `e2e/workflows/wf-cart-1.happy.workflow.ts` — an empty `describe` with the imports already wired. Scenarios go under `e2e/scenarios/cart/`; add as many workflow files as your coverage needs, following the worked example.

Assert the _contract_, not just the status code. If you find behaviour that looks wrong or under-specified, write the test that exposes it and say so in your notes.

## Exercise 2 — Coupons module (`src/modules/coupons.ts`)

Only the negative cases are asked for here. `POST /coupons/redeem` with body `{ cartId, code }`, api key required. Seeded coupons:

| Code       | % off | Min. cart total | Status           |
| ---------- | ----- | --------------- | ---------------- |
| `SAVE10`   | 10    | 50              | valid            |
| `SAVE25`   | 25    | 300             | valid            |
| `EXPIRED5` | 5     | 0               | expired          |
| `USEDONCE` | 15    | 0               | already redeemed |

**Deliver** `e2e/workflows/wf-coupon-1-s1-n1.neg.workflow.ts` plus the scenario file it needs (`e2e/scenarios/coupons/redeemCoupon.scenario.ts`), covering:

| ID                  | Condition                                                      | Expected                             |
| ------------------- | -------------------------------------------------------------- | ------------------------------------ |
| `WF-COUPON-1-S1-N1` | Unknown coupon code                                            | `404` `{ error: "unknown_coupon" }`  |
| `WF-COUPON-1-S1-N2` | Expired coupon (`EXPIRED5`)                                    | `409` `{ error: "coupon_expired" }`  |
| `WF-COUPON-1-S1-N3` | Cart total below the coupon minimum (`SAVE25` on a cheap cart) | `422` `{ error: "minimum_not_met" }` |

Notes:

- Build the cart you need in `beforeAll` — reuse your Exercise 1 scenarios.
- Coupon state is in-memory and mutates: redeeming `SAVE10` flips it to
  redeemed for the rest of the run. Keep negatives non-mutating, or account for
  the order.
- Bonus (optional): `WF-COUPON-1-H`, the happy redemption, asserting
  `discount == subtotal * percentOff / 100`.

## Checklist before you submit

- [ ] `npm run test:e2e` is green from a clean `npm install`
- [ ] No request built inside a `*.workflow.ts` file
- [ ] Every test title carries its `WF-...` ID and tags
- [ ] Chains use `chain()` so a failed step stops the rest
- [ ] No hardcoded URLs in the specs — use `e2e/config/env.ts`
