import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import LoanStatusLookup from "@/components/LoanStatusLookup";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Loan Status",
  description: `Check the status of your ${site.name} loan application.`,
};

export default async function LoanStatusPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;

  return (
    <>
      <PageHero
        eyebrow="Loan Status"
        title="Check your application"
        text="Enter the application ID from your confirmation email along with the email address you applied with."
      />
      <section className="section section--tint">
        <div className="container narrow">
          <LoanStatusLookup initialId={typeof id === "string" ? id.slice(0, 20) : ""} />
          <p className="tiny center">
            Can&apos;t find your application ID? Call {site.phone} ({site.hours}).
          </p>
        </div>
      </section>
    </>
  );
}
