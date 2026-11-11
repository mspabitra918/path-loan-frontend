"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/lib/site";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="header">
      <div className="container header__inner">
        <Link href="/" className="brand" aria-label={`${site.name} home`}>
          <Logo />
          <span>{site.name}</span>
        </Link>

        <nav className={`nav ${open ? "nav--open" : ""}`} aria-label="Main">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav__link ${pathname === l.href ? "is-active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/apply" className="btn btn--primary nav__cta">
            Apply Now
          </Link>
        </nav>

        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
