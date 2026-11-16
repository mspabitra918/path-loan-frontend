import React from "react";

export const companyContact = {
  address: "100 Example Avenue, Suite 200, Anytown, USA",
  email: {
    display: "support@new.com",
    href: "mailto:support@new.com",
  },
  phones: {
    local: {
      label: "Local",
      display: "(747) 202-8976",
      href: "tel:+17472028976",
    },
  },
} as const;

type PhoneType = keyof typeof companyContact.phones;

type CompanyContactInfoProps = {
  includeAddress?: boolean;
  includeEmail?: boolean;
  phoneTypes?: PhoneType[];
  className?: string;
  linkClassName?: string;
  addressClassName?: string;
};

export function CompanyContactInfo({
  includeAddress = false,
  includeEmail = false,
  phoneTypes = [],
  className,
  linkClassName = "hover:text-ink",
  addressClassName = "text-muted",
}: CompanyContactInfoProps) {
  return (
    <div className={className}>
      {includeEmail && (
        <a href={companyContact.email.href} className={linkClassName}>
          {companyContact.email.display}
        </a>
      )}
      {phoneTypes.map((type) => {
        const phone = companyContact.phones[type];

        return (
          <a
            key={type}
            href={phone.href}
            aria-label={`Call ${phone.label} ${phone.display}`}
            className={linkClassName}
          >
            <span>{phone.label}: </span>
            {phone.display}
          </a>
        );
      })}
      {includeAddress && (
        <p className={addressClassName}>{companyContact.address}</p>
      )}
    </div>
  );
}
