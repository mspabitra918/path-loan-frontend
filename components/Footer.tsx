import Link from "next/link";
import { navLinks, site } from "@/lib/site";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <Link href="/" className="brand brand--light">
            <Logo />
            <span>{site.name}</span>
          </Link>
          <p className="footer__muted">{site.tagline}</p>
          <p className="footer__muted">
            {site.phone}
            <br />
            {site.email}
            <br />
            {site.hours}
          </p>
        </div>
        <div>
          <h4>Company</h4>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/apply">Apply Now</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
            <li><a href="#">E-Sign Consent</a></li>
            <li><a href="#">Responsible Lending</a></li>
          </ul>
        </div>
      </div>
      <div className="container footer__legal">
        <p>
          <strong>Important disclosure:</strong> Installment loans are an expensive form of credit
          intended for short-term financial needs, not a long-term solution. Customers with credit
          difficulties should seek credit counseling. Loan approval, amount, APR and terms depend on
          credit qualification, state of residence and verification of information. Not all
          applicants will qualify. Examples on this site are illustrative only.
        </p>
        <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
