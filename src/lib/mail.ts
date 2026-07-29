import nodemailer from "nodemailer";
import {
  buildClientNewsletterEmail,
  buildClientReceiptEmail,
  buildCompanyLeadEmail,
  buildCompanyNewsletterEmail,
  type LeadEmailFields,
} from "@/lib/email-templates";

export type ContactLeadPayload = LeadEmailFields;

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASS?.trim() &&
      process.env.MAIL_TO?.trim(),
  );
}

export function createMailTransporter() {
  const host = requireEnv("SMTP_HOST");
  const port = Number(process.env.SMTP_PORT ?? "465");
  const secure =
    process.env.SMTP_SECURE === undefined
      ? port === 465
      : process.env.SMTP_SECURE === "true";
  const user = requireEnv("SMTP_USER");
  const pass = requireEnv("SMTP_PASS");

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export async function sendContactLeadEmails(payload: ContactLeadPayload) {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and MAIL_TO.",
    );
  }

  const companyTo = requireEnv("MAIL_TO");
  const fromUser = requireEnv("SMTP_USER");
  const fromName = process.env.MAIL_FROM_NAME?.trim() || "Take & Bring Website";
  const transporter = createMailTransporter();

  const company = buildCompanyLeadEmail(payload);
  const client = buildClientReceiptEmail(payload);

  await transporter.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: companyTo,
    replyTo: `"${payload.fullName}" <${payload.email}>`,
    subject: company.subject,
    text: company.text,
    html: company.html,
  });

  await transporter.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: payload.email,
    replyTo: companyTo,
    subject: client.subject,
    text: client.text,
    html: client.html,
  });
}

/** @deprecated Use sendContactLeadEmails */
export async function sendContactLeadEmail(payload: ContactLeadPayload) {
  return sendContactLeadEmails(payload);
}

export async function sendNewsletterEmails(email: string) {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and MAIL_TO.",
    );
  }

  const companyTo = requireEnv("MAIL_TO");
  const fromUser = requireEnv("SMTP_USER");
  const fromName = process.env.MAIL_FROM_NAME?.trim() || "Take & Bring Website";
  const transporter = createMailTransporter();

  const company = buildCompanyNewsletterEmail(email);
  const client = buildClientNewsletterEmail(email);

  await transporter.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: companyTo,
    replyTo: email,
    subject: company.subject,
    text: company.text,
    html: company.html,
  });

  await transporter.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: email,
    replyTo: companyTo,
    subject: client.subject,
    text: client.text,
    html: client.html,
  });
}

/** @deprecated Use sendNewsletterEmails */
export async function sendNewsletterEmail(email: string) {
  return sendNewsletterEmails(email);
}
