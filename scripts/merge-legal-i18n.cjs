const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

const metadata = {
  en: {
    datenschutz: {
      title: "Privacy Policy",
      description:
        "Read the Take & Bring Privacy Policy: how we collect, use, and protect your personal data in line with the GDPR.",
    },
    impressum: {
      title: "Legal Notice",
      description:
        "Legal Notice and company information for Take & Bring GmbH, based in Bergisch Gladbach, Germany.",
    },
  },
  de: {
    datenschutz: {
      title: "Datenschutzerklärung",
      description:
        "Lesen Sie die Datenschutzerklärung von Take & Bring: wie wir Ihre personenbezogenen Daten gemäß DSGVO erheben, verwenden und schützen.",
    },
    impressum: {
      title: "Impressum",
      description:
        "Impressum und Unternehmensangaben der Take & Bring GmbH mit Sitz in Bergisch Gladbach, Deutschland.",
    },
  },
  ro: {
    datenschutz: {
      title: "Politică de confidențialitate",
      description:
        "Citește Politica de confidențialitate Take & Bring: cum colectăm, folosim și protejăm datele tale personale conform GDPR.",
    },
    impressum: {
      title: "Notă legală",
      description:
        "Notă legală și informații despre compania Take & Bring GmbH, cu sediul în Bergisch Gladbach, Germania.",
    },
  },
};

["en", "de", "ro"].forEach((locale) => {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  data.privacyPage = JSON.parse(
    fs.readFileSync(path.join(fragDir, `privacy-page-${locale}.json`), "utf8"),
  );
  data.legalPage = JSON.parse(
    fs.readFileSync(path.join(fragDir, `legal-page-${locale}.json`), "utf8"),
  );

  data.metadata = data.metadata || {};
  data.metadata.datenschutz = metadata[locale].datenschutz;
  data.metadata.impressum = metadata[locale].impressum;

  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
});

console.log("legal i18n merged");
