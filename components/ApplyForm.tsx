"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import {
  accountAges,
  accountTypes,
  balanceBands,
  defaultIncomeSource,
  employedStatuses,
  employmentStatuses,
  housingStatuses,
  incomeSources,
  labelFor,
  loanPurposes,
  loanTermOptions,
  months,
  payFrequencies,
  usStates,
  yearsAtAddressOptions,
  type Option as ApplyOption,
} from "@/components/apply/options";
import {
  AMOUNT_STEP,
  MAX_AMOUNT,
  MIN_AMOUNT,
  emptyApplication,
  type ApplicationFormData,
  type FieldOf,
  type Section,
} from "@/components/apply/types";
import {
  formatPhone,
  formatSsn,
  stepSection,
  validateApplication,
  validators,
  type Errors as FormErrors,
  type StepId,
} from "@/components/apply/validation";
import { digits, type ApplicationStatus } from "@/lib/application";
import { site, usd } from "@/lib/site";

type Option = string | [value: string | number, label: string];
type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const opts = (list: ApplyOption[]): Option[] =>
  list.map((o) => [o.value, o.label]);

const STEPS: { key: StepId; label: string }[] = [
  { key: "loan", label: "Loan" },
  { key: "personal", label: "Personal" },
  { key: "employment", label: "Income" },
  { key: "banking", label: "Bank" },
  { key: "review", label: "Review" },
];

const STATE_OPTIONS = opts(usStates);
const STATE_CODES: Option[] = usStates.map((o) => o.value);
const THIS_YEAR = new Date().getFullYear();
const DOB_YEARS = Array.from({ length: 83 }, (_, i) =>
  String(THIS_YEAR - 18 - i),
);
const DOB_DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));

const isoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function Field({
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

export default function ApplyForm({
  initialAmount,
  initialTerm,
}: {
  initialAmount?: number;
  initialTerm?: number;
}) {
  const [data, setData] = useState(() =>
    emptyApplication(initialAmount, initialTerm),
  );
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSsn, setShowSsn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<ApplicationStatus | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /* ---------- state helpers ---------- */

  function set<S extends Section, K extends FieldOf<S>>(
    s: S,
    k: K,
    v: ApplicationFormData[S][K],
  ) {
    setData((d) => ({ ...d, [s]: { ...d[s], [k]: v } }));
    const keys = [`${s}.${k}`];
    if (k.startsWith("dob")) keys.push("personal.dob");
    if (k === "accountNumber") keys.push("banking.confirmAccountNumber");
    setErrors((e) => {
      if (!keys.some((key) => key in e)) return e;
      const next = { ...e };
      keys.forEach((key) => delete next[key]);
      return next;
    });
  }

  const a11y = (key: string, hint?: boolean) => ({
    id: key,
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key]
      ? `${key}-err`
      : hint
        ? `${key}-hint`
        : undefined,
  });

  const focusFirstError = () =>
    requestAnimationFrame(() =>
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"]')
        ?.focus(),
    );

  const goTo = (i: number) => {
    setStep(i);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ---------- field renderers ---------- */

  function text<S extends Section>(
    s: S,
    k: FieldOf<S>,
    label: string,
    props: InputProps = {},
    opts: { hint?: string; optional?: boolean } = {},
  ) {
    const key = `${s}.${k}`;
    return (
      <Field
        id={key}
        label={label}
        error={errors[key]}
        hint={opts.hint}
        optional={opts.optional}
      >
        <input
          {...a11y(key, !!opts.hint)}
          value={String(data[s][k] ?? "")}
          onChange={(e) => set(s, k, e.target.value as never)}
          {...props}
        />
      </Field>
    );
  }

  /** Inputs that store digits only but display a formatted value (phone, SSN). */
  function masked<S extends Section>(
    s: S,
    k: FieldOf<S>,
    label: string,
    format: (v: string) => string,
    max: number,
    props: InputProps = {},
    opts: { hint?: string; optional?: boolean } = {},
  ) {
    const key = `${s}.${k}`;
    return (
      <Field
        id={key}
        label={label}
        error={errors[key]}
        hint={opts.hint}
        optional={opts.optional}
      >
        <input
          {...a11y(key, !!opts.hint)}
          inputMode="numeric"
          value={format(String(data[s][k] ?? ""))}
          onChange={(e) =>
            set(s, k, digits(e.target.value).slice(0, max) as never)
          }
          {...props}
        />
      </Field>
    );
  }

  function num<S extends Section>(
    s: S,
    k: FieldOf<S>,
    label: string,
    props: InputProps = {},
    hint?: string,
  ) {
    const key = `${s}.${k}`;
    const v = data[s][k] as number;
    return (
      <Field id={key} label={label} error={errors[key]} hint={hint}>
        <input
          {...a11y(key, !!hint)}
          type="number"
          inputMode="numeric"
          value={Number.isFinite(v) ? v : ""}
          onChange={(e) =>
            set(
              s,
              k,
              (e.target.value === "" ? NaN : Number(e.target.value)) as never,
            )
          }
          {...props}
        />
      </Field>
    );
  }

  function select<S extends Section>(
    s: S,
    k: FieldOf<S>,
    label: string,
    options: Option[],
    opts: { numeric?: boolean; onPick?: (v: string) => void } = {},
  ) {
    const key = `${s}.${k}`;
    const raw = data[s][k];
    const value =
      typeof raw === "number"
        ? Number.isFinite(raw)
          ? String(raw)
          : ""
        : String(raw ?? "");
    return (
      <Field id={key} label={label} error={errors[key]}>
        <select
          {...a11y(key)}
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            set(
              s,
              k,
              (opts.numeric ? (v === "" ? NaN : Number(v)) : v) as never,
            );
            opts.onPick?.(v);
          }}
        >
          <option value="" disabled>
            Select…
          </option>
          {options.map((o) => {
            const [val, lab] = Array.isArray(o) ? o : [o, o];
            return (
              <option key={val} value={val}>
                {lab}
              </option>
            );
          })}
        </select>
      </Field>
    );
  }

  function consent(k: FieldOf<"consent">, children: React.ReactNode) {
    const key = `consent.${k}`;
    return (
      <div className="field">
        <label className="check">
          <input
            type="checkbox"
            {...a11y(key)}
            checked={data.consent[k]}
            onChange={(e) => set("consent", k, e.target.checked)}
          />
          <span>{children}</span>
        </label>
        {errors[key] && (
          <p className="field__error" id={`${key}-err`}>
            {errors[key]}
          </p>
        )}
      </div>
    );
  }

  /* ---------- navigation & submit ---------- */

  async function submit() {
    const all = validateApplication(data);
    if (Object.keys(all).length) return showErrors(all);

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors) showErrors(json.errors);
        setSubmitError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(json.application);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "We couldn't reach our servers. Check your connection and try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function showErrors(errs: FormErrors) {
    setErrors(errs);
    const first = STEPS.findIndex((st) =>
      Object.keys(errs).some((key) =>
        key.startsWith(`${stepSection(st.key)}.`),
      ),
    );
    if (first !== -1 && first !== step) goTo(first);
    focusFirstError();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const stepErrors = validators[STEPS[step].key](data);
    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      focusFirstError();
      return;
    }
    setErrors({});
    if (step < STEPS.length - 1) goTo(step + 1);
    else submit();
  }

  /* ---------- success ---------- */

  if (result) {
    return (
      <div className="card form-success center">
        <div className="success-icon">✓</div>
        <h2>Application received!</h2>
        <p className="muted">
          Thanks, {result.firstName}. We&apos;re reviewing your request for{" "}
          {usd(result.amount)} over {result.loanTerm} months. We&apos;ll email{" "}
          {data.personal.email} as soon as your decision is ready.
        </p>
        <div className="ref-box">
          <span>Your application ID</span>
          <strong>{result.id}</strong>
          <small>
            Save this — you&apos;ll need it with your email to check your
            status.
          </small>
        </div>
        {result.needsBankVerification && (
          <p className="muted">
            Next step: securely verify your bank account so we can finish
            reviewing your application.
          </p>
        )}
        <div className="form-success__actions">
          {result.needsBankVerification ? (
            <Link
              href={`/verify-bank?applicationId=${encodeURIComponent(result.id)}`}
              className="btn btn--primary btn--lg"
            >
              Verify My Bank
            </Link>
          ) : null}
          <Link
            href={`/loan-status?id=${encodeURIComponent(result.id)}`}
            className={`btn ${result.needsBankVerification ? "btn--outline" : "btn--primary"} btn--lg`}
          >
            Track My Application
          </Link>
          {!result.needsBankVerification && (
            <Link href="/" className="btn btn--outline btn--lg">
              Back to Home
            </Link>
          )}
        </div>
      </div>
    );
  }

  /* ---------- form ---------- */

  const { loan, personal: p, employment: em, banking: b } = data;
  const amountPct =
    ((Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, loan.amount || MIN_AMOUNT)) -
      MIN_AMOUNT) /
      (MAX_AMOUNT - MIN_AMOUNT)) *
    100;
  const employed = employedStatuses.includes(em.employmentStatus);
  const selfEmployed = em.employmentStatus === "self_employed";
  const today = new Date();
  const maxPay = new Date(today);
  maxPay.setDate(maxPay.getDate() + 45);

  return (
    <form
      ref={formRef}
      className="card form apply-form"
      onSubmit={onSubmit}
      noValidate
    >
      <ol className="progress">
        {STEPS.map((s, i) => (
          <li
            key={s.key}
            className={i < step ? "is-done" : i === step ? "is-current" : ""}
            aria-current={i === step ? "step" : undefined}
          >
            <span>{i < step ? "✓" : i + 1}</span>
            {s.label}
          </li>
        ))}
      </ol>

      {/* STEP 1 — LOAN */}
      {step === 0 && (
        <>
          <div className="form__section-title">
            <h2>Your loan</h2>
            <p className="muted">
              Borrow {usd(MIN_AMOUNT)} to {usd(MAX_AMOUNT)}. Checking your
              options won&apos;t affect your credit score.
            </p>
          </div>

          <div className="field">
            <label htmlFor="loan.amount">
              How much would you like to borrow?
            </label>
            <div className="amount-display">
              {Number.isFinite(loan.amount) ? usd(loan.amount) : "—"}
            </div>
            <input
              type="range"
              aria-label="Loan amount slider"
              min={MIN_AMOUNT}
              max={MAX_AMOUNT}
              step={AMOUNT_STEP}
              value={Number.isFinite(loan.amount) ? loan.amount : MIN_AMOUNT}
              onChange={(e) => set("loan", "amount", Number(e.target.value))}
              className="calc__range"
              style={{ "--pct": `${amountPct}%` } as React.CSSProperties}
            />
            <div className="calc__scale">
              <span>{usd(MIN_AMOUNT)}</span>
              <span>{usd(MAX_AMOUNT)}</span>
            </div>
          </div>
          <div className="form__row">
            {num("loan", "amount", "Or enter an exact amount ($)", {
              min: MIN_AMOUNT,
              max: MAX_AMOUNT,
              step: AMOUNT_STEP,
            })}
            {select(
              "loan",
              "loanTerm",
              "Repayment term",
              loanTermOptions.map((t) => [t.value, `${t.value} months`]),
              { numeric: true },
            )}
          </div>
          {select(
            "loan",
            "purpose",
            "What's the loan for?",
            opts(loanPurposes),
          )}
          {loan.purpose === "other" &&
            text("loan", "otherPurpose", "Please describe", { maxLength: 120 })}
        </>
      )}

      {/* STEP 2 — PERSONAL */}
      {step === 1 && (
        <>
          <div className="form__section-title">
            <h2>About you</h2>
            <p className="muted">
              Use your legal name exactly as it appears on your ID.
            </p>
          </div>
          <div className="form__row">
            {text("personal", "firstName", "First name", {
              autoComplete: "given-name",
            })}
            {text("personal", "lastName", "Last name", {
              autoComplete: "family-name",
            })}
          </div>
          <div className="form__row">
            {text("personal", "email", "Email", {
              type: "email",
              autoComplete: "email",
            })}
            {masked("personal", "phone", "Mobile phone", formatPhone, 10, {
              type: "tel",
              autoComplete: "tel-national",
              placeholder: "(555) 555-5555",
            })}
          </div>

          <fieldset className="fieldset">
            <legend>Date of birth</legend>
            <div className="form__row form__row--dob">
              {(
                [
                  ["dobMonth", "Month", opts(months)],
                  ["dobDay", "Day", DOB_DAYS],
                  ["dobYear", "Year", DOB_YEARS],
                ] as const
              ).map(([k, lab, opts]) => (
                <select
                  key={k}
                  aria-label={`Birth ${lab.toLowerCase()}`}
                  aria-invalid={errors["personal.dob"] ? true : undefined}
                  aria-describedby={
                    errors["personal.dob"] ? "personal.dob-err" : undefined
                  }
                  value={p[k]}
                  onChange={(e) => set("personal", k, e.target.value)}
                  autoComplete={
                    k === "dobMonth"
                      ? "bday-month"
                      : k === "dobDay"
                        ? "bday-day"
                        : "bday-year"
                  }
                >
                  <option value="" disabled>
                    {lab}
                  </option>
                  {opts.map((o) => {
                    const [val, l] = Array.isArray(o) ? o : [o, o];
                    return (
                      <option key={val} value={val}>
                        {l}
                      </option>
                    );
                  })}
                </select>
              ))}
            </div>
            {errors["personal.dob"] && (
              <p className="field__error" id="personal.dob-err">
                {errors["personal.dob"]}
              </p>
            )}
          </fieldset>

          <div className="field">
            <label htmlFor="personal.ssn">Social Security number</label>
            <div className="input-addon">
              <input
                {...a11y("personal.ssn", true)}
                type={showSsn ? "text" : "password"}
                inputMode="numeric"
                autoComplete="off"
                placeholder="123-45-6789"
                value={formatSsn(p.ssn)}
                onChange={(e) =>
                  set("personal", "ssn", digits(e.target.value).slice(0, 9))
                }
              />
              <button
                type="button"
                className="input-addon__btn"
                onClick={() => setShowSsn((v) => !v)}
                aria-pressed={showSsn}
              >
                {showSsn ? "Hide" : "Show"}
              </button>
            </div>
            {errors["personal.ssn"] ? (
              <p className="field__error" id="personal.ssn-err">
                {errors["personal.ssn"]}
              </p>
            ) : (
              <p className="field__hint" id="personal.ssn-hint">
                🔒 Encrypted. Used to verify your identity and check your
                credit.
              </p>
            )}
          </div>

          <div className="form__row">
            {text("personal", "dlNumber", "Driver's license / state ID #", {
              autoComplete: "off",
            })}
            {select("personal", "dlState", "Issuing state", STATE_OPTIONS)}
          </div>

          {text(
            "personal",
            "streetAddress",
            "Street address",
            { autoComplete: "address-line1" },
            { hint: "No P.O. boxes, please." },
          )}
          {text(
            "personal",
            "addressLine2",
            "Apt, suite, unit",
            { autoComplete: "address-line2" },
            { optional: true },
          )}
          <div className="form__row form__row--3">
            {text("personal", "city", "City", {
              autoComplete: "address-level2",
            })}
            {select("personal", "state", "State", STATE_CODES)}
            {masked("personal", "zip", "ZIP", (v) => v, 5, {
              autoComplete: "postal-code",
            })}
          </div>

          <div className="form__row form__row--3eq">
            {select(
              "personal",
              "yearsAtAddress",
              "Time at address",
              opts(yearsAtAddressOptions),
              { numeric: true },
            )}
            {select(
              "personal",
              "housingStatus",
              "Housing status",
              opts(housingStatuses),
            )}
            {num(
              "personal",
              "monthlyHousingCost",
              "Monthly rent / mortgage ($)",
              { min: 0, step: 1 },
            )}
          </div>
        </>
      )}

      {/* STEP 3 — EMPLOYMENT & INCOME */}
      {step === 2 && (
        <>
          <div className="form__section-title">
            <h2>Employment &amp; income</h2>
            <p className="muted">
              We use this to make sure your payments fit your budget.
            </p>
          </div>
          {select(
            "employment",
            "employmentStatus",
            "Employment status",
            opts(employmentStatuses),
            {
              onPick: (v) => {
                if (!em.incomeSource && defaultIncomeSource[v])
                  set("employment", "incomeSource", defaultIncomeSource[v]);
              },
            },
          )}

          {employed && (
            <>
              <div className="form__row">
                {text(
                  "employment",
                  "employerName",
                  selfEmployed ? "Business name" : "Employer name",
                  { autoComplete: "organization" },
                )}
                {text("employment", "jobTitle", "Job title", {
                  autoComplete: "organization-title",
                })}
              </div>
              <div className="form__row">
                {num(
                  "employment",
                  "employmentLengthMo",
                  "Months with this employer",
                  { min: 0, max: 720, step: 1 },
                  "e.g. 2 years = 24",
                )}
                {masked(
                  "employment",
                  "employerPhone",
                  "Work phone",
                  formatPhone,
                  10,
                  { type: "tel", placeholder: "(555) 555-5555" },
                  { optional: selfEmployed },
                )}
              </div>
            </>
          )}

          <div className="form__row">
            {select(
              "employment",
              "incomeSource",
              "Primary income source",
              opts(incomeSources),
            )}
            <Field
              id="employment.netMonthlyIncome"
              label="Monthly take-home pay ($)"
              error={errors["employment.netMonthlyIncome"]}
              hint="After taxes and deductions."
            >
              <div className="input-prefix">
                <span aria-hidden="true">$</span>
                <input
                  {...a11y("employment.netMonthlyIncome", true)}
                  inputMode="decimal"
                  placeholder="3,500"
                  value={em.netMonthlyIncome}
                  onChange={(e) =>
                    set(
                      "employment",
                      "netMonthlyIncome",
                      e.target.value.replace(/[^\d.]/g, ""),
                    )
                  }
                />
              </div>
            </Field>
          </div>
          <div className="form__row">
            {select(
              "employment",
              "payFrequency",
              "How often are you paid?",
              opts(payFrequencies),
            )}
            {text("employment", "nextPayDate", "Next pay date", {
              type: "date",
              min: isoDate(today),
              max: isoDate(maxPay),
            })}
          </div>
        </>
      )}

      {/* STEP 4 — BANKING */}
      {step === 3 && (
        <>
          <div className="form__section-title">
            <h2>Bank account</h2>
            <p className="muted">
              Where we&apos;ll deposit your funds. It must be an account in your
              name.
            </p>
          </div>
          <div className="form__row">
            {text("banking", "bankName", "Bank name", { autoComplete: "off" })}
            {select(
              "banking",
              "accountType",
              "Account type",
              opts(accountTypes),
            )}
          </div>
          {masked(
            "banking",
            "routingNumber",
            "Routing number",
            (v) => v,
            9,
            { autoComplete: "off", placeholder: "9 digits" },
            { hint: "The first 9-digit number at the bottom of a check." },
          )}
          <div className="form__row">
            {masked(
              "banking",
              "accountNumber",
              "Account number",
              (v) => v,
              17,
              { autoComplete: "off" },
            )}
            {masked(
              "banking",
              "confirmAccountNumber",
              "Confirm account number",
              (v) => v,
              17,
              { autoComplete: "off", onPaste: (e) => e.preventDefault() },
            )}
          </div>
          <div className="form__row">
            {select(
              "banking",
              "accountAge",
              "How long has it been open?",
              opts(accountAges),
            )}
            {select(
              "banking",
              "currentBalanceBand",
              "Typical balance",
              opts(balanceBands),
            )}
          </div>

          <fieldset className="fieldset">
            <legend>Is your income direct-deposited into this account?</legend>
            <div className="choice-row">
              {([true, false] as const).map((v) => (
                <label
                  key={String(v)}
                  className={`choice ${b.directDeposit === v ? "is-active" : ""}`}
                >
                  <input
                    type="radio"
                    name="directDeposit"
                    checked={b.directDeposit === v}
                    onChange={() => set("banking", "directDeposit", v)}
                    aria-invalid={
                      errors["banking.directDeposit"] ? true : undefined
                    }
                    aria-describedby={
                      errors["banking.directDeposit"]
                        ? "banking.directDeposit-err"
                        : undefined
                    }
                  />
                  {v ? "Yes" : "No"}
                </label>
              ))}
            </div>
            {errors["banking.directDeposit"] && (
              <p className="field__error" id="banking.directDeposit-err">
                {errors["banking.directDeposit"]}
              </p>
            )}
          </fieldset>
          <p className="form__hint">
            🔒 Your information is encrypted and used only to deposit funds and
            set up payments.
          </p>
        </>
      )}

      {/* STEP 5 — REVIEW & CONSENT */}
      {step === 4 && (
        <>
          <div className="form__section-title">
            <h2>Review &amp; submit</h2>
            <p className="muted">
              Double-check your details, then agree to the disclosures below.
            </p>
          </div>

          {(
            [
              [
                0,
                "Loan",
                [
                  ["Amount", usd(loan.amount)],
                  ["Term", `${loan.loanTerm} months`],
                  [
                    "Purpose",
                    loan.purpose === "other"
                      ? loan.otherPurpose
                      : labelFor(loanPurposes, loan.purpose),
                  ],
                ],
              ],
              [
                1,
                "Personal",
                [
                  ["Name", `${p.firstName} ${p.lastName}`],
                  ["Email", p.email],
                  ["Phone", formatPhone(p.phone)],
                  [
                    "Date of birth",
                    `${labelFor(months, p.dobMonth)} ${p.dobDay}, ${p.dobYear}`,
                  ],
                  ["SSN", `•••-••-${p.ssn.slice(-4)}`],
                  [
                    "Address",
                    [
                      p.streetAddress,
                      p.addressLine2,
                      `${p.city}, ${p.state} ${p.zip}`,
                    ]
                      .filter(Boolean)
                      .join(", "),
                  ],
                ],
              ],
              [
                2,
                "Income",
                [
                  [
                    "Employment",
                    employed
                      ? `${labelFor(employmentStatuses, em.employmentStatus)} · ${em.employerName}`
                      : labelFor(employmentStatuses, em.employmentStatus),
                  ],
                  ["Take-home pay", `${usd(Number(em.netMonthlyIncome))} / mo`],
                  [
                    "Paid",
                    `${labelFor(payFrequencies, em.payFrequency)} · next ${em.nextPayDate}`,
                  ],
                ],
              ],
              [
                3,
                "Bank",
                [
                  [
                    "Bank",
                    `${b.bankName} (${labelFor(accountTypes, b.accountType)})`,
                  ],
                  [
                    "Account",
                    `Routing ${b.routingNumber} · ••••${b.accountNumber.slice(-4)}`,
                  ],
                  ["Direct deposit", b.directDeposit ? "Yes" : "No"],
                ],
              ],
            ] as [number, string, [string, string][]][]
          ).map(([i, title, rows]) => (
            <div key={title} className="review-block">
              <div className="review-block__head">
                <h3>{title}</h3>
                <button
                  type="button"
                  className="link-btn"
                  onClick={() => goTo(i)}
                >
                  Edit
                </button>
              </div>
              <dl className="review">
                {rows.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}

          <div className="consents">
            {consent(
              "esign",
              <>
                I consent to receive disclosures and sign documents
                electronically under the{" "}
                <Link href="/legal/e-sign-consent" target="_blank">
                  E-Sign Consent
                </Link>
                .
              </>,
            )}
            {consent(
              "privacy",
              <>
                I have read and agree to the{" "}
                <Link href="/legal/privacy-policy" target="_blank">
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link href="/legal/terms-of-use" target="_blank">
                  Terms of Use
                </Link>
                .
              </>,
            )}
            {consent(
              "creditPull",
              <>
                I authorize {site.name} and its partners to obtain my consumer
                credit report and verify the information I provided, as
                described in the{" "}
                <Link href="/legal/credit-authorization" target="_blank">
                  Credit Authorization
                </Link>
                .
              </>,
            )}
            {consent(
              "tcpa",
              <>
                <span className="field__opt">(Optional)</span> I agree to
                receive calls and texts, including autodialed or prerecorded
                messages, about my application and account at the number
                provided, per the{" "}
                <Link href="/legal/tcpa-consent" target="_blank">
                  Communications Consent
                </Link>
                . Consent is not a condition of credit. Msg &amp; data rates may
                apply.
              </>,
            )}
          </div>

          {submitError && (
            <p className="form-alert" role="alert">
              {submitError}
            </p>
          )}
        </>
      )}

      <div className="form__nav">
        {step > 0 ? (
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => goTo(step - 1)}
            disabled={submitting}
          >
            ← Back
          </button>
        ) : (
          <span />
        )}
        <button
          type="submit"
          className="btn btn--primary btn--lg"
          disabled={submitting}
        >
          {step === STEPS.length - 1
            ? submitting
              ? "Submitting…"
              : "Submit Application"
            : "Continue →"}
        </button>
      </div>
    </form>
  );
}
