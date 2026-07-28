/** In-memory store, reset on every process start. */
export type Product = {
  skuNumber: string;
  brandId: string;
  locale: string;
  name: string;
  price: number;
};

export type CartItem = { skuNumber: string; qty: number; unitPrice: number };
export type Cart = { id: string; items: CartItem[]; total: number; couponCode: string | null };

export type Coupon = {
  code: string;
  /** Percentage off, 1-100 */
  percentOff: number;
  /** Minimum cart total required to redeem */
  minTotal: number;
  /** ISO date; a coupon past this date is expired */
  expiresAt: string;
  /** Single-use coupons flip to true once redeemed */
  redeemed: boolean;
};

export const products: Product[] = [
  { skuNumber: "SKU-1001", brandId: "CC", locale: "en-US", name: "Cordless Drill", price: 129.99 },
  { skuNumber: "SKU-1002", brandId: "CC", locale: "en-US", name: "Impact Driver", price: 149.5 },
  { skuNumber: "SKU-1003", brandId: "CC", locale: "en-US", name: "Tool Bag", price: 39.0 },
  { skuNumber: "SKU-2001", brandId: "DW", locale: "en-US", name: "Circular Saw", price: 199.0 },
];

export const carts = new Map<string, Cart>();

export const coupons = new Map<string, Coupon>([
  ["SAVE10", { code: "SAVE10", percentOff: 10, minTotal: 50, expiresAt: "2999-01-01", redeemed: false }],
  ["SAVE25", { code: "SAVE25", percentOff: 25, minTotal: 300, expiresAt: "2999-01-01", redeemed: false }],
  ["EXPIRED5", { code: "EXPIRED5", percentOff: 5, minTotal: 0, expiresAt: "2020-01-01", redeemed: false }],
  ["USEDONCE", { code: "USEDONCE", percentOff: 15, minTotal: 0, expiresAt: "2999-01-01", redeemed: true }],
]);

/** Key every authenticated route expects in the `x-api-key` header. */
export const API_KEY = "assessment-key";
