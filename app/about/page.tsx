import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import CtaBanner from "@/components/CtaBanner";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "About Us" };

const values = [
  { icon: "🧭", title: "Transparency", text: "Every cost is disclosed before you sign. No buried fees, no confusing terms." },
  { icon: "🛡️", title: "Responsibility", text: "We assess affordability and encourage borrowing only what you need." },
  { icon: "💬", title: "Respect", text: "Our support team treats every customer with patience and courtesy." },
  { icon: "🚀", title: "Simplicity", text: "Modern technology that makes borrowing fast and stress-free." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={`The people behind ${site.name}`}
        text="We started with a simple idea: borrowing money in an emergency shouldn't be confusing or stressful."
      />

      <section className="section">
        <div className="container split">
          <div>
            <span className="eyebrow">Our story</span>
            <h2>Credit that works for everyday people</h2>
            <p className="muted">
              Millions of Americans face unexpected expenses each year without savings to cover
              them. Traditional banks often aren&apos;t an option, and many alternatives hide their true
              cost.
            </p>
            <p className="muted">
              {site.name} was built to offer a better path: installment loans with clear terms,
              predictable payments and customer service from real people. We combine smart
              technology with a human touch to make fast decisions while treating every applicant
              fairly.
            </p>
          </div>
          <div className="stat-stack">
            <div className="stat"><strong>50,000+</strong><span>Customers served</span></div>
            <div className="stat"><strong>4.8 / 5</strong><span>Average rating</span></div>
            <div className="stat"><strong>6 days</strong><span>Weekly support</span></div>
          </div>
        </div>
      </section>

      <section className="section section--tint">
        <div className="container">
          <div className="section__head">
            <span className="eyebrow">What we stand for</span>
            <h2>Our values</h2>
          </div>
          <div className="grid grid--4">
            {values.map((v) => (
              <div key={v.title} className="feature">
                <span className="feature__icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container narrow center">
          <span className="eyebrow">Responsible lending</span>
          <h2>Our commitment to you</h2>
          <p className="muted">
            We follow applicable federal consumer protection laws, including the Truth in Lending
            Act, Equal Credit Opportunity Act and Fair Debt Collection Practices Act. If you&apos;re
            having trouble making a payment, contact us — we&apos;ll work with you on options.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
