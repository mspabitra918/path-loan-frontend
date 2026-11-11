import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";

export const metadata: Metadata = { title: "How It Works" };

const steps = [
  {
    title: "Apply online",
    text: "Fill out our secure application in about five minutes. We'll ask for basic personal details, your income source and your checking account information.",
    points: ["No paperwork to print or fax", "Save and continue on any device", "Encrypted end to end"],
  },
  {
    title: "Get your decision",
    text: "We review your application right away. Some applicants may be asked for a quick verification, like a recent pay stub or a phone call.",
    points: ["Most decisions in minutes", "Clear reason if we can't approve", "No impact to your FICO® score to apply"],
  },
  {
    title: "Review and sign your agreement",
    text: "Before you commit, you'll see your loan amount, APR, finance charge, payment schedule and total of payments. Read it carefully and e-sign when you're ready.",
    points: ["All costs disclosed upfront", "Ask us anything before signing", "Rescind within the stated period"],
  },
  {
    title: "Receive your funds",
    text: "Once your agreement is signed, funds are sent by ACH to your bank account — often as soon as the next business day.",
    points: ["Direct deposit to your checking account", "Timing depends on your bank", "Email confirmation when sent"],
  },
  {
    title: "Repay on schedule",
    text: "Payments are automatically debited on your due dates. You can pay extra or pay off your balance at any time with no prepayment penalty.",
    points: ["Fixed installment amounts", "Pay early and save on interest", "Manage everything from your account"],
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        eyebrow="How It Works"
        title="A simple process, start to finish"
        text="Here's exactly what happens from the moment you apply until your loan is paid off."
      />
      <section className="section">
        <div className="container narrow">
          <ol className="steps-v">
            {steps.map((s, i) => (
              <li key={s.title} className="steps-v__item">
                <span className="steps-v__num">{i + 1}</span>
                <div className="card">
                  <h3>{s.title}</h3>
                  <p className="muted">{s.text}</p>
                  <ul className="checklist checklist--sm">
                    {s.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Before you apply</span>
            <h2>Eligibility requirements</h2>
          </div>
          <div className="grid grid--4">
            {[
              ["Age", "At least 18 years old (19 in some states)."],
              ["Income", "Regular income from employment, benefits or other verifiable sources."],
              ["Bank account", "An active checking account in your name that accepts ACH deposits."],
              ["Residency", "A U.S. resident in a state where we offer loans."],
            ].map(([t, d]) => (
              <div key={t} className="card">
                <h3>{t}</h3>
                <p className="muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
