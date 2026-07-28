/** WORKED EXAMPLE — /products. Conventions the exercises should follow. */
import { test, expect } from "@playwright/test";

test.describe("Products page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products");
  });

  test("lists every product on first load", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
    await expect(page.getByTestId("product-item")).toHaveCount(4);
    await expect(page.getByTestId("result-count")).toHaveText("4 products");
  });

  test("shows a product's SKU and price", async ({ page }) => {
    const drill = page.getByTestId("product-item").filter({ hasText: "Cordless Drill" });

    await expect(drill).toHaveAttribute("data-sku", "SKU-1001");
    await expect(drill.getByTestId("price")).toHaveText("$129.99");
  });

  test("filters the list as the user types", async ({ page }) => {
    await page.getByLabel("Search").fill("saw");

    await expect(page.getByTestId("product-item")).toHaveCount(1);
    await expect(page.getByTestId("product-item")).toContainText("Circular Saw");
    await expect(page.getByTestId("result-count")).toHaveText("1 products");
  });

  test("shows an empty state when nothing matches", async ({ page }) => {
    await page.getByLabel("Search").fill("hammer");

    await expect(page.getByTestId("product-list")).toHaveCount(0);
    await expect(page.getByTestId("empty-state")).toHaveText("No products match your search.");
  });

  test("is reachable from the home page", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Products" }).click();

    await expect(page).toHaveURL(/\/products$/);
    await expect(page.getByRole("heading", { name: "Products" })).toBeVisible();
  });
});
