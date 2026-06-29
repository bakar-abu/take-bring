const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

const industriesEn = JSON.parse(
  fs.readFileSync(path.join(fragDir, "industries-page-en.json"), "utf8"),
);

fs.writeFileSync(
  path.join(fragDir, "industries-page-de.json"),
  JSON.stringify(industriesEn, null, 2),
);
fs.writeFileSync(
  path.join(fragDir, "industries-page-ro.json"),
  JSON.stringify(industriesEn, null, 2),
);

const metadata = {
  en: {
    title: "Industries We Serve | Sector Logistics Solutions",
    description:
      "Industry-specific logistics for retail, manufacturing, food, healthcare, automotive, construction, technology, and agriculture. Courier, freight, refrigerated & international transport across Europe.",
  },
  de: {
    title: "Branchen | Branchenspezifische Logistiklösungen",
    description:
      "Branchenspezifische Logistik für Handel, Produktion, Lebensmittel, Gesundheitswesen, Automotive, Bau, Technologie und Landwirtschaft. Kurier, Spedition, Kühltransport und internationaler Versand in Europa.",
  },
  ro: {
    title: "Industrii | Soluții logistice pe sectoare",
    description:
      "Logistică specifică pentru retail, producție, alimente, sănătate, auto, construcții, tehnologie și agricultură. Curier, marfă, transport frigorific și internațional în Europa.",
  },
};

["en", "de", "ro"].forEach((locale) => {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const ip = JSON.parse(
    fs.readFileSync(path.join(fragDir, `industries-page-${locale}.json`), "utf8"),
  );
  data.industriesPage = ip;
  data.metadata.branchen = metadata[locale];
  data.serviceLeadForm.inquiryIndustries =
    locale === "de"
      ? "Branchenlogistik"
      : locale === "ro"
        ? "Logistică industrială"
        : "Industry logistics";
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
});

console.log("industries i18n merged");
