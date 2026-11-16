import type { Metadata } from "next";
import { Suspense } from "react";
import BankVerificationForm from "@/components/bank-verification/BankVerificationForm";

export const metadata: Metadata = {
  title: "Verify Your Bank Account",
  description:
    "Securely connect your online banking to verify your Path Loans application.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/verify-bank" },
};

// Header and Footer come from the root layout.
export default function VerifyBankPage() {
  return (
    <Suspense fallback={<div className="bank-verify__fallback" />}>
      <BankVerificationForm mode="verify" />
    </Suspense>
  );
}
