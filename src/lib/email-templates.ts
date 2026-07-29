const BRAND = {
  name: "Take & Bring",
  primary: "#abc629",
  dark: "#343432",
  muted: "#6b6b68",
  bg: "#f7f8f4",
  white: "#ffffff",
  phone: "+49 2234 6889977",
  email: "info@take-bring.eu",
  site: "https://take-bring.eu",
};

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formKeyLabel(formKey: string): string {
  const map: Record<string, string> = {
    "contact-page-form": "Contact page",
    "landing-contact-map-form": "Homepage contact form",
    "about-lead-form": "About page",
    "industries-lead-form": "Industries page",
    "price-calculator-form": "Homepage price calculator",
    contact_page_form: "Contact page",
    landing_contact_form: "Homepage contact form",
    about_lead_form: "About page",
    industries_lead_form: "Industries page",
    service_lead_form: "Service page",
    landing_newsletter_form: "Newsletter",
  };

  if (map[formKey]) return map[formKey];
  if (formKey.startsWith("service-lead-")) {
    return `Service page (${formKey.replace("service-lead-", "").replaceAll("-", " ")})`;
  }
  return formKey.replaceAll("-", " ").replaceAll("_", " ");
}

function shell(args: {
  title: string;
  preheader: string;
  bodyHtml: string;
}): string {
  const { title, preheader, bodyHtml } = args;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:Arial,Helvetica,sans-serif;color:${BRAND.dark};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:${BRAND.white};border-radius:16px;overflow:hidden;border:1px solid #e6e8df;">
          <tr>
            <td style="background:${BRAND.dark};padding:22px 28px;">
              <p style="margin:0;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${BRAND.primary};font-weight:700;">Express Logistic</p>
              <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:${BRAND.white};">${escapeHtml(BRAND.name)}</h1>
            </td>
          </tr>
          <tr>
            <td style="height:4px;background:${BRAND.primary};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:28px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background:${BRAND.bg};padding:18px 28px;border-top:1px solid #e6e8df;">
              <p style="margin:0 0 6px;font-size:13px;color:${BRAND.muted};">
                ${escapeHtml(BRAND.name)} · ${escapeHtml(BRAND.phone)}
              </p>
              <p style="margin:0;font-size:13px;color:${BRAND.muted};">
                <a href="mailto:${BRAND.email}" style="color:${BRAND.dark};text-decoration:none;">${BRAND.email}</a>
                ·
                <a href="${BRAND.site}" style="color:${BRAND.dark};text-decoration:none;">${BRAND.site}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid #eee;width:34%;vertical-align:top;font-size:13px;color:${BRAND.muted};font-weight:700;">${escapeHtml(label)}</td>
    <td style="padding:10px 0;border-bottom:1px solid #eee;font-size:14px;color:${BRAND.dark};">${value}</td>
  </tr>`;
}

export type LeadEmailFields = {
  formKey: string;
  fullName: string;
  email: string;
  phone: string;
  inquiryType?: string;
  message: string;
};

export function buildClientReceiptEmail(fields: LeadEmailFields): {
  subject: string;
  text: string;
  html: string;
} {
  const page = formKeyLabel(fields.formKey);
  const requestLabel = fields.inquiryType?.trim() || page;
  const subject = `We received your request – ${requestLabel}`;

  const text = [
    `Congratulations ${fields.fullName}!`,
    "",
    `Your request for "${requestLabel}" has been submitted successfully.`,
    "Our team will review it and reach you soon.",
    "",
    "Summary:",
    `Page / form: ${page}`,
    `Email: ${fields.email}`,
    `Phone: ${fields.phone}`,
    `Message: ${fields.message}`,
    "",
    `Take & Bring · ${BRAND.phone} · ${BRAND.email}`,
  ].join("\n");

  const html = shell({
    title: subject,
    preheader: `Your request for ${requestLabel} was submitted successfully.`,
    bodyHtml: `
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.primary};font-weight:700;">Request received</p>
      <h2 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:${BRAND.dark};">Congratulations, ${escapeHtml(fields.fullName)}!</h2>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
        Your request for <strong style="color:${BRAND.dark};">${escapeHtml(requestLabel)}</strong> has been submitted successfully.
        Our team will review the details and reach you soon.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 18px;">
        ${detailRow("Form / page", escapeHtml(page))}
        ${detailRow("Inquiry", escapeHtml(requestLabel))}
        ${detailRow("Email", escapeHtml(fields.email))}
        ${detailRow("Phone / WhatsApp", escapeHtml(fields.phone))}
        ${detailRow("Message", `<span style="white-space:pre-wrap;">${escapeHtml(fields.message)}</span>`)}
      </table>
      <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.muted};">
        If you need anything urgent, call us at <strong style="color:${BRAND.dark};">${BRAND.phone}</strong>
        or reply to this email.
      </p>
    `,
  });

  return { subject, text, html };
}

export function buildCompanyLeadEmail(fields: LeadEmailFields): {
  subject: string;
  text: string;
  html: string;
} {
  const page = formKeyLabel(fields.formKey);
  const requestLabel = fields.inquiryType?.trim() || page;
  const subject = `New website request – ${requestLabel} – ${fields.fullName}`;

  const text = [
    "New website form submission",
    "",
    `Form / page: ${page}`,
    `Name: ${fields.fullName}`,
    `Email: ${fields.email}`,
    `Phone / WhatsApp: ${fields.phone}`,
    `Inquiry type: ${requestLabel}`,
    "",
    "Message:",
    fields.message,
  ].join("\n");

  const html = shell({
    title: subject,
    preheader: `New request from ${fields.fullName} via ${page}`,
    bodyHtml: `
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.primary};font-weight:700;">Internal notification</p>
      <h2 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:${BRAND.dark};">You received a new request</h2>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
        A visitor submitted a request from <strong style="color:${BRAND.dark};">${escapeHtml(page)}</strong>
        for <strong style="color:${BRAND.dark};">${escapeHtml(requestLabel)}</strong>.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Form / page", escapeHtml(page))}
        ${detailRow("Name", escapeHtml(fields.fullName))}
        ${detailRow("Email", `<a href="mailto:${escapeHtml(fields.email)}" style="color:${BRAND.dark};">${escapeHtml(fields.email)}</a>`)}
        ${detailRow("Phone / WhatsApp", escapeHtml(fields.phone))}
        ${detailRow("Inquiry type", escapeHtml(requestLabel))}
        ${detailRow("Message", `<span style="white-space:pre-wrap;">${escapeHtml(fields.message)}</span>`)}
      </table>
    `,
  });

  return { subject, text, html };
}

export function buildClientNewsletterEmail(email: string): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = "You’re subscribed – Take & Bring newsletter";
  const text = [
    "Thank you for subscribing!",
    "",
    "Your newsletter signup was successful. You’ll hear from Take & Bring soon with logistics tips and updates.",
    "",
    `Subscribed email: ${email}`,
  ].join("\n");

  const html = shell({
    title: subject,
    preheader: "Your newsletter signup was successful.",
    bodyHtml: `
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.primary};font-weight:700;">Newsletter</p>
      <h2 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:${BRAND.dark};">Congratulations!</h2>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
        Your request to subscribe to the Take & Bring newsletter has been submitted successfully.
        We’ll keep you updated with useful logistics insights.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Subscribed email", escapeHtml(email))}
      </table>
    `,
  });

  return { subject, text, html };
}

export function buildCompanyNewsletterEmail(email: string): {
  subject: string;
  text: string;
  html: string;
} {
  const subject = `New newsletter signup – ${email}`;
  const text = `New newsletter signup\n\nEmail: ${email}\nForm / page: Newsletter`;
  const html = shell({
    title: subject,
    preheader: `New newsletter signup from ${email}`,
    bodyHtml: `
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.primary};font-weight:700;">Internal notification</p>
      <h2 style="margin:0 0 14px;font-size:22px;line-height:1.3;color:${BRAND.dark};">You received a new request</h2>
      <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:${BRAND.muted};">
        A visitor submitted a newsletter signup from the homepage.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${detailRow("Form / page", "Newsletter")}
        ${detailRow("Email", `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.dark};">${escapeHtml(email)}</a>`)}
      </table>
    `,
  });

  return { subject, text, html };
}
