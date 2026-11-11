export const site = {
  name: "PathLoan",
  tagline: "Straightforward installment loans, online.",
  phone: "1-800-555-0142",
  email: "support@pathloan.example",
  hours: "Mon–Fri 8am–8pm ET · Sat 9am–5pm ET",
  address: "100 Example Avenue, Suite 200, Anytown, USA",
  minLoan: 300,
  maxLoan: 3000,
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/rates-and-fees", label: "Rates & Fees" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

/** Illustrative APR used by the calculator. Replace with real lender pricing. */
export const ILLUSTRATIVE_APR = 0.99;

export function monthlyPayment(principal: number, apr: number, months: number): number {
  const r = apr / 12;
  if (r === 0) return principal / months;
  return (principal * r) / (1 - Math.pow(1 + r, -months));
}

export const usd = (n: number, digits = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
