"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { site, usd } from "@/lib/site";

const STEPS = ["Loan", "Personal", "Income", "Bank", "Review"] as const;

type Data = Record<string, string>;

export default function ApplyForm() {
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [data, setData] = useState<Data>({
    amount: params.get("amount") ?? "1000",
    term: params.get("term") ?? "12",
    purpose: "Emergency expense",
  });

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label>
      {label}
      <input name={name} value={data[name] ?? ""} onChange={set} required {...props} />
    </label>
  );

  if (done) {
    return (
      <div className="card form-success center">
        <div className="success-icon">✓</div>
        <h2>Application received!</h2>
        <p className="muted">
          Thanks, {data.firstName}. We&apos;re reviewing your request for {usd(Number(data.amount))}.
          You&apos;ll receive an email at {data.email} with your decision shortly.
        </p>
        <Link href="/" className="btn btn--primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        if (step < STEPS.length - 1) setStep(step + 1);
        // TODO: POST `data` to your backend / underwriting API
        else setDone(true);
      }}
    >
      <ol className="progress">
        {STEPS.map((s, i) => (
          <li key={s} className={i < step ? "is-done" : i === step ? "is-current" : ""}>
            <span>{i < step ? "✓" : i + 1}</span>
            {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <>
          <label>
            Loan amount: <strong>{usd(Number(data.amount))}</strong>
            <input
              type="range"
              name="amount"
              min={site.minLoan}
              max={site.maxLoan}
              step={50}
              value={data.amount}
              onChange={set}
              className="calc__range"
              style={{ "--pct": `${((Number(data.amount) - site.minLoan) / (site.maxLoan - site.minLoan)) * 100}%` } as React.CSSProperties}
            />
          </label>
          <label>
            Repayment term
            <select name="term" value={data.term} onChange={set}>
              {[6, 9, 12, 18].map((t) => (
                <option key={t} value={t}>{t} months</option>
              ))}
            </select>
          </label>
          <label>
            Purpose
            <select name="purpose" value={data.purpose} onChange={set}>
              {["Emergency expense", "Car repair", "Medical bill", "Home repair", "Bills / utilities", "Other"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </label>
        </>
      )}

      {step === 1 && (
        <>
          <div className="form__row">
            {field("firstName", "First name", { autoComplete: "given-name" })}
            {field("lastName", "Last name", { autoComplete: "family-name" })}
          </div>
          <div className="form__row">
            {field("email", "Email", { type: "email", autoComplete: "email" })}
            {field("phone", "Mobile phone", { type: "tel", autoComplete: "tel" })}
          </div>
          {field("dob", "Date of birth", { type: "date" })}
          {field("street", "Street address", { autoComplete: "street-address" })}
          <div className="form__row form__row--3">
            {field("city", "City", { autoComplete: "address-level2" })}
            {field("state", "State", { maxLength: 2, placeholder: "e.g. TX" })}
            {field("zip", "ZIP", { inputMode: "numeric", pattern: "\\d{5}", autoComplete: "postal-code" })}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <label>
            Income source
            <select name="incomeSource" value={data.incomeSource ?? "Employed"} onChange={set}>
              {["Employed", "Self-employed", "Benefits", "Retirement", "Other"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          {field("employer", "Employer / income provider")}
          <div className="form__row">
            {field("monthlyIncome", "Monthly net income ($)", { type: "number", min: 0 })}
            <label>
              Pay frequency
              <select name="payFrequency" value={data.payFrequency ?? "Bi-weekly"} onChange={set}>
                {["Weekly", "Bi-weekly", "Semi-monthly", "Monthly"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          </div>
          {field("nextPayDate", "Next pay date", { type: "date" })}
        </>
      )}

      {step === 3 && (
        <>
          {field("bankName", "Bank name")}
          <div className="form__row">
            {field("routing", "Routing number", { inputMode: "numeric", pattern: "\\d{9}", placeholder: "9 digits" })}
            {field("account", "Account number", { inputMode: "numeric", pattern: "\\d{4,17}" })}
          </div>
          <p className="form__hint">🔒 Your information is encrypted and used only to deposit funds and set up payments.</p>
        </>
      )}

      {step === 4 && (
        <>
          <dl className="review">
            <div><dt>Amount</dt><dd>{usd(Number(data.amount))}</dd></div>
            <div><dt>Term</dt><dd>{data.term} months</dd></div>
            <div><dt>Name</dt><dd>{data.firstName} {data.lastName}</dd></div>
            <div><dt>Email</dt><dd>{data.email}</dd></div>
            <div><dt>Income</dt><dd>{usd(Number(data.monthlyIncome || 0))} / mo</dd></div>
            <div><dt>Bank</dt><dd>{data.bankName} ••••{(data.account ?? "").slice(-4)}</dd></div>
          </dl>
          <label className="check">
            <input type="checkbox" required />
            <span>
              I agree to the Terms of Use, Privacy Policy and E-Sign Consent, and authorize{" "}
              {site.name} to verify the information I provided.
            </span>
          </label>
        </>
      )}

      <div className="form__nav">
        {step > 0 ? (
          <button type="button" className="btn btn--outline" onClick={() => setStep(step - 1)}>
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" className="btn btn--primary btn--lg">
          {step === STEPS.length - 1 ? "Submit Application" : "Continue →"}
        </button>
      </div>
    </form>
  );
}
