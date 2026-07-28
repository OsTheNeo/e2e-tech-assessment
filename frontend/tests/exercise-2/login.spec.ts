/**
 * EXERCISE 2 — these tests are GIVEN. Do not edit them.
 * `app/login/page.tsx` does not exist: build the page until this suite is green.
 *
 * Valid credentials: demo@store.test / secret123
 */
import { test, expect } from "@playwright/test";

test.describe("Sign in page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("renders the sign-in form", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("masks the password field", async ({ page }) => {
    await expect(page.getByLabel("Password")).toHaveAttribute("type", "password");
  });

  test("rejects an empty submit", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByTestId("error")).toHaveText("Email and password are required");
    await expect(page.getByTestId("welcome")).toHaveCount(0);
  });

  test("rejects wrong credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("demo@store.test");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByTestId("error")).toHaveText("Invalid email or password");
    await expect(page.getByTestId("welcome")).toHaveCount(0);
  });

  test("signs in with valid credentials", async ({ page }) => {
    await page.getByLabel("Email").fill("demo@store.test");
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByTestId("welcome")).toHaveText("Welcome back, demo@store.test");
    await expect(page.getByTestId("error")).toHaveCount(0);
    await expect(page.getByLabel("Email")).toHaveCount(0);
  });

  test("clears the error once the credentials are fixed", async ({ page }) => {
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByTestId("error")).toBeVisible();

    await page.getByLabel("Email").fill("DEMO@store.test");
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByTestId("welcome")).toHaveText("Welcome back, demo@store.test");
  });

  test("signing out returns to the form", async ({ page }) => {
    await page.getByLabel("Email").fill("demo@store.test");
    await page.getByLabel("Password").fill("secret123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByTestId("welcome")).toBeVisible();

    await page.getByRole("button", { name: "Sign out" }).click();

    await expect(page.getByLabel("Email")).toHaveValue("");
    await expect(page.getByTestId("welcome")).toHaveCount(0);
  });
});
