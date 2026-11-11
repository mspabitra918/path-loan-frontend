"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card form-success">
        <h3>Thanks — message received.</h3>
        <p>A member of our support team will reply within one business day.</p>
      </div>
    );
  }

  return (
    <form
      className="card form"
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: connect to your API route / email service
        setSent(true);
      }}
    >
      <div className="form__row">
        <label>
          First name
          <input name="firstName" required />
        </label>
        <label>
          Last name
          <input name="lastName" required />
        </label>
      </div>
      <label>
        Email
        <input type="email" name="email" required />
      </label>
      <label>
        Phone (optional)
        <input type="tel" name="phone" />
      </label>
      <label>
        Topic
        <select name="topic" defaultValue="general">
          <option value="general">General question</option>
          <option value="application">My application</option>
          <option value="payment">Payments</option>
          <option value="account">My account</option>
        </select>
      </label>
      <label>
        Message
        <textarea name="message" rows={5} required />
      </label>
      <p className="form__hint">Please don't include your SSN or bank account numbers.</p>
      <button type="submit" className="btn btn--primary btn--lg">
        Send Message
      </button>
    </form>
  );
}
