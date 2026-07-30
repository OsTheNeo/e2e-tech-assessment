/**
 * EXERCISE 1 — tests for the `/contact` page.
 * One behaviour per test, named after what the user gets.
 * Reference: `tests/example/products.spec.ts`.
 *
 * Errors/success are read via `getByTestId` because Next renders its own hidden
 * `role="alert"` route announcer, which would make `getByRole("alert")` ambiguous.
 */
import { test, expect } from "@playwright/test";

test.describe("Contact page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("shows the contact form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();
    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Message")).toBeVisible();
    await expect(page.getByRole("button", { name: "Send message" })).toBeVisible();
  });

  test("rejects a submit with any empty field", async ({ page }) => {
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByTestId("error")).toHaveText("All fields are required");
    await expect(page.getByTestId("success")).toHaveCount(0);
  });

  test("rejects an email without an @", async ({ page }) => {
    await page.getByLabel("Name").fill("Bob");
    await page.getByLabel("Email").fill("bob.example.com");
    await page.getByLabel("Message").fill("Hello there");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByTestId("error")).toHaveText("Enter a valid email");
    await expect(page.getByTestId("success")).toHaveCount(0);
  });

  test("confirms the message on a valid submit", async ({ page }) => {
    await page.getByLabel("Name").fill("Ada");
    await page.getByLabel("Email").fill("ada@example.com");
    await page.getByLabel("Message").fill("Loved the drill.");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByTestId("success")).toHaveText("Thanks, Ada! We'll reply to ada@example.com.");
    await expect(page.getByRole("button", { name: "Send message" })).toHaveCount(0);
  });

  test("treats whitespace-only fields as empty", async ({ page }) => {
    await page.getByLabel("Name").fill("   ");
    await page.getByLabel("Email").fill("   ");
    await page.getByLabel("Message").fill("   ");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByTestId("error")).toHaveText("All fields are required");
    await expect(page.getByTestId("success")).toHaveCount(0);
  });

  test("is reachable from the main navigation", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Contact", exact: true }).click();

    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { name: "Contact us" })).toBeVisible();
  });
});
