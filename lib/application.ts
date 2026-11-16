// Shared, non-form helpers. The apply form's data shape, options and validation
// live in components/apply/{types,options,validation}.ts.
import { loanPurposes, loanTermOptions } from "@/components/apply/options";
import { AMOUNT_STEP, MAX_AMOUNT, MIN_AMOUNT } from "@/components/apply/types";

export { AMOUNT_STEP, MAX_AMOUNT, MIN_AMOUNT };
export type { ApplicationFormData } from "@/components/apply/types";

export const LOAN_TERMS = loanTermOptions.map((o) => o.value);

export const clampAmount = (n: number) =>
  Math.min(MAX_AMOUNT, Math.max(MIN_AMOUNT, Math.round(n / AMOUNT_STEP) * AMOUNT_STEP));

export const digits = (v: unknown) => String(v ?? "").replace(/\D/g, "");

/* ---------- Application status ---------- */

/** Timeline shown on the status page, in the order the backend moves an application. */
export const STATUS_STAGES = [
  {
    key: "received",
    label: "Application received",
    text: "We've got your application and supporting details.",
  },
  {
    key: "verification",
    label: "Bank verification",
    text: "Connect your bank so we can confirm your account and income.",
  },
  {
    key: "review",
    label: "Under review",
    text: "Our team is reviewing your income and credit information.",
  },
  { key: "decision", label: "Decision", text: "Your decision is ready." },
  {
    key: "funded",
    label: "Funded",
    text: "Funds have been sent to your bank account.",
  },
] as const;

export type StatusKey = (typeof STATUS_STAGES)[number]["key"];

export type ApplicationOutcome = "approved" | "declined" | "call" | null;

export type ApplicationStatus = {
  /** 5-digit application code issued by the backend. */
  id: string;
  firstName: string;
  amount: number;
  loanTerm: number;
  purpose: string;
  submittedAt: string;
  status: StatusKey;
  outcome: ApplicationOutcome;
  /** Raw status string from the backend (e.g. "bank_verification_pending"). */
  backendStatus: string;
  /** True when the applicant still has to connect their bank. */
  needsBankVerification: boolean;
};

/** Maps a backend loan_applications.status to the timeline stage + outcome. */
export function mapBackendStatus(s: string): {
  status: StatusKey;
  outcome: ApplicationOutcome;
  needsBankVerification: boolean;
} {
  switch (s) {
    case "bank_verification_pending":
    case "bank_reverification":
      return { status: "verification", outcome: null, needsBankVerification: true };
    case "bank_verification_completed":
      return { status: "review", outcome: null, needsBankVerification: false };
    case "request_a_call":
      return { status: "review", outcome: "call", needsBankVerification: false };
    case "declined":
    case "declined_pb":
    case "declined_hd":
      return { status: "decision", outcome: "declined", needsBankVerification: false };
    case "funded":
      return { status: "funded", outcome: "approved", needsBankVerification: false };
    default:
      return { status: "received", outcome: null, needsBankVerification: false };
  }
}

export type CurrentStatusTone = "action" | "progress" | "success" | "declined";

export type CurrentStatusDisplay = {
  label: string;
  text: string;
  tone: CurrentStatusTone;
  /** Bank button to show, or null when no bank action is needed. */
  bankAction: { label: string; path: string } | null;
};

/** The single status shown on the status page for a backend status. */
export function currentStatusDisplay(backendStatus: string): CurrentStatusDisplay {
  switch (backendStatus) {
    case "bank_verification_pending":
      return {
        label: "Bank Verification Pending",
        text: "Connect your bank so we can confirm your account and income.",
        tone: "action",
        bankAction: { label: "Verify My Bank", path: "/verify-bank" },
      };
    case "bank_reverification":
      return {
        label: "Bank Reconnection Required",
        text: "We need you to reconnect your bank so we can finish verifying your account.",
        tone: "action",
        bankAction: { label: "Reconnect My Bank", path: "/reconnect-bank-verification" },
      };
    case "bank_verification_completed":
      return {
        label: "Bank Verification Completed",
        text: "Your bank account has been verified. Our team is reviewing your application.",
        tone: "progress",
        bankAction: null,
      };
    case "request_a_call":
      return {
        label: "Call Requested",
        text: "Please give us a call so we can finish reviewing your application.",
        tone: "action",
        bankAction: null,
      };
    case "funded":
      return {
        label: "Funded",
        text: "Your funds have been sent to your bank account.",
        tone: "success",
        bankAction: null,
      };
    case "declined_pb":
      return {
        label: "Application Declined",
        text: "We weren't able to approve your application. We've emailed you a notice explaining the main reasons and your rights under the Equal Credit Opportunity Act.",
        tone: "declined",
        bankAction: null,
      };
    case "declined_hd":
      return {
        label: "Declined After Review",
        text: "After reviewing your application, we weren't able to approve it. We've emailed you a notice explaining the main reasons and your rights under the Equal Credit Opportunity Act.",
        tone: "declined",
        bankAction: null,
      };
    default:
      return {
        label: "Application Received",
        text: "We've got your application and supporting details.",
        tone: "progress",
        bankAction: null,
      };
  }
}

/** Row returned by the backend's GET /api/application-status. */
export type BackendApplication = {
  id: string;
  first_name: string;
  loan_amount: number | string;
  loan_purpose: string;
  loan_term: number | string;
  status: string;
  created_at: string;
};

/** Backend purpose code → display label ("auto_repair" → "Auto repair or car expenses"). */
export function purposeLabel(stored: string): string {
  const known = loanPurposes.find((o) => o.value === stored)?.label;
  if (known) return known;
  const words = stored.replace(/_/g, " ").trim();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function fromBackendApplication(a: BackendApplication): ApplicationStatus {
  return {
    id: a.id,
    firstName: a.first_name,
    amount: Number(a.loan_amount),
    loanTerm: Number(a.loan_term),
    purpose: purposeLabel(a.loan_purpose),
    submittedAt: a.created_at,
    backendStatus: a.status,
    ...mapBackendStatus(a.status),
  };
}
