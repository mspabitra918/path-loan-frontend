import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import FaqAccordion, { type FaqItem } from "@/components/FaqAccordion";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ" };

const groups: { title: string; items: FaqItem[] }[] = [
  {
    title: "Applying",
    items: [
      { q: "Who can apply?", a: "You must be at least 18 years old (19 in some states), have a steady source of income, an active checking account, a valid email address and phone number, and live in a state where we lend." },
      { q: "Will applying affect my credit score?", a: "Submitting an application will not affect your FICO® score. We may use alternative credit data and specialty consumer reporting agencies to evaluate your application." },
      { q: "Can I apply with bad credit?", a: "Yes. We look at more than your credit score, including your income and banking history. Approval is not guaranteed." },
      { q: "How long does the application take?", a: "Most people finish in about five minutes. Decisions are often made within minutes, though some applications require additional verification." },
    ],
  },
  {
    title: "Funding",
    items: [
      { q: "How much can I borrow?", a: `Loan amounts range from $${site.minLoan.toLocaleString()} to $${site.maxLoan.toLocaleString()}. First-time customers may qualify for smaller amounts; returning customers in good standing may qualify for more.` },
      { q: "When will I get my money?", a: "If approved and your agreement is signed before 4pm ET on a business day, funds are typically deposited the next business day. Timing depends on your bank." },
    ],
  },
  {
    title: "Repayment",
    items: [
      { q: "How do I make payments?", a: "Payments are automatically debited from your checking account on each due date. You can also make manual payments from your online account." },
      { q: "Can I pay off my loan early?", a: "Absolutely. There is no prepayment penalty, and paying early reduces the total interest you pay." },
      { q: "What if I can't make a payment?", a: "Contact us before your due date. Our team will review options with you, which may include adjusting your payment date." },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        text="Quick answers about applying, funding and repaying your loan."
      />
      <section className="section">
        <div className="container narrow">
          {groups.map((g) => (
            <div key={g.title} className="faq-group">
              <h2>{g.title}</h2>
              <FaqAccordion items={g.items} />
            </div>
          ))}
          <div className="card center">
            <h3>Still have questions?</h3>
            <p className="muted">Our support team is available {site.hours}.</p>
            <Link href="/contact" className="btn btn--primary">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
