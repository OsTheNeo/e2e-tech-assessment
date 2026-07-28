"use client";

import { useMemo, useState } from "react";

const PRODUCTS = [
  { sku: "SKU-1001", name: "Cordless Drill", price: 129.99 },
  { sku: "SKU-1002", name: "Impact Driver", price: 149.5 },
  { sku: "SKU-1003", name: "Tool Bag", price: 39.0 },
  { sku: "SKU-2001", name: "Circular Saw", price: 199.0 },
];

export default function ProductsPage() {
  const [query, setQuery] = useState("");

  const visible = useMemo(
    () =>
      PRODUCTS.filter((product) =>
        `${product.sku} ${product.name}`.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [query],
  );

  return (
    <>
      <h1>Products</h1>

      <label htmlFor="product-search">
        Search
        <input
          id="product-search"
          type="search"
          placeholder="Search by name or SKU"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <p data-testid="result-count">{visible.length} products</p>

      {visible.length === 0 ? (
        <p data-testid="empty-state">No products match your search.</p>
      ) : (
        <ul data-testid="product-list">
          {visible.map((product) => (
            <li key={product.sku} data-testid="product-item" data-sku={product.sku}>
              <strong>{product.name}</strong>
              <div>{product.sku}</div>
              <div data-testid="price">${product.price.toFixed(2)}</div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
