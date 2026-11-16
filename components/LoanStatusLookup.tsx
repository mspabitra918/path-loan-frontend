"use client";

import Link from "next/link";
import { useState } from "react";
import {
  currentStatusDisplay,
  fromBackendApplication,
  type ApplicationStatus,
  type BackendApplication,
} from "@/lib/application";
import { site, usd } from "@/lib/site";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://api.pathloans.com").replace(/\/+$/, "");

export default function LoanStatusLookup({ initialId = "" }: { initialId?: string }) {
  const [id, setId] = useState(initialId.replace(/\D/g, "").slice(0, 5));
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [app, setApp] = useState<ApplicationStatus | null>(null);

  async function lookup(e?: React.FormEvent) {
    e?.preventDefault();
    if (!id.trim() || !email.trim()) {
      setError("Enter your application ID and email.");
      return;
    }
    if (!/^\d{5}$/.test(id)) {
      setError("Your application ID is the 5-digit number from your confirmation email.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${API_URL}/api/application-status?${new URLSearchParams({ id, email: email.trim() })}`,
        { cache: "no-store" },
      );
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.application) {
        setApp(null);
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setApp(fromBackendApplication(json.application as BackendApplication));
    } catch {
      setError("We couldn't reach our servers. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (app) {
    const display = currentStatusDisplay(app.backendStatus);

    return (
      <div className="card status-card">
        <div className="status-card__head">
          <div>
            <span className="eyebrow">Application {app.id}</span>
            <h2>Hi {app.firstName}, here&apos;s your status.</h2>
          </div>
        </div>

        <dl className="status-summary">
          <div><dt>Requested</dt><dd>{usd(app.amount)}</dd></div>
          <div><dt>Term</dt><dd>{app.loanTerm} months</dd></div>
          <div><dt>Purpose</dt><dd>{app.purpose}</dd></div>
          <div><dt>Submitted</dt><dd>{new Date(app.submittedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</dd></div>
        </dl>

        <div className={`status-current status-current--${display.tone}`} role="status">
          <span className="status-current__label">Current status</span>
          <strong className="status-current__title">{display.label}</strong>
          <p>
            {display.text}
            {app.backendStatus === "request_a_call" && (
              <> Call us at <a href={`tel:${site.phone}`}>{site.phone}</a>.</>
            )}
          </p>
          {display.bankAction && (
            <Link
              href={`${display.bankAction.path}?applicationId=${encodeURIComponent(app.id)}`}
              className="btn btn--primary"
            >
              {display.bankAction.label}
            </Link>
          )}
        </div>

        <div className="status-card__actions">
          <button type="button" className="btn btn--primary" onClick={() => lookup()} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh status"}
          </button>
          <button type="button" className="btn btn--outline" onClick={() => setApp(null)}>
            Look up another
          </button>
        </div>
        <p className="tiny">
          Questions? Call <a href={`tel:${site.phone}`}>{site.phone}</a> or <Link href="/contact">contact us</Link>.
        </p>
      </div>
    );
  }

  return (
    <form className="card form" onSubmit={lookup} noValidate>
      <div className="field">
        <label htmlFor="status-id">Application ID</label>
        <input
          id="status-id"
          placeholder="12345"
          inputMode="numeric"
          maxLength={5}
          autoComplete="off"
          value={id}
          onChange={(e) => setId(e.target.value.replace(/\D/g, "").slice(0, 5))}
        />
      </div>
      <div className="field">
        <label htmlFor="status-email">Email address</label>
        <input
          id="status-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error && <p className="form-alert" role="alert">{error}</p>}
      <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
        {loading ? "Checking…" : "Check Status"}
      </button>
      <p className="form__hint">
        Haven&apos;t applied yet? <Link href="/apply">Start an application</Link>.
      </p>
    </form>
  );
}
