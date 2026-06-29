const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

function mergeLocale(locale) {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const sp = JSON.parse(
    fs.readFileSync(path.join(fragDir, `services-pages-${locale}.json`), "utf8"),
  );
  const slf = JSON.parse(
    fs.readFileSync(path.join(fragDir, `service-lead-form-${locale}.json`), "utf8"),
  );
  data.servicesPages = sp;
  data.serviceLeadForm = slf;

  if (locale === "en") {
    data.metadata.festeRouten = {
      title: "Regular Tours",
      description:
        "Fixed route and scheduled transport with dedicated capacity and predictable delivery windows.",
    };
    data.metadata.internationalerVersand = {
      title: "International Shipping",
      description:
        "Road, sea, and air international freight with customs support across Europe and beyond.",
    };
    data.servicesDropdown.regularTours = "Regular Tours";
    data.servicesDropdown.international = "International Shipping";
    delete data.servicesDropdown.tracking;
  }

  if (locale === "de") {
    data.metadata.festeRouten = {
      title: "Feste Routen",
      description:
        "Regelmäßige Transporte auf festen Routen mit planbaren Lieferzeiten und dedizierter Kapazität.",
    };
    data.metadata.internationalerVersand = {
      title: "Internationaler Versand",
      description:
        "Straßen-, See- und Luftfracht mit Zollunterstützung in Europa und darüber hinaus.",
    };
    data.servicesDropdown.regularTours = "Feste Routen";
    data.servicesDropdown.international = "Internationaler Versand";
    delete data.servicesDropdown.tracking;
  }

  if (locale === "ro") {
    data.metadata.festeRouten = {
      title: "Tururi regulate",
      description:
        "Transport programat pe rute fixe cu capacitate dedicată și ferestre de livrare predictibile.",
    };
    data.metadata.internationalerVersand = {
      title: "Transport internațional",
      description:
        "Transport rutier, maritim și aerian cu suport vamal în Europa și nu numai.",
    };
    data.servicesDropdown.regularTours = "Tururi regulate";
    data.servicesDropdown.international = "Transport internațional";
    delete data.servicesDropdown.tracking;
  }

  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const enSp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "services-pages-en.json"), "utf8"),
);
const enSlf = JSON.parse(
  fs.readFileSync(path.join(fragDir, "service-lead-form-en.json"), "utf8"),
);

fs.writeFileSync(
  path.join(fragDir, "services-pages-de.json"),
  JSON.stringify(enSp, null, 2),
);
fs.writeFileSync(
  path.join(fragDir, "services-pages-ro.json"),
  JSON.stringify(enSp, null, 2),
);
fs.writeFileSync(
  path.join(fragDir, "service-lead-form-de.json"),
  JSON.stringify(
    {
      ...enSlf,
      fullName: "Vollständiger Name",
      fullNamePlaceholder: "Ihr vollständiger Name",
      email: "E-Mail",
      emailPlaceholder: "ihre@email.de",
      phone: "Telefon / WhatsApp",
      phonePlaceholder: "+49 ...",
      inquiryType: "Anfrageart",
      inquiryTypePlaceholder: "Anfrageart wählen",
      inquiryFreight: "Spedition LKW",
      inquiryRefrigerated: "Kühltransporte",
      inquiryCourier: "Kuriertransporte",
      inquiryRegularTours: "Feste Routen",
      inquiryInternational: "Internationaler Versand",
      inquiryGeneral: "Allgemeine Anfrage",
      message: "Ihre Nachricht",
      submitButton: "Anfrage senden",
      submitSending: "Wird gesendet...",
      successMessage:
        "Vielen Dank! Unser Team meldet sich innerhalb von 2 Stunden.",
      errorMessage:
        "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder rufen Sie uns an.",
    },
    null,
    2,
  ),
);
fs.writeFileSync(
  path.join(fragDir, "service-lead-form-ro.json"),
  JSON.stringify(
    {
      ...enSlf,
      fullName: "Nume complet",
      fullNamePlaceholder: "Numele dvs. complet",
      email: "E-mail",
      emailPlaceholder: "email@exemplu.ro",
      phone: "Telefon / WhatsApp",
      phonePlaceholder: "+40 ...",
      inquiryType: "Tip solicitare",
      inquiryTypePlaceholder: "Selectați tipul",
      inquiryFreight: "Expediere marfă",
      inquiryRefrigerated: "Transport frigorific",
      inquiryCourier: "Serviciu curier",
      inquiryRegularTours: "Tururi regulate",
      inquiryInternational: "Transport internațional",
      inquiryGeneral: "Solicitare generală",
      message: "Mesajul dvs.",
      submitButton: "Trimite solicitarea",
      submitSending: "Se trimite...",
      successMessage: "Mulțumim! Echipa noastră vă va contacta în 2 ore.",
      errorMessage:
        "Ceva nu a funcționat. Încercați din nou sau sunați-ne.",
    },
    null,
    2,
  ),
);

["en", "de", "ro"].forEach(mergeLocale);
console.log("merged");
