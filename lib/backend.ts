// Server-only: used by the /api route handlers to talk to the Express backend.
// The browser never calls the backend for apply/status directly, so the
// applicant's SSN/bank details and email stay off URLs and CORS isn't involved.
import type { ApplicationFormData } from "@/components/apply/types";
import { digits } from "./application";

export const BACKEND_URL = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5001"
).replace(/\/+$/, "");

/**
 * Headers to forward so the backend's per-IP rate limits, audit trail and
 * analytics see the real applicant instead of the Next.js server.
 */
export function forwardHeaders(req: Request): Record<string, string> {
  const h: Record<string, string> = { "Content-Type": "application/json" };
  const xff = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  if (xff || realIp) h["X-Forwarded-For"] = (xff ?? realIp)!;
  const ua = req.headers.get("user-agent");
  if (ua) h["User-Agent"] = ua;
  const referer = req.headers.get("referer");
  if (referer) h["Referer"] = referer;
  return h;
}

/* ---------- Form → backend payload ---------- */
// Select values are already the backend's codes (components/apply/options.ts),
// so this only normalises free-text fields before they're stored.

export function toBackendForm(d: ApplicationFormData): ApplicationFormData {
  return {
    ...d,
    loan: {
      ...d.loan,
      otherPurpose: d.loan.purpose === "other" ? d.loan.otherPurpose.trim() : "",
    },
    personal: {
      ...d.personal,
      email: d.personal.email.trim(),
      phone: digits(d.personal.phone),
      ssn: digits(d.personal.ssn),
    },
    employment: {
      ...d.employment,
      employerPhone: digits(d.employment.employerPhone),
      netMonthlyIncome: d.employment.netMonthlyIncome.replace(/[$,\s]/g, ""),
    },
    banking: {
      ...d.banking,
      routingNumber: digits(d.banking.routingNumber),
    },
  };
}


/** Backend validation errors name flat keys; the form keys errors by "section.field". */
const FLAT_TO_FORM: Record<string, string> = {
  loanAmount: "loan.amount",
  loanTerm: "loan.loanTerm",
  loanPurpose: "loan.purpose",
  firstName: "personal.firstName",
  lastName: "personal.lastName",
  email: "personal.email",
  phone: "personal.phone",
  dob: "personal.dob",
  ssn: "personal.ssn",
  streetAddress: "personal.streetAddress",
  city: "personal.city",
  state: "personal.state",
  zipCode: "personal.zip",
  yearsAtAddress: "personal.yearsAtAddress",
  monthlyHousingCost: "personal.monthlyHousingCost",
  employmentLengthMo: "employment.employmentLengthMo",
  netMonthlyIncome: "employment.netMonthlyIncome",
  nextPayDate: "employment.nextPayDate",
};

export function toFormErrorKey(field: unknown): string | null {
  if (typeof field !== "string" || !field) return null;
  if (field.includes(".")) return field;
  return FLAT_TO_FORM[field] ?? null;
}

export async function backendFetch(path: string, init: RequestInit) {
  const res = await fetch(`${BACKEND_URL}${path}`, { ...init, cache: "no-store" });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { res, json };
}
