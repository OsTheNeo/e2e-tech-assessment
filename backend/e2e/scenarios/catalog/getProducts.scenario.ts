/** One exported function per scenario; workflow specs only chain them. */
import { spec } from "pactum";
import { env } from "../../config/env";
import { authHeaders } from "../../support/auth";

export type Product = {
  skuNumber: string;
  brandId: string;
  locale: string;
  name: string;
  price: number;
};

export type ProductsPage = {
  totalItems: number;
  pgIndex: number;
  pgSize: number;
  data: Product[];
};

type ListArgs = {
  brandId?: string;
  locale?: string;
  pgSize?: number;
  pgIndex?: number;
};

/** Returns the page so the caller can carry a SKU forward. */
export async function listFirstProductPage(args: ListArgs = {}): Promise<ProductsPage> {
  const response = await spec()
    .get("/products")
    .withHeaders(authHeaders())
    .withQueryParams({
      brandId: args.brandId ?? env.fixtures.brandId,
      locale: args.locale ?? env.fixtures.locale,
      pgSize: args.pgSize ?? 1,
      pgIndex: args.pgIndex ?? 0,
    })
    .expectStatus(200)
    .toss();

  const page = response.json as ProductsPage;

  expect(page.totalItems).toBeGreaterThan(0);
  expect(page.data.length).toBeGreaterThan(0);
  expect(typeof page.data[0].skuNumber).toBe("string");
  expect(page.data[0].skuNumber.length).toBeGreaterThan(0);

  return page;
}

export async function readProductBySku(skuNumber: string): Promise<Product> {
  const response = await spec()
    .get(`/products/${skuNumber}`)
    .withHeaders(authHeaders())
    .expectStatus(200)
    .toss();

  const product = response.json as Product;

  expect(product.skuNumber).toBe(skuNumber);
  expect(typeof product.name).toBe("string");
  expect(product.price).toBeGreaterThan(0);

  return product;
}

export async function productsAreRejected(
  { apiKey, expectedStatus = 401 }: { apiKey?: string; expectedStatus?: number } = {},
): Promise<void> {
  const headers: Record<string, string> = {};
  if (apiKey) headers["x-api-key"] = apiKey;

  await spec()
    .get("/products")
    .withHeaders(headers)
    .expectStatus(expectedStatus)
    .expectJsonLike({ error: "unauthorized" });
}

export async function productIsNotFound(skuNumber: string): Promise<void> {
  await spec()
    .get(`/products/${skuNumber}`)
    .withHeaders(authHeaders())
    .expectStatus(404)
    .expectJsonLike({ error: "not_found" });
}
