# Part 2 — Frontend testing with Playwright

A small Next.js (App Router) app plus a Playwright suite. One page is fully covered as the example; one page needs tests, one page needs to be built.

## Setup

```bash
npm install
npx playwright install chromium
npm run test:e2e
```

`playwright.config.ts` starts Next.js itself (`webServer`), so there is no separate server to run. An already-running dev server on :3000 is reused.

### Commands

| Command                                | What it runs                                  |
| -------------------------------------- | --------------------------------------------- |
| `npm run test:e2e`                     | The whole Playwright suite                    |
| `npm run test:e2e:example`             | Only the provided example                     |
| `npm run test:e2e -- tests/exercise-2` | One folder                                    |
| `npm run test:e2e -- -g "signs in"`    | One test by name                              |
| `npm run test:e2e:ui`                  | Playwright UI mode — best while writing tests |
| `npm run test:e2e:report`              | Opens the HTML report of the last run         |
| `npm run dev`                          | The app alone on http://localhost:3000        |

## Layout

| Path                   | Purpose                                                 |
| ---------------------- | ------------------------------------------------------- |
| `app/`                 | The Next.js app: `/`, `/products`, `/contact`, `/login` |
| `tests/example/`       | Worked example — read it first                          |
| `tests/exercise-1/`    | Exercise 1 — your tests go here                         |
| `tests/exercise-2/`    | Exercise 2 — tests given, do not edit                   |
| `playwright.config.ts` | Runner, `baseURL`, `webServer`                          |

## Conventions the exercises must follow

- One `test.describe` per page/feature, navigation in `beforeEach`.
- User-facing locators first: `getByRole`, `getByLabel`, `getByText`.
  `getByTestId` only when there is no accessible handle.
- Web-first assertions (`await expect(locator).toHaveText(...)`) — never
  `waitForTimeout`, never manual sleeps.
- One behaviour per test; name it after what the user gets, not the mechanics.
- Tests must be independent and order-free.

Note: Next.js renders its own hidden `role="alert"` route announcer, so `getByRole("alert")` matches two elements. The example uses `getByTestId("error")` for that reason.

Worked example: `tests/example/products.spec.ts` against `app/products/page.tsx`.

---

## Exercise 1 — Write the tests for `/contact`

The page already exists (`app/contact/page.tsx`). `tests/exercise-1/contact.spec.ts` is an empty starting point (one `test.fixme` placeholder — delete it). Fill it in following `tests/example/products.spec.ts`, covering:

- the form renders: heading `Contact us`, fields `Name`, `Email`, `Message`, button `Send message`
- submitting with any empty field shows `All fields are required` (`data-testid="error"`) and no success message
- an email without `@` shows `Enter a valid email`
- a valid submit replaces the form with `Thanks, {name}! We'll reply to {email}.` (`data-testid="success"`)
- the page is reachable from the main navigation
- If you want, you can provide more test cases for the page.

Aim for one test per behaviour, not one giant test.

## Exercise 2 — Make the given tests pass (`/login`)

`tests/exercise-2/login.spec.ts` is **given and must not be edited**. `app/login/page.tsx` does not exist, so the suite fails. Build the page until it is green.

Run only this suite while you work:

```bash
npm run test:e2e -- tests/exercise-2
```

Requirements implied by the tests (a client component is enough — no backend):

| Behaviour         | Expected                                                                          |
| ----------------- | --------------------------------------------------------------------------------- |
| Heading           | `Sign in`                                                                         |
| Fields            | `Email`, `Password` (password input `type="password"`)                            |
| Submit            | button labelled `Sign in`                                                         |
| Empty submit      | `data-testid="error"` with `Email and password are required`                      |
| Wrong credentials | `data-testid="error"` with `Invalid email or password`                            |
| Valid credentials | `demo@store.test` / `secret123` (email case-insensitive)                          |
| Signed in         | `data-testid="welcome"` with `Welcome back, demo@store.test`, form gone, no error |
| Sign out          | button `Sign out` returns to an empty form                                        |

Keep the labels associated with their inputs (`<label for>` or wrapping label) — `getByLabel` depends on it.

## Checklist before you submit

- [ ] `npm run test:e2e` is green from a clean `npm install`
- [ ] `tests/exercise-2/login.spec.ts` is unmodified
- [ ] No `waitForTimeout` / arbitrary sleeps
- [ ] Locators are role/label based wherever the DOM allows it
- [ ] Tests pass when run in any order (`--repeat-each=2` is a good check)
