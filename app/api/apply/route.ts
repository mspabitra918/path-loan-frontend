import { NextResponse } from "next/server";
import type { ApplicationFormData } from "@/components/apply/types";
import { validateApplication } from "@/components/apply/validation";
import { mapBackendStatus, purposeLabel, type ApplicationStatus } from "@/lib/application";
import {
  backendFetch,
  forwardHeaders,
  toBackendForm,
  toFormErrorKey,
} from "@/lib/backend";

const SECTIONS = ["loan", "personal", "employment", "banking", "consent"] as const;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const isObj = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);
  if (!isObj(body) || !SECTIONS.every((s) => isObj(body[s]))) {
    return NextResponse.json({ error: "Invalid application payload." }, { status: 400 });
  }

  const data = body as ApplicationFormData;
  const errors = validateApplication(data);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", errors },
      { status: 422 },
    );
  }

  let res: Response;
  let json: Record<string, unknown>;
  try {
    ({ res, json } = await backendFetch("/api/apply/submit", {
      method: "POST",
      headers: forwardHeaders(req),
      body: JSON.stringify({ data: toBackendForm(data) }),
    }));
  } catch (err) {
    console.error("Backend unreachable (apply):", err);
    return NextResponse.json(
      { error: "We couldn't reach our servers. Please try again in a moment." },
      { status: 502 },
    );
  }

  if (!res.ok) {
    const message =
      typeof json.error === "string" ? json.error : "Something went wrong. Please try again.";
    // The backend names the offending field as "section.field" — surface it inline.
    const field = toFormErrorKey(json.field);
    return NextResponse.json(
      {
        error: message,
        ...(field ? { errors: { [field]: message } } : {}),
        ...(typeof json.applicationId === "string" ? { applicationId: json.applicationId } : {}),
      },
      { status: res.status },
    );
  }

  const backendStatus = String(json.status ?? "");
  const application: ApplicationStatus = {
    id: String(json.applicationId ?? ""),
    firstName: data.personal.firstName.trim(),
    amount: data.loan.amount,
    loanTerm: data.loan.loanTerm,
    purpose: data.loan.purpose === "other" ? data.loan.otherPurpose.trim() : purposeLabel(data.loan.purpose),
    submittedAt: new Date().toISOString(),
    backendStatus,
    ...mapBackendStatus(backendStatus),
  };
  return NextResponse.json({ application }, { status: 201 });
}
