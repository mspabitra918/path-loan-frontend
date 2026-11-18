"use client";

import { useState, useTransition } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.pathloans.com";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const rawData = Object.fromEntries(formData.entries());

    const firstName = String(rawData.firstName || "").trim();
    const lastName = String(rawData.lastName || "").trim();
    const email = String(rawData.email || "").trim();
    const message = String(rawData.message || "").trim();
    const subject = String(rawData.subject || "general");

    // --- FRONTEND VALIDATION ---
    if (!firstName || !lastName || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    // Email format validation check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Message minimum length check (match backend Zod rule: >= 10 characters)
    if (message.length < 10) {
      setError("Too small: expected message to have >= 10 characters.");
      return;
    }

    // Payload ready for backend
    const data = {
      name: `${firstName} ${lastName}`,
      email,
      subject,
      message,
    };

    startTransition(async () => {
      try {
        const response = await fetch(`${API_URL}/api/contact`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => null);
          throw new Error(
            errData?.error || "Failed to send message. Please try again.",
          );
        }

        setSent(true);
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      }
    });
  }

  if (sent) {
    return (
      <div className="card form-success">
        <h3>Thanks — message received.</h3>
        <p>A member of our support team will reply within one business day.</p>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      {error && (
        <div
          className="form__error"
          style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}
        >
          ⚠️ {error}
        </div>
      )}
      <div className="form__row">
        <label>
          First name
          <input name="firstName" required disabled={isPending} />
        </label>
        <label>
          Last name
          <input name="lastName" required disabled={isPending} />
        </label>
      </div>
      <label>
        Email
        <input type="email" name="email" required disabled={isPending} />
      </label>
      <label>
        Subject
        <select name="subject" defaultValue="general" disabled={isPending}>
          <option value="general">General question</option>
          <option value="application">My application</option>
          <option value="payment">Payments</option>
          <option value="account">My account</option>
        </select>
      </label>
      <label>
        Message (min 10 characters)
        <textarea
          name="message"
          rows={5}
          required
          disabled={isPending}
          placeholder="Please type at least 10 characters..."
        />
      </label>
      <p className="form__hint">
        Please don't include your SSN or bank account numbers.
      </p>
      <button
        type="submit"
        className="btn btn--primary btn--lg"
        disabled={isPending}
      >
        {isPending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
