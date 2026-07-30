"use client";

/** EXERCISE 2 — page built to satisfy `tests/exercise-2/login.spec.ts` (do not edit those tests). */
import { FormEvent, useState } from "react";

const VALID_EMAIL = "demo@store.test";
const VALID_PASSWORD = "secret123";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (!email.trim() || !password) {
      setError("Email and password are required");
      return;
    }

    const emailMatches = email.trim().toLowerCase() === VALID_EMAIL;
    if (!emailMatches || password !== VALID_PASSWORD) {
      setError("Invalid email or password");
      return;
    }

    setError(null);
    setSignedIn(true);
  }

  function signOut() {
    setSignedIn(false);
    setEmail("");
    setPassword("");
    setError(null);
  }

  if (signedIn) {
    return (
      <>
        <h1>Sign in</h1>
        {/* Canonical lowercase email, regardless of the casing the user typed. */}
        <p data-testid="welcome">Welcome back, {VALID_EMAIL}</p>
        <button type="button" onClick={signOut}>
          Sign out
        </button>
      </>
    );
  }

  return (
    <>
      <h1>Sign in</h1>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="login-email">
          Email
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label htmlFor="login-password">
          Password
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p data-testid="error">{error}</p>}

        <button type="submit">Sign in</button>
      </form>
    </>
  );
}
