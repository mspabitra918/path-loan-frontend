// Shape of the apply wizard's data. Select values are the codes from
// components/apply/options.ts, which are what the backend stores, so the
// payload goes to POST /api/apply/submit as-is.

export type ApplicationFormData = {
  loan: {
    amount: number;
    purpose: string;
    loanTerm: number;
    otherPurpose: string;
  };

  personal: {
    firstName: string;
    lastName: string;
    email: string;
    /** Digits only. */
    phone: string;

    /** "01"–"12" */
    dobMonth: string;
    dobDay: string;
    dobYear: string;

    /** Digits only. */
    ssn: string;

    dlNumber: string;
    dlState: string;

    streetAddress: string;
    addressLine2: string;
    city: string;
    state: string;
    zip: string;

    yearsAtAddress: number;
    housingStatus: string;
    monthlyHousingCost: number;
  };

  employment: {
    employmentStatus: string;
    employerName: string;
    jobTitle: string;
    employmentLengthMo: number;
    /** Digits only. */
    employerPhone: string;

    payFrequency: string;
    /** YYYY-MM-DD */
    nextPayDate: string;

    /** Plain number string, e.g. "3500". */
    netMonthlyIncome: string;
    incomeSource: string;
  };

  banking: {
    bankName: string;
    accountType: string;
    routingNumber: string;
    accountNumber: string;
    confirmAccountNumber: string;
    accountAge: string;
    currentBalanceBand: string;
    directDeposit: boolean | null;
  };

  consent: {
    esign: boolean;
    privacy: boolean;
    creditPull: boolean;
    tcpa: boolean;
  };
};

export type Section = keyof ApplicationFormData;
export type FieldOf<S extends Section> = keyof ApplicationFormData[S] & string;

// Must match the backend's loan_applications CHECK constraints.
export const MIN_AMOUNT = 1000;
export const MAX_AMOUNT = 35000;
export const AMOUNT_STEP = 500;

export function emptyApplication(amount = 10000, loanTerm = 36): ApplicationFormData {
  return {
    loan: { amount, purpose: "", loanTerm, otherPurpose: "" },
    personal: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dobMonth: "",
      dobDay: "",
      dobYear: "",
      ssn: "",
      dlNumber: "",
      dlState: "",
      streetAddress: "",
      addressLine2: "",
      city: "",
      state: "",
      zip: "",
      yearsAtAddress: NaN,
      housingStatus: "",
      monthlyHousingCost: NaN,
    },
    employment: {
      employmentStatus: "",
      employerName: "",
      jobTitle: "",
      employmentLengthMo: NaN,
      employerPhone: "",
      payFrequency: "",
      nextPayDate: "",
      netMonthlyIncome: "",
      incomeSource: "",
    },
    banking: {
      bankName: "",
      accountType: "",
      routingNumber: "",
      accountNumber: "",
      confirmAccountNumber: "",
      accountAge: "",
      currentBalanceBand: "",
      directDeposit: null,
    },
    consent: { esign: false, privacy: false, creditPull: false, tcpa: false },
  };
}
