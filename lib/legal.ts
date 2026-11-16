import { site } from "./site";

/**
 * TEMPLATE LEGAL CONTENT — starting drafts only. Have qualified counsel review and adapt
 * every document (licensing, state-specific terms, lender/partner names) before launch.
 */

export type LegalSection = { heading: string; body: string[]; list?: string[] };
export type LegalDoc = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
};

const UPDATED = "November 12, 2026";
const contact = `${site.name}, ${site.address} · ${site.phone} · ${site.email}`;

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    summary: "What personal information we collect, how we use and share it, and the choices you have.",
    updated: UPDATED,
    sections: [
      {
        heading: "Our commitment",
        body: [
          `${site.name} ("we," "us," "our") respects your privacy. This Privacy Policy explains how we collect, use, share and protect personal information when you visit our website, apply for a loan or service an account with us. Financial companies choose how they share your personal information; federal law (including the Gramm-Leach-Bliley Act) gives consumers the right to limit some but not all sharing.`,
        ],
      },
      {
        heading: "Information we collect",
        body: ["Depending on how you interact with us, we may collect:"],
        list: [
          "Identifiers: name, email address, phone number, mailing address, date of birth, Social Security number and driver's license or state ID number.",
          "Financial information: income, employment details, pay schedule, housing costs, and bank account and routing numbers.",
          "Credit information: consumer reports and scores obtained from consumer reporting agencies with your authorization.",
          "Device and usage data: IP address, browser type, pages viewed, referring URLs and similar data collected through cookies and comparable technologies.",
          "Communications: records of calls, emails, chats and texts with our team.",
        ],
      },
      {
        heading: "How we use your information",
        body: ["We use personal information to:"],
        list: [
          "Process and evaluate your application, verify your identity and prevent fraud.",
          "Make credit decisions, fund your loan and service your account, including processing payments.",
          "Communicate with you about your application, account and, where permitted, offers.",
          "Comply with legal and regulatory obligations, including anti-money-laundering requirements.",
          "Operate, secure and improve our website and services.",
        ],
      },
      {
        heading: "How we share information",
        body: [
          "We do not sell your personal information. We share it only as needed to provide our services and as permitted by law, including with: service providers that help us operate (for example, payment processors, identity-verification and hosting providers) under contracts that restrict their use of the data; consumer reporting agencies; lending partners involved in originating or servicing your loan; and government agencies or other parties when required by law, subpoena or to protect rights and safety.",
          "We do not share information with non-affiliated companies for their own marketing without your consent.",
        ],
      },
      {
        heading: "Cookies and online tracking",
        body: [
          "We use cookies and similar technologies to keep you signed in, remember preferences, measure site performance and protect against fraud. You can manage cookies through your browser settings; disabling some cookies may affect site functionality.",
        ],
      },
      {
        heading: "How we protect your information",
        body: [
          "We maintain administrative, technical and physical safeguards designed to protect personal information, including encryption in transit (TLS) and at rest for sensitive data, access controls limited to personnel with a business need, and regular security reviews. No method of transmission or storage is completely secure, but we work to protect your information and will notify you of a breach as required by law.",
        ],
      },
      {
        heading: "Retention",
        body: [
          "We keep personal information for as long as needed to provide services and to meet legal, regulatory, tax and accounting requirements, then securely delete or de-identify it.",
        ],
      },
      {
        heading: "Your choices and state privacy rights",
        body: [
          "You may update your contact information, opt out of marketing emails using the unsubscribe link, and opt out of marketing texts by replying STOP. Depending on your state of residence (for example, California, Colorado, Connecticut, Virginia and others), you may have rights to request access to, correction of, or deletion of certain personal information, subject to exceptions for information covered by federal financial privacy laws. To make a request, contact us using the details below. We will verify your identity before responding and will not discriminate against you for exercising your rights.",
        ],
      },
      {
        heading: "Children",
        body: ["Our services are intended for adults 18 and older. We do not knowingly collect information from children under 13."],
      },
      {
        heading: "Changes and contact",
        body: [
          "We may update this policy from time to time. The \"Last updated\" date shows when it was last revised; material changes will be communicated as required by law.",
          `Questions? Contact ${contact}.`,
        ],
      },
    ],
  },
  {
    slug: "terms-of-use",
    title: "Terms of Use",
    summary: "The rules for using our website and online services.",
    updated: UPDATED,
    sections: [
      {
        heading: "Acceptance of these terms",
        body: [
          `By accessing or using the ${site.name} website and online services (the "Services"), you agree to these Terms of Use and our Privacy Policy. If you do not agree, do not use the Services. Any loan you obtain is governed by your separate loan agreement, which controls if it conflicts with these Terms.`,
        ],
      },
      {
        heading: "Eligibility",
        body: [
          "You must be at least 18 years old (or the age of majority in your state), a U.S. resident of a state where we offer loans, and able to form a binding contract. Submitting an application does not guarantee approval.",
        ],
      },
      {
        heading: "Accurate information",
        body: [
          "You agree that information you provide is true, accurate and complete, and that you will apply only on your own behalf. Providing false information may result in denial or cancellation of a loan and may violate law.",
        ],
      },
      {
        heading: "Account security",
        body: [
          "You are responsible for keeping your login credentials confidential and for activity under your account. Notify us immediately of any unauthorized use.",
        ],
      },
      {
        heading: "Prohibited uses",
        body: ["You agree not to:"],
        list: [
          "Use the Services for any unlawful or fraudulent purpose.",
          "Attempt to gain unauthorized access to our systems or other users' accounts.",
          "Scrape, copy, or reverse-engineer the Services, or interfere with their operation.",
          "Upload malicious code or content that infringes others' rights.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          `All content on the Services, including text, graphics, logos and software, is owned by or licensed to ${site.name} and protected by law. You may view and print pages for personal, non-commercial use only.`,
        ],
      },
      {
        heading: "Rates, examples and calculators",
        body: [
          "Rates, payment examples and calculator results on the website are illustrative and are not an offer of credit. Your actual terms are provided in your loan agreement and depend on your application, credit profile and state of residence.",
        ],
      },
      {
        heading: "Disclaimers and limitation of liability",
        body: [
          "The Services are provided \"as is\" and \"as available\" without warranties of any kind, to the fullest extent permitted by law. To the extent permitted by law, we are not liable for indirect, incidental, special or consequential damages arising from your use of the Services.",
        ],
      },
      {
        heading: "Changes, governing law and contact",
        body: [
          "We may modify these Terms by posting an updated version; continued use after changes means you accept them. These Terms are governed by applicable federal law and the law of the state identified in your loan agreement.",
          `Questions? Contact ${contact}.`,
        ],
      },
    ],
  },
  {
    slug: "e-sign-consent",
    title: "E-Sign Consent",
    summary: "Your consent to receive disclosures and sign documents electronically.",
    updated: UPDATED,
    sections: [
      {
        heading: "Consent to electronic records and signatures",
        body: [
          `Under the federal Electronic Signatures in Global and National Commerce Act (E-SIGN Act), ${site.name} needs your consent before providing certain disclosures, notices and agreements electronically. By checking the E-Sign box during your application, you agree that we may provide all communications related to your application and loan electronically, and that your electronic signature has the same legal effect as a handwritten one.`,
        ],
      },
      {
        heading: "Communications covered",
        body: ["This consent applies to, among other things:"],
        list: [
          "Your application, loan agreement, Truth in Lending disclosures and payment schedule.",
          "Privacy notices, adverse action notices and other legally required disclosures.",
          "Account statements, payment confirmations and notices about changes to your account.",
        ],
      },
      {
        heading: "Hardware and software requirements",
        body: ["To access and retain electronic records you will need:"],
        list: [
          "A device with internet access and a current version of Chrome, Safari, Firefox or Edge.",
          "A valid email address that you check regularly.",
          "Software that can open PDF files, and the ability to print or save documents.",
        ],
      },
      {
        heading: "Paper copies",
        body: [
          `You may request a paper copy of any electronic record at no charge by contacting us at ${site.phone} or ${site.email}. Requesting a paper copy does not withdraw your consent.`,
        ],
      },
      {
        heading: "Withdrawing consent",
        body: [
          "You may withdraw consent at any time by contacting us. Withdrawal does not affect the validity of documents already provided or signed electronically. Because our application is online-only, withdrawing consent before your loan is funded may mean we cannot complete your application.",
        ],
      },
      {
        heading: "Updating your contact information",
        body: ["Please let us know promptly if your email address changes so you continue to receive important communications."],
      },
    ],
  },
  {
    slug: "credit-authorization",
    title: "Credit Authorization",
    summary: "How and why we obtain your credit report and verify your information.",
    updated: UPDATED,
    sections: [
      {
        heading: "Your authorization",
        body: [
          `By checking the credit authorization box, you give ${site.name}, its lending partners and their service providers written instructions under the Fair Credit Reporting Act to obtain your consumer report and other information from one or more consumer reporting agencies, and to verify the information you provided, in connection with your application and, if approved, for the purposes of reviewing, servicing and collecting your account.`,
        ],
      },
      {
        heading: "Soft and hard inquiries",
        body: [
          "Checking your options uses a soft inquiry, which does not affect your credit score. If you accept an offer and proceed, we or our lending partner may obtain a full consumer report (a hard inquiry), which may affect your credit score.",
        ],
      },
      {
        heading: "Verification",
        body: [
          "You authorize us to verify your identity, employment, income and bank account, which may include contacting your employer, using third-party verification services and reviewing bank account information you provide.",
        ],
      },
      {
        heading: "Reporting",
        body: [
          "If you obtain a loan, information about your account—including late payments, missed payments or other defaults—may be reported to one or more consumer reporting agencies.",
        ],
      },
      {
        heading: "If you are not approved",
        body: [
          "If we take adverse action based on information in a consumer report, you will receive a notice identifying the reporting agency used and explaining your right to obtain a free copy of your report within 60 days and to dispute inaccurate information.",
        ],
      },
    ],
  },
  {
    slug: "tcpa-consent",
    title: "Communications Consent",
    summary: "Your optional consent to calls and text messages, and how to opt out.",
    updated: UPDATED,
    sections: [
      {
        heading: "Calls and text messages",
        body: [
          `If you choose to provide consent, you agree that ${site.name} and its service providers may contact you at the phone number(s) you provide, including mobile numbers, using calls and text messages—which may be made with an automatic telephone dialing system or artificial or prerecorded voice—about your application, account, payments and, if you separately agree, offers.`,
        ],
      },
      {
        heading: "Not a condition of credit",
        body: [
          "This consent is optional. You are not required to agree to it as a condition of applying for or obtaining any loan. You can still receive non-marketing calls and messages as permitted by law.",
        ],
      },
      {
        heading: "Opting out",
        body: [
          `Reply STOP to any text message to stop receiving texts, or HELP for help. You may also revoke consent to calls by any reasonable means, including telling our representative or contacting us at ${site.phone}. Message and data rates may apply. Message frequency varies.`,
        ],
      },
      {
        heading: "Your number",
        body: [
          "Please tell us promptly if you change or give up a phone number you provided, so we don't contact someone else by mistake.",
        ],
      },
    ],
  },
  {
    slug: "responsible-lending",
    title: "Responsible Lending",
    summary: "How we lend responsibly and support customers who face hardship.",
    updated: UPDATED,
    sections: [
      {
        heading: "Our approach",
        body: [
          `${site.name} offers installment loans with fixed payments and a clear end date. We believe borrowing should be transparent and affordable, and we design our process around your ability to repay.`,
        ],
      },
      {
        heading: "What we commit to",
        body: [],
        list: [
          "Clear disclosures: your APR, finance charge, total of payments and payment schedule before you sign.",
          "Affordability checks: we review income, housing costs and other obligations to help ensure payments fit your budget.",
          "No prepayment penalties: pay off your loan early at any time and save on interest.",
          "No rollovers: we don't roll loans over into new loans with additional fees.",
          "Fair treatment: we comply with the Equal Credit Opportunity Act and do not discriminate on any prohibited basis.",
          "Fair collections: we follow the law and treat customers with respect.",
        ],
      },
      {
        heading: "Is an installment loan right for you?",
        body: [
          "Installment loans can be an expensive form of credit and are best suited to short-term needs rather than as a long-term financial solution. Before borrowing, consider alternatives such as a payment plan with the provider, help from family, a credit union loan or a credit card. Only borrow what you need and can comfortably repay.",
        ],
      },
      {
        heading: "If you're having trouble paying",
        body: [
          `Contact us as early as possible at ${site.phone}. Depending on your situation and state law, options may include a payment-date change or a hardship plan. You can also get free or low-cost help from a nonprofit credit counselor—for example, through the National Foundation for Credit Counseling (nfcc.org).`,
        ],
      },
      {
        heading: "Complaints",
        body: [
          `We want to hear from you. Contact ${contact}. You may also submit a complaint to the Consumer Financial Protection Bureau at consumerfinance.gov or to your state's financial regulator.`,
        ],
      },
    ],
  },
];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
