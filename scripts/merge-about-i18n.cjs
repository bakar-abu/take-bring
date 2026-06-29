const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

const metadata = {
  en: {
    title: "About Take & Bring | European Logistics Since 2004",
    description:
      "Discover Take & Bring — a full-service European logistics company with 20+ years of experience, 1,000+ vehicles, and courier, freight, refrigerated, and international transport across Germany, Romania, and the EU.",
  },
  de: {
    title: "Über Take & Bring | Europäische Logistik seit 2004",
    description:
      "Lernen Sie Take & Bring kennen – ein Full-Service-Logistikunternehmen in Europa mit über 20 Jahren Erfahrung, 1.000+ Fahrzeugen sowie Kurier-, Fracht-, Kühl- und internationalem Transport in Deutschland, Rumänien und der EU.",
  },
  ro: {
    title: "Despre Take & Bring | Logistică europeană din 2004",
    description:
      "Descoperă Take & Bring — o companie europeană de logistică completă cu peste 20 de ani de experiență, 1.000+ vehicule și transport de curierat, marfă, frigorific și internațional în Germania, România și UE.",
  },
};

["en", "de", "ro"].forEach((locale) => {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const ap = JSON.parse(
    fs.readFileSync(path.join(fragDir, `about-page-${locale}.json`), "utf8"),
  );
  data.aboutPage = ap;
  data.metadata = data.metadata || {};
  data.metadata.ueberUns = metadata[locale];
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
});

console.log("about i18n merged");
