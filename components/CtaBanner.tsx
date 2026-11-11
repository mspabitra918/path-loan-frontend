import Link from "next/link";

export default function CtaBanner({
  title = "Ready to take the next step?",
  text = "Checking your options takes about 5 minutes and won't affect your FICO® score.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="section">
      <div className="container">
        <div className="cta-banner">
          <div>
            <h2>{title}</h2>
            <p>{text}</p>
          </div>
          <div className="cta-banner__actions">
            <Link href="/apply" className="btn btn--amber btn--lg">
              Start Application
            </Link>
            <Link href="/contact" className="btn btn--ghost-light btn--lg">
              Talk to Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
