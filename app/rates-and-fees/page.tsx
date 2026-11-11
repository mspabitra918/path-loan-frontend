import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import { monthlyPayment, usd } from "@/lib/site";

export const metadata: Metadata = { title: "Rates & Fees" };

// Representative examples — replace with your actual approved pricing.
const examples = [
  { amount: 500, apr: 1.49, months: 6 },
  { amount: 1000, apr: 1.19, months: 9 },
  { amount: 1500, apr: 0.99, months: 12 },
  { amount: 2500, apr: 0.79, months: 18 },
].map((e) => {
  const pay = monthlyPayment(e.amount, e.apr, e.months);
  const total = pay * e.months;
  return { ...e, pay, total, charge: total - e.amount };
});

const fees = [
  ["Application fee", "$0"],
  ["Origination fee", "$0"],
  ["Prepayment penalty", "$0 — pay off any time"],
  ["Late fee", "Up to $15 or as permitted by law"],
  ["Returned payment (NSF) fee", "Up to $15 or as permitted by law"],
];

export default function RatesPage() {
  return (
    <>
      <PageHero
        eyebrow="Rates & Fees"
        title="Transparent pricing, no surprises"
        text="We believe you should know the full cost of your loan before you sign. Here's how our pricing works."
      />

      <section className="section">
        <div className="container">
          <div className="grid grid--3 stat-row">
            <div className="stat"><strong>$300 – $3,000</strong><span>Loan amounts</span></div>
            <div className="stat"><strong>6 – 18 months</strong><span>Repayment terms</span></div>
            <div className="stat"><strong>79% – 149%</strong><span>Example APR range*</span></div>
          </div>

          <div className="section__head section__head--left">
            <h2>Representative loan examples</h2>
            <p className="muted">
              Monthly payments assume on-time payments with no prepayment. Your APR is based on
              your application, credit profile and state of residence.
            </p>
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Loan amount</th>
                  <th>APR</th>
                  <th>Term</th>
                  <th>Monthly payment</th>
                  <th>Finance charge</th>
                  <th>Total of payments</th>
                </tr>
              </thead>
              <tbody>
                {examples.map((e) => (
                  <tr key={e.amount}>
                    <td>{usd(e.amount)}</td>
                    <td>{Math.round(e.apr * 100)}%</td>
                    <td>{e.months} months</td>
                    <td>{usd(e.pay, 2)}</td>
                    <td>{usd(e.charge, 2)}</td>
                    <td><strong>{usd(e.total, 2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="tiny">
            *Examples are illustrative only and are not an offer of credit. Actual rates, terms and
            availability vary by state.
          </p>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container split">
          <div>
            <span className="eyebrow">Fees</span>
            <h2>Fee schedule</h2>
            <p className="muted">
              We keep fees simple. Any applicable fee will be disclosed in your loan agreement
              before you sign.
            </p>
          </div>
          <ul className="fee-list card">
            {fees.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <strong>{v}</strong>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container grid grid--2">
          <div className="card">
            <h3>Understanding APR</h3>
            <p className="muted">
              Annual Percentage Rate (APR) expresses the yearly cost of borrowing, including
              interest. Because our loans are short-term, the total dollar cost is often more
              useful — that&apos;s why we always show your finance charge and total of payments.
            </p>
          </div>
          <div className="card">
            <h3>Save by paying early</h3>
            <p className="muted">
              Interest accrues on your outstanding principal. Making extra payments or paying your
              loan off early reduces the total interest you pay — with no penalty.
            </p>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
