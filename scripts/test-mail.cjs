/**
 * One-off SMTP test: sends from info@take-bring.eu via KAS.
 *
 * Usage:
 *   npm run test:mail
 *   npm run test:mail -- other@example.com
 */
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

function loadEnvLocal() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (!fs.existsSync(envPath)) {
    throw new Error("Missing .env.local — create it from .env.example first.");
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();

  const to =
    process.argv[2]?.trim() ||
    process.env.TEST_MAIL_TO?.trim() ||
    "skbakar1999@gmail.com";

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const secure =
    process.env.SMTP_SECURE === undefined
      ? port === 465
      : process.env.SMTP_SECURE === "true";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const fromName = process.env.MAIL_FROM_NAME || "Take & Bring Website";

  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS must be set in .env.local");
  }

  console.log("Sending test mail...");
  console.log(`  Host: ${host}:${port} (secure=${secure})`);
  console.log(`  From: ${user}`);
  console.log(`  To:   ${to}`);

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await transporter.verify();
  console.log("SMTP connection verified.");

  const info = await transporter.sendMail({
    from: `"${fromName}" <${user}>`,
    to,
    subject: "Take & Bring – SMTP test",
    text: [
      "This is a test email from the Take & Bring website mailer.",
      "",
      `Sent at: ${new Date().toISOString()}`,
      `From mailbox: ${user}`,
      `SMTP host: ${host}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222">
        <h2>Take & Bring – SMTP test</h2>
        <p>This is a test email from the Take & Bring website mailer.</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p><strong>From mailbox:</strong> ${user}</p>
        <p><strong>SMTP host:</strong> ${host}</p>
      </div>
    `,
  });

  console.log("Test mail sent successfully.");
  console.log(`  Message ID: ${info.messageId}`);
}

main().catch((error) => {
  console.error("Test mail failed:");
  console.error(error);
  process.exit(1);
});
