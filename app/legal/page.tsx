import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { legalDocs } from "@/lib/legal";

export const metadata: Metadata = { title: "Legal" };

export default function LegalIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Policies & disclosures"
        text="Everything you agree to when you use our site or apply for a loan — written to be read."
      />
      <section className="section">
        <div className="container grid grid--3">
          {legalDocs.map((d) => (
            <Link key={d.slug} href={`/legal/${d.slug}`} className="feature legal-card">
              <h3>{d.title}</h3>
              <p>{d.summary}</p>
              <span className="legal-card__more">Read →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
