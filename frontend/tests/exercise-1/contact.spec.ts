/**
 * EXERCISE 1 — starting point for the `/contact` tests.
 * Reference: `tests/example/products.spec.ts`.
 */
import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test.fixme("renders the contact form", async ({ page }) => {
    // Replace with your tests.
    await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();
  });
});
