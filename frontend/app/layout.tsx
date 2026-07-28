import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Assessment Store",
  description: "Frontend technical assessment app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav aria-label="Main">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/login">Sign in</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
