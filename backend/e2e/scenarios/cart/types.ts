/**
 * Local cart types for the e2e layer — decoupled from `src/` on purpose so the
 * suite tests the wire contract, not the server's internal types.
 */
export type CartItem = { skuNumber: string; qty: number; unitPrice: number };

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
  couponCode: string | null;
};

/** Fixtures for cart scenarios (seed data lives in `src/data.ts`, frozen). */
export const CART_FIXTURES = {
  /** A real, in-catalog SKU used as the default add-item target. */
  skuNumber: "SKU-1001",
  unitPrice: 129.99,
  /** A cheaper real SKU, handy for below-minimum coupon carts. */
  cheapSku: "SKU-1003",
  cheapPrice: 39.0,
} as const;
