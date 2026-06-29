const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

const metadata = {
  en: {
    title: "Logistics Blog | Take & Bring Insights & Tips",
    description:
      "Expert logistics insights from Take & Bring: freight forwarding, refrigerated transport, courier services, customs, and supply chain tips for businesses across Europe.",
  },
  de: {
    title: "Logistik-Blog | Take & Bring Wissen & Tipps",
    description:
      "Experten-Logistikwissen von Take & Bring: Spedition, Kühltransport, Kurierdienste, Zoll und Supply-Chain-Tipps für Unternehmen in ganz Europa.",
  },
  ro: {
    title: "Blog de logistică | Informații și sfaturi Take & Bring",
    description:
      "Informații logistice de specialitate de la Take & Bring: expediții de marfă, transport frigorific, curierat, vamă și sfaturi pentru lanțul de aprovizionare în Europa.",
  },
};

["en", "de", "ro"].forEach((locale) => {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const bp = JSON.parse(
    fs.readFileSync(path.join(fragDir, `blog-page-${locale}.json`), "utf8"),
  );
  data.blogPage = bp;
  data.metadata = data.metadata || {};
  data.metadata.blog = metadata[locale];
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
});

console.log("blog i18n merged");
