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

export type DashboardInvitePayload = {
  fullName: string;
  email: string;
  password: string;
  role: string;
  loginUrl: string;
};

export async function sendDashboardUserInviteEmail(
  payload: DashboardInvitePayload,
) {
  if (!isSmtpConfigured()) {
    throw new Error(
      "SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, and MAIL_TO.",
    );
  }

  const fromUser = requireEnv("SMTP_USER");
  const fromName = process.env.MAIL_FROM_NAME?.trim() || "Take & Bring Website";
  const companyTo = process.env.MAIL_TO?.trim() || fromUser;
  const transporter = createMailTransporter();

  const subject = "Your Take & Bring dashboard account";
  const text = [
    `Hello ${payload.fullName},`,
    "",
    "An administrator created a dashboard account for you.",
    "",
    `Login URL: ${payload.loginUrl}`,
    `Email: ${payload.email}`,
    `Temporary password: ${payload.password}`,
    `Role: ${payload.role}`,
    "",
    "Please sign in and change your password after your first login if possible.",
    "",
    "— Take & Bring",
  ].join("\n");

  const html = `
    <p>Hello ${escapeHtml(payload.fullName)},</p>
    <p>An administrator created a dashboard account for you.</p>
    <ul>
      <li><strong>Login URL:</strong> <a href="${escapeHtml(payload.loginUrl)}">${escapeHtml(payload.loginUrl)}</a></li>
      <li><strong>Email:</strong> ${escapeHtml(payload.email)}</li>
      <li><strong>Temporary password:</strong> ${escapeHtml(payload.password)}</li>
      <li><strong>Role:</strong> ${escapeHtml(payload.role)}</li>
    </ul>
    <p>Please sign in and change your password after your first login if possible.</p>
    <p>— Take &amp; Bring</p>
  `;

  await transporter.sendMail({
    from: `"${fromName}" <${fromUser}>`,
    to: payload.email,
    replyTo: companyTo,
    subject,
    text,
    html,
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** @deprecated Use sendNewsletterEmails */
export async function sendNewsletterEmail(email: string) {
  return sendNewsletterEmails(email);
}
