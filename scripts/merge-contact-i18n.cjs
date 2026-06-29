const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

const metadata = {
  en: {
    title: "Contact Take & Bring | Logistics Support Across Europe",
    description:
      "Contact Take & Bring for freight, refrigerated, courier, and international transport. Call, email, or WhatsApp our team — quotes within 2 hours. Based in Germany, serving the EU.",
  },
  de: {
    title: "Kontakt Take & Bring | Logistik-Support in ganz Europa",
    description:
      "Kontaktieren Sie Take & Bring für Spedition, Kühltransport, Kurier und internationalen Versand. Telefon, E-Mail oder WhatsApp – Angebote innerhalb von 2 Stunden. Sitz in Deutschland, EU-weit tätig.",
  },
  ro: {
    title: "Contact Take & Bring | Suport logistic în toată Europa",
    description:
      "Contactează Take & Bring pentru transport de marfă, frigorific, curierat și internațional. Telefon, e-mail sau WhatsApp – oferte în 2 ore. Cu sediul în Germania, deservind UE.",
  },
};

["en", "de", "ro"].forEach((locale) => {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const cp = JSON.parse(
    fs.readFileSync(path.join(fragDir, `contact-page-${locale}.json`), "utf8"),
  );
  data.contactPage = cp;
  data.metadata = data.metadata || {};
  data.metadata.kontakt = metadata[locale];
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
});

console.log("contact i18n merged");
