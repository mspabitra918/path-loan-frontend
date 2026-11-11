import Link from "next/link";
import LoanCalculator from "@/components/LoanCalculator";
import CtaBanner from "@/components/CtaBanner";
import { site, usd } from "@/lib/site";

const steps = [
  { n: "01", title: "Tell us about you", text: "A short, secure online form — income, bank details and the amount you need." },
  { n: "02", title: "Get a decision", text: "Most applicants see a decision within minutes. No hidden questions." },
  { n: "03", title: "Review & e-sign", text: "See your exact APR, payment schedule and total cost before you sign." },
  { n: "04", title: "Receive funds", text: "Money is deposited as soon as the next business day.*" },
];

const features = [
  { icon: "⚡", title: "Fast decisions", text: "An online process built to give you an answer in minutes, not days." },
  { icon: "🔍", title: "No hidden fees", text: "No application fee, no prepayment penalty. What you see is what you pay." },
  { icon: "📅", title: "Fixed payments", text: "Equal installments on a set schedule, so you always know what's due." },
  { icon: "💸", title: "Pay off early, save", text: "Interest accrues on your balance — paying early means paying less." },
  { icon: "🔒", title: "Bank-level security", text: "256-bit encryption protects your personal and financial data." },
  { icon: "🤝", title: "Real people", text: "U.S.-based support specialists, six days a week." },
];

const testimonials = [
  { name: "Danielle R.", text: "The whole process took one lunch break. Everything was spelled out before I signed.", rating: 5 },
  { name: "Marcus T.", text: "My car broke down two days before payday. Funds were in my account the next morning.", rating: 5 },
  { name: "Priya S.", text: "I paid my loan off early and the savings showed up right away. Support was friendly too.", rating: 5 },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero__bg" aria-hidden="true" />
        <div className="container hero__grid">
          <div className="hero__copy">
            <span className="pill">
              <span className="pill__dot" /> Decisions in minutes · Funds next business day*
            </span>
            <h1>
              Life doesn&apos;t wait.
              <br />
              <span className="text-amber">Neither should you.</span>
            </h1>
            <p className="hero__lead">
              Borrow {usd(site.minLoan)} to {usd(site.maxLoan)} with an installment loan that fits
              your budget — clear terms, fixed payments and no prepayment penalties.
            </p>
            <div className="hero__actions">
              <Link href="/apply" className="btn btn--amber btn--lg">Apply Now</Link>
              <Link href="/how-it-works" className="btn btn--ghost-light btn--lg">See How It Works</Link>
            </div>
            <ul className="hero__trust">
              <li><strong>5 min</strong><span>to apply</span></li>
              <li><strong>$0</strong><span>application fee</span></li>
              <li><strong>4.8★</strong><span>customer rating</span></li>
            </ul>
          </div>
          <div className="hero__calc">
            <LoanCalculator />
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Simple process</span>
            <h2>From application to funds in four steps</h2>
          </div>
          <div className="timeline">
            {steps.map((s) => (
              <div key={s.n} className="timeline__item">
                <span className="timeline__num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPLIT */}
      <section className="section section--tint">
        <div className="container split">
          <div className="split__visual" aria-hidden="true">
            <div className="mock-card">
              <div className="mock-card__top">
                <span>Loan approved</span>
                <span className="badge badge--green">✓ Funded</span>
              </div>
              <strong className="mock-card__amt">{usd(1500)}</strong>
              <div className="mock-card__bar"><span style={{ width: "35%" }} /></div>
              <div className="mock-card__row"><span>Next payment</span><span>Dec 15</span></div>
              <div className="mock-card__row"><span>Payments left</span><span>8 of 12</span></div>
            </div>
            <div className="mock-chip">🔒 256-bit encrypted</div>
          </div>
          <div>
            <span className="eyebrow">Built for real life</span>
            <h2>When an unexpected bill shows up, we&apos;re ready.</h2>
            <p className="muted">
              Car repairs, medical bills, a security deposit — {site.name} helps bridge the gap
              with a loan you repay in predictable installments instead of a single lump sum.
            </p>
            <ul className="checklist">
              <li>Manage payments from your online account</li>
              <li>Automatic payments so you never miss a due date</li>
              <li>Returning customers may qualify for better rates</li>
            </ul>
            <Link href="/rates-and-fees" className="btn btn--primary">View Rates & Fees</Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Why {site.name}</span>
            <h2>Borrowing, without the fine-print surprises</h2>
          </div>
          <div className="grid grid--3">
            {features.map((f) => (
              <div key={f.title} className="feature">
                <span className="feature__icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="section section--dark">
        <div className="container split split--center">
          <div>
            <span className="eyebrow eyebrow--light">Eligibility</span>
            <h2>What you&apos;ll need to apply</h2>
            <p className="muted-light">
              Have these ready and most applications take about five minutes.
            </p>
          </div>
          <ul className="req-grid">
            <li><span>18+</span>Be at least 18 years old</li>
            <li><span>💼</span>Steady source of income</li>
            <li><span>🏦</span>Active checking account</li>
            <li><span>✉️</span>Valid email &amp; phone number</li>
          </ul>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">Customer stories</span>
            <h2>Trusted by thousands of borrowers</h2>
          </div>
          <div className="grid grid--3">
            {testimonials.map((t) => (
              <figure key={t.name} className="quote">
                <div className="quote__stars">{"★".repeat(t.rating)}</div>
                <blockquote>&ldquo;{t.text}&rdquo;</blockquote>
                <figcaption>— {t.name}</figcaption>
              </figure>
            ))}
          </div>
          <p className="tiny center">Testimonials shown are sample placeholders for design purposes.</p>
        </div>
      </section>

      <CtaBanner />

      <p className="container tiny">
        *Funding timing depends on application approval time and your bank. Applications approved
        before 4pm ET on business days are typically funded the next business day.
      </p>
    </>
  );
}
