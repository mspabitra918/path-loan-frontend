import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { getLegalDoc, legalDocs, slugify } from "@/lib/legal";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const doc = getLegalDoc((await params).slug);
  return doc ? { title: doc.title, description: doc.summary } : {};
}

export default async function LegalDocPage({ params }: Params) {
  const doc = getLegalDoc((await params).slug);
  if (!doc) notFound();

  return (
    <>
      <PageHero eyebrow="Legal" title={doc.title} text={doc.summary} />
      <section className="section">
        <div className="container legal-grid">
          <aside className="legal-nav">
            <h4>Legal documents</h4>
            <ul>
              {legalDocs.map((d) => (
                <li key={d.slug}>
                  <Link href={`/legal/${d.slug}`} className={d.slug === doc.slug ? "is-active" : ""} aria-current={d.slug === doc.slug ? "page" : undefined}>
                    {d.title}
                  </Link>
                </li>
              ))}
            </ul>
            <h4>On this page</h4>
            <ul className="legal-nav__toc">
              {doc.sections.map((s) => (
                <li key={s.heading}><a href={`#${slugify(s.heading)}`}>{s.heading}</a></li>
              ))}
            </ul>
          </aside>

          <article className="prose">
            <p className="prose__updated">Last updated: {doc.updated}</p>
            {doc.sections.map((s) => (
              <section key={s.heading} id={slugify(s.heading)}>
                <h2>{s.heading}</h2>
                {s.body.map((para, i) => <p key={i}>{para}</p>)}
                {s.list && (
                  <ul>
                    {s.list.map((li) => <li key={li}>{li}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
