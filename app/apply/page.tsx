import type { Metadata } from "next";
import Link from "next/link";
import ApplyForm from "@/components/ApplyForm";
import { LOAN_TERMS, clampAmount } from "@/lib/application";

export const metadata: Metadata = {
  title: "Apply",
  description: "Apply online in about 5 minutes. Checking your options won't affect your credit score.",
};

export default async function ApplyPage({
  searchParams,
}: {
  searchParams: Promise<{ amount?: string; term?: string }>;
}) {
  const { amount, term } = await searchParams;
  const a = Number(amount);
  const t = Number(term);

  return (
    <section className="section apply">
      <div className="container apply__grid">
        <aside className="apply__aside">
          <span className="eyebrow">Application</span>
          <h1 className="apply__title">Let&apos;s get you an answer</h1>
          <p className="muted">
            It takes about 5 minutes. Checking your options uses a soft inquiry and won&apos;t affect
            your FICO® score.
          </p>
          <ul className="checklist checklist--sm">
            <li>Government-issued ID</li>
            <li>Social Security number</li>
            <li>Income &amp; employer details</li>
            <li>Checking or savings account</li>
          </ul>
          <p className="tiny">
            Already applied? <Link href="/loan-status">Check your application status</Link>.
          </p>
        </aside>
        <div>
          <ApplyForm
            initialAmount={Number.isFinite(a) && a > 0 ? clampAmount(a) : undefined}
            initialTerm={LOAN_TERMS.includes(t) ? t : undefined}
          />
        </div>
      </div>
    </section>
  );
}
