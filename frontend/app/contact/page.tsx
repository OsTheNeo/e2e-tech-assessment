"use client";

/** EXERCISE 1 — no tests exist for this page. Write them. */
import { FormEvent, useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }

    setError(null);
    setSent(true);
  }

  if (sent) {
    return (
      <>
        <h1>Contact us</h1>
        <p data-testid="success">
          Thanks, {name}! We&apos;ll reply to {email}.
        </p>
      </>
    );
  }

  return (
    <>
      <h1>Contact us</h1>

      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="contact-name">
          Name
          <input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label htmlFor="contact-email">
          Email
          <input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label htmlFor="contact-message">
          Message
          <textarea id="contact-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>

        {error && (
          <p role="alert" data-testid="error">
            {error}
          </p>
        )}

        <button type="submit">Send message</button>
      </form>
    </>
  );
}
