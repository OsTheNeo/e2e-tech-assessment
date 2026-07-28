import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <h1>Assessment Store</h1>
      <p data-testid="tagline">A tiny storefront used by the Playwright exercises.</p>
      <ul>
        <li>
          <Link href="/products">Browse products</Link> — covered by the worked example test.
        </li>
        <li>
          <Link href="/contact">Contact us</Link> — Exercise 1: write the tests for this page.
        </li>
        <li>
          <Link href="/login">Sign in</Link> — Exercise 2: make the provided tests pass.
        </li>
      </ul>
    </>
  );
}
