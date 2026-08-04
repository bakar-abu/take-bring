/**
 * Merge translated services + industries fragments into locale JSON
 * WITHOUT overwriting DE/RO fragments with English.
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const fragDir = path.join(root, "src/messages/fragments");

function flatKeys(obj, prefix = "", out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatKeys(v, p, out);
    else out.push(p);
  }
  return out;
}

function assertKeyParity(label, a, b) {
  const ka = flatKeys(a).sort();
  const kb = flatKeys(b).sort();
  if (ka.length !== kb.length || ka.some((k, i) => k !== kb[i])) {
    const missing = ka.filter((k) => !kb.includes(k));
    const extra = kb.filter((k) => !ka.includes(k));
    throw new Error(
      `${label} key mismatch. missing=${missing.slice(0, 10)} extra=${extra.slice(0, 10)}`,
    );
  }
}

const enSp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "services-pages-en.json"), "utf8"),
);
const deSp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "services-pages-de.json"), "utf8"),
);
const roSp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "services-pages-ro.json"), "utf8"),
);
assertKeyParity("services DE", enSp, deSp);
assertKeyParity("services RO", enSp, roSp);

const enIp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "industries-page-en.json"), "utf8"),
);
const deIp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "industries-page-de.json"), "utf8"),
);
const roIp = JSON.parse(
  fs.readFileSync(path.join(fragDir, "industries-page-ro.json"), "utf8"),
);
assertKeyParity("industries DE", enIp, deIp);
assertKeyParity("industries RO", enIp, roIp);

const common = {
  en: {
    mailSubmittedToast: "Your mail is submitted",
    sendErrorGeneric: "Could not send your request. Please try again.",
    subscribeErrorGeneric: "Could not subscribe. Please try again.",
    captchaTitle: "Quick verification",
    captchaSubtitle: "Solve this to confirm you're human.",
    captchaQuestion: "What is {question}?",
    captchaIncorrect: "Incorrect answer. Please try again.",
    captchaAnswerPlaceholder: "Your answer",
    captchaVerify: "Verify",
    captchaVerifying: "Verifying...",
    captchaCloseVerification: "Close verification",
    captchaClose: "Close",
    dismiss: "Dismiss",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    goToSlide: "Go to slide {n}",
    blogEmpty: "No published posts yet.",
  },
  de: {
    mailSubmittedToast: "Ihre Nachricht wurde gesendet",
    sendErrorGeneric:
      "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    subscribeErrorGeneric:
      "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    captchaTitle: "Schnelle Überprüfung",
    captchaSubtitle: "Lösen Sie diese Aufgabe, um zu bestätigen, dass Sie ein Mensch sind.",
    captchaQuestion: "Was ist {question}?",
    captchaIncorrect: "Falsche Antwort. Bitte versuchen Sie es erneut.",
    captchaAnswerPlaceholder: "Ihre Antwort",
    captchaVerify: "Bestätigen",
    captchaVerifying: "Wird geprüft...",
    captchaCloseVerification: "Überprüfung schließen",
    captchaClose: "Schließen",
    dismiss: "Schließen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    goToSlide: "Zur Folie {n}",
    blogEmpty: "Noch keine veröffentlichten Beiträge.",
  },
  ro: {
    mailSubmittedToast: "Mesajul dvs. a fost trimis",
    sendErrorGeneric:
      "Cererea nu a putut fi trimisă. Vă rugăm să încercați din nou.",
    subscribeErrorGeneric:
      "Abonarea a eșuat. Vă rugăm să încercați din nou.",
    captchaTitle: "Verificare rapidă",
    captchaSubtitle: "Rezolvați această operație pentru a confirma că sunteți om.",
    captchaQuestion: "Cât face {question}?",
    captchaIncorrect: "Răspuns greșit. Vă rugăm să încercați din nou.",
    captchaAnswerPlaceholder: "Răspunsul dvs.",
    captchaVerify: "Verifică",
    captchaVerifying: "Se verifică...",
    captchaCloseVerification: "Închide verificarea",
    captchaClose: "Închide",
    dismiss: "Închide",
    openMenu: "Deschide meniul",
    closeMenu: "Închide meniul",
    goToSlide: "Mergi la slide-ul {n}",
    blogEmpty: "Nu există încă articole publicate.",
  },
};

const contactMapExtra = {
  en: {
    successMessage:
      "Your query has been submitted. Our representative will contact you within 2 hours.",
    errorMessage:
      "We are having trouble sending your query. Please contact us via mail or WhatsApp.",
  },
  de: {
    successMessage:
      "Ihre Anfrage wurde übermittelt. Unser Team meldet sich innerhalb von 2 Stunden.",
    errorMessage:
      "Beim Senden Ihrer Anfrage ist ein Problem aufgetreten. Bitte kontaktieren Sie uns per E-Mail oder WhatsApp.",
  },
  ro: {
    successMessage:
      "Solicitarea dvs. a fost trimisă. Un reprezentant vă va contacta în 2 ore.",
    errorMessage:
      "Avem dificultăți la trimiterea solicitării. Contactați-ne pe e-mail sau WhatsApp.",
  },
};

const newsletterExtra = {
  en: {
    successMessage: "Thanks for subscribing!",
    errorMessage: "Could not subscribe. Please try again.",
    toastSubmitted: "Your mail is submitted",
  },
  de: {
    successMessage: "Danke für Ihre Anmeldung!",
    errorMessage: "Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    toastSubmitted: "Ihre Nachricht wurde gesendet",
  },
  ro: {
    successMessage: "Mulțumim pentru abonare!",
    errorMessage: "Abonarea a eșuat. Vă rugăm să încercați din nou.",
    toastSubmitted: "Mesajul dvs. a fost trimis",
  },
};

const heroExtra = {
  en: {
    toastSubmitted: "Your mail is submitted",
    sendError: "Could not send your request. Please try again.",
  },
  de: {
    toastSubmitted: "Ihre Nachricht wurde gesendet",
    sendError:
      "Ihre Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
  },
  ro: {
    toastSubmitted: "Mesajul dvs. a fost trimis",
    sendError:
      "Cererea nu a putut fi trimisă. Vă rugăm să încercați din nou.",
  },
};

const ogLocales = { en: "en_US", de: "de_DE", ro: "ro_RO" };

["en", "de", "ro"].forEach((locale) => {
  const file = path.join(root, "src/messages", `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  data.servicesPages = JSON.parse(
    fs.readFileSync(path.join(fragDir, `services-pages-${locale}.json`), "utf8"),
  );
  data.industriesPage = JSON.parse(
    fs.readFileSync(path.join(fragDir, `industries-page-${locale}.json`), "utf8"),
  );
  data.common = common[locale];
  Object.assign(data.contactMapSection, contactMapExtra[locale]);
  Object.assign(data.newsletterSection, newsletterExtra[locale]);
  Object.assign(data.hero, heroExtra[locale]);
  data.blogPage.emptyState = common[locale].blogEmpty;

  // Fix TimeZone brand leftover
  if (typeof data.aboutSection?.paragraph1 === "string") {
    data.aboutSection.paragraph1 = data.aboutSection.paragraph1.replace(
      /At TimeZone/g,
      "At Take & Bring",
    );
    data.aboutSection.paragraph1 = data.aboutSection.paragraph1.replace(
      /Bei TimeZone/g,
      "Bei Take & Bring",
    );
  }

  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  console.log(`merged ${locale}`);
});

console.log("done");
