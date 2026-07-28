# QA Automation — Technical Assessment

Two independent parts. Each ships a **worked example** you must follow, and
**exercises** you have to complete.

| Part | Stack | Folder | What you deliver |
|---|---|---|---|
| 1. Backend | pactum + jest + TypeScript | [`backend/`](./backend) | API tests for two modules |
| 2. Frontend | Playwright + Next.js | [`frontend/`](./frontend) | Page tests + a page that satisfies given tests |

Read the worked example **before** writing anything: the assessment is about
matching the structure and the reasoning, not only about going green.

## Requirements

- Node.js 20+ (tested on 24)
- npm 10+

## Quick start

```bash
# Part 1 — backend
cd backend
npm install
npm run test:e2e            # the provided example suite must pass: 6 tests

# Part 2 — frontend
cd ../frontend
npm install
npx playwright install chromium
npm run test:e2e            # the provided example suite must pass
```

## Part 1 — Backend (pactum)

Full instructions: [`backend/README.md`](./backend/README.md).

- **Example provided:** `WF-CATALOG-1` — a happy chain plus its negative cases.
- **Exercise 1:** `src/modules/cart.ts` has no tests and no test plan. Design
  the coverage yourself — positives, negatives, edge cases.
- **Exercise 2:** `src/modules/coupons.ts` — write the three negative cases
  listed in the backend README.

## Part 2 — Frontend (Playwright)

Full instructions: [`frontend/README.md`](./frontend/README.md).

- **Example provided:** `tests/example/products.spec.ts` against `/products`.
- **Exercise 1:** write the tests for the existing `/contact` page.
- **Exercise 2:** `tests/exercise-2/login.spec.ts` is given and currently fails —
  build `app/login/page.tsx` until it is green. Do not edit the tests.

## How you are evaluated

| Weight | Criterion |
|---|---|
| 30% | Structure — scenarios vs workflows, naming/ID convention, no duplicated requests |
| 25% | Assertion quality — meaningful contracts, not just status codes |
| 20% | Coverage — which cases you chose: happy path, negatives, edge cases, real risks |
| 15% | Readability — test names describe what the user gets |
| 10% | Everything runs from a clean checkout with the documented commands |

Deliver as a git repo or a zip with your changes, plus a short note on anything
you would add with more time.
