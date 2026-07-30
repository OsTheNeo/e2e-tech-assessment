# Notes

Both parts run green from a clean checkout — `npm run test:e2e` in `backend/` and in `frontend/`. I left `backend/src` and the given `login.spec.ts` untouched, so the example suites still pass as-is.

## How I structured it

I followed the split the catalog example sets up: every HTTP request lives in a scenario function that asserts its own response, and the workflow files don't make requests at all — they just chain scenarios and carry state between steps. For the negatives I didn't want to rewrite the same request five times, so each endpoint has one parametrized "rejected" helper (`addItemIsRejected`, `removeItemIsRejected`, `couponIsRejected`, `cartRequestIsRejected`) that takes the expected status and error and I feed it the different bad inputs.

On assertions I tried to check the actual contract rather than just the status code. A couple of cases share a status — both coupon failures are 409 (`coupon_expired` vs `coupon_already_redeemed`) and a few cart cases are 404 with different meanings ("Unknown cart" vs "Sku not in cart") — so I assert the error string/message there too, otherwise a test could go green for the wrong reason. Totals I check to the exact cent.

The part that took the most thought was the coupons. Redeeming mutates an in-memory coupon and nothing resets it between files, and the runner is single-process, so a careless test order would poison the others. I kept all the required negatives non-mutating (they short-circuit before the coupon is marked used) and put the one happy redemption in its own file on `SAVE10`, a code none of the negatives touch. That keeps the whole thing order-independent (`--repeat-each=2` passes).

For the cart I covered the happy lifecycle (create → add → read back → merge a duplicate sku → remove down to empty), plus the negatives: auth on every endpoint, unknown cart, the qty validation, unknown sku, and the delete cases. One I specifically pinned is that add-item checks qty *before* it checks the sku exists, so a bad sku with qty 0 comes back 400, not 404.

On the frontend, the one gotcha was reading errors: Next renders its own hidden `role="alert"` route announcer, so `getByRole('alert')` matches two elements. I read the error/success nodes by `data-testid` instead, and scoped the nav link with `exact: true` so "Contact" doesn't also match "Contact us".

## Things I noticed but didn't change (source is frozen)

- `POST /cart` is the only endpoint that returns 201; the rest are 200.
- Add-item order is unknown-cart → qty → sku, as mentioned above.
- Re-adding the same sku merges into one line, and the unit price is snapshotted from the catalog at add time.
- A missing key and a wrong key both come back 401 `unauthorized` — only the message differs.

## What I'd add with more time

Mostly security-flavoured things I'd want if this were a real cart: carts have no owner binding, so any valid key can read or mutate any cart by id — I'd add an ownership check and a test for it. There's also no upper bound on qty, so a single line can blow the total up to something absurd; I left a test documenting the current behaviour and would add a cap. Coupon redemption has no idempotency key and mutates shared state, which would double-apply under concurrency. And the static api key has no rate limiting.

On the testing side I'd add JSON-schema assertions on the payloads to catch shape drift, and an axe accessibility pass on the frontend pages.
