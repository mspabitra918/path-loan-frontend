"use client";

import Link from "next/link";
import { useState } from "react";
import { ILLUSTRATIVE_APR, monthlyPayment, site, usd } from "@/lib/site";

const TERMS = [6, 9, 12, 18];

export default function LoanCalculator() {
  const [amount, setAmount] = useState(1200);
  const [term, setTerm] = useState(12);

  const payment = monthlyPayment(amount, ILLUSTRATIVE_APR, term);
  const total = payment * term;
  const pct = ((amount - site.minLoan) / (site.maxLoan - site.minLoan)) * 100;

  return (
    <div className="calc">
      <div className="calc__head">
        <span>How much do you need?</span>
        <strong>{usd(amount)}</strong>
      </div>

      <input
        type="range"
        min={site.minLoan}
        max={site.maxLoan}
        step={50}
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="calc__range"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        aria-label="Loan amount"
      />
      <div className="calc__scale">
        <span>{usd(site.minLoan)}</span>
        <span>{usd(site.maxLoan)}</span>
      </div>

      <div className="calc__label">Repayment term</div>
      <div className="calc__terms" role="radiogroup" aria-label="Repayment term">
        {TERMS.map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={term === t}
            className={term === t ? "is-active" : ""}
            onClick={() => setTerm(t)}
          >
            {t} mo
          </button>
        ))}
      </div>

      <div className="calc__result">
        <div>
          <span>Est. monthly payment</span>
          <strong>{usd(payment, 2)}</strong>
        </div>
        <div>
          <span>Est. total repaid</span>
          <strong>{usd(total, 2)}</strong>
        </div>
      </div>

      <Link href={`/apply?amount=${amount}&term=${term}`} className="btn btn--primary btn--block btn--lg">
        Check My Options
      </Link>
      <p className="calc__note">
        Illustrative only, based on {Math.round(ILLUSTRATIVE_APR * 100)}% APR. Your actual rate and
        terms depend on approval and state of residence.
      </p>
    </div>
  );
}
