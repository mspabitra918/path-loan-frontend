import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="We're here to help"
        text="Questions about an application, a payment or your account? Reach out and a real person will get back to you."
      />
      <section className="section">
        <div className="container contact-grid">
          <div className="contact-info">
            <div className="card">
              <span className="feature__icon">📞</span>
              <h3>Call us</h3>
              <p><a href={`tel:${site.phone}`}>{site.phone}</a></p>
              <p className="muted">{site.hours}</p>
            </div>
            <div className="card">
              <span className="feature__icon">✉️</span>
              <h3>Email</h3>
              <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
              <p className="muted">Replies within one business day</p>
            </div>
            <div className="card">
              <span className="feature__icon">📍</span>
              <h3>Mailing address</h3>
              <p className="muted">{site.address}</p>
            </div>
          </div>
          <div>
            <h2>Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
