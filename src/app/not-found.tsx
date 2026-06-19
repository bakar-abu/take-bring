import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <html lang={siteConfig.defaultLocale}>
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontSize: 48, margin: "0 0 8px" }}>404</h1>
          <p style={{ color: "#64748b", margin: "0 0 24px" }}>Page not found</p>
          <a href="/" style={{ color: "#abc629", fontWeight: 600 }}>
            Back to Home
          </a>
        </div>
      </body>
    </html>
  );
}
