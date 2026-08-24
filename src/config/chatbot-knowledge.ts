import { siteConfig } from "@/config/site";

export type ChatbotLocale = "ro" | "de" | "en";

/** Digits-only WhatsApp id from siteConfig (wa.me/…) */
export const BUSINESS_WHATSAPP =
  siteConfig.social.whatsapp.replace(/^https?:\/\/wa\.me\//, "").replace(/\D/g, "") ||
  "4922346889977";

export const BUSINESS_PHONE = siteConfig.contact.phone.replace(/[^\d+]/g, "");

export const chatbotKnowledge: Record<ChatbotLocale, string> = {
  ro: `
Take & Bring este o companie de logistică (Take & Bring GmbH) cu sediul în Bergisch Gladbach, Germania.
Oferă soluții de curierat și transport în Germania, România și în Uniunea Europeană.
Servicii:
- Transport curier și express (ridicare rapidă)
- Expediții și transport cu camionul
- Transport frigorific
- Rute fixe și transporturi recurente
- Transport internațional (rutier, maritim, aerian) cu suport vamal

Ofertele se pregătesc individual. Pentru o ofertă sunt necesare cel puțin locul de ridicare,
locul de livrare, detalii despre marfă și datele de contact. Nu inventați și nu estimați prețuri.
Pentru întrebări urgente, complexe sau fără răspuns clar, direcționați clientul pe WhatsApp sau telefon.

Contact:
- Telefon și WhatsApp: ${siteConfig.contact.phone}
- Email: ${siteConfig.contact.email}
- Program: ${siteConfig.contact.hours}
- Adresă: ${siteConfig.contact.address}
- Website: ${siteConfig.url}
`.trim(),
  de: `
Take & Bring ist ein Logistikunternehmen (Take & Bring GmbH) mit Sitz in Bergisch Gladbach, Deutschland.
Das Unternehmen bietet Kurier- und Transportlösungen in Deutschland, Rumänien und der EU an.
Leistungen:
- Kurierfahrten und Expresslieferungen (schnelle Abholung)
- Spedition und LKW-Transporte
- Kühltransporte
- Feste Touren und regelmäßige Transporte
- Internationale Transporte (Straße, See, Luft) mit Zollunterstützung

Angebote werden individuell erstellt. Für ein Angebot werden mindestens Abholort,
Zielort, Transportgut sowie Kontaktdaten benötigt. Preise dürfen nicht erfunden oder
geschätzt werden. Bei dringenden, komplexen oder nicht eindeutig beantwortbaren Fragen
soll der Kunde WhatsApp oder Telefon verwenden.

Kontakt:
- Telefon und WhatsApp: ${siteConfig.contact.phone}
- E-Mail: ${siteConfig.contact.email}
- Öffnungszeiten: ${siteConfig.contact.hours}
- Adresse: ${siteConfig.contact.address}
- Website: ${siteConfig.url}
`.trim(),
  en: `
Take & Bring is a logistics company (Take & Bring GmbH) based in Bergisch Gladbach, Germany.
The company provides courier and transport solutions across Germany, Romania, and the EU.
Services:
- Courier and express delivery (fast pickup)
- Freight forwarding and truck transport
- Refrigerated transport
- Fixed routes and recurring transport
- International transport (road, sea, air) with customs support

Quotes are prepared individually. A quote requires at least pickup location,
delivery location, cargo details and contact information. Never invent or estimate
prices. For urgent, complex or unanswered questions, direct the customer to WhatsApp
or phone.

Contact:
- Phone and WhatsApp: ${siteConfig.contact.phone}
- Email: ${siteConfig.contact.email}
- Hours: ${siteConfig.contact.hours}
- Address: ${siteConfig.contact.address}
- Website: ${siteConfig.url}
`.trim(),
};

type Faq = {
  keywords: string[];
  answer: string;
  suggestLead?: boolean;
  suggestEscalation?: boolean;
};

const faqs: Record<ChatbotLocale, Faq[]> = {
  ro: [
    {
      keywords: ["servici", "oferi", "transport"],
      answer:
        "Oferim curier și express, expediții și transport cu camionul, transport frigorific, rute fixe și transport internațional în Germania, România și UE.",
    },
    {
      keywords: ["preț", "pret", "cost", "ofertă", "oferta", "tarif"],
      answer:
        "Prețurile se calculează individual. Pot prelua cererea dvs. – avem nevoie de locul de ridicare, livrare, detalii despre marfă și datele de contact.",
      suggestLead: true,
    },
    {
      keywords: ["frig", "temperatura", "refrigerat", "racire"],
      answer:
        "Da, oferim transport frigorific. Pentru o evaluare precisă avem nevoie de temperatura cerută, traseu, termen și detalii despre marfă.",
    },
    {
      keywords: ["internațional", "international", "străinătate", "europa", "ue"],
      answer:
        "Da, transportul internațional face parte din serviciile noastre (rutier, maritim, aerian). Trimiteți origine, destinație, termen și detalii despre marfă.",
    },
    {
      keywords: ["urgent", "imediat", "express", "azi"],
      answer:
        "Pentru o ridicare urgentă, vă rugăm să contactați echipa direct pe WhatsApp sau telefon.",
      suggestEscalation: true,
    },
  ],
  de: [
    {
      keywords: ["leistung", "service"],
      answer:
        "Wir bieten Kurier- und Expressfahrten, Spedition und LKW-Transporte, Kühltransporte, feste Touren sowie internationale Transporte in Deutschland, Rumänien und der EU an.",
    },
    {
      keywords: ["preis", "kosten", "angebot", "quote"],
      answer:
        "Unsere Preise werden individuell berechnet. Ich kann Ihre Anfrage aufnehmen – dafür benötigen wir Abholort, Zielort, Transportgut und Ihre Kontaktdaten.",
      suggestLead: true,
    },
    {
      keywords: ["kühl", "kuehl", "temperatur"],
      answer:
        "Ja, wir bieten Kühltransporte an. Für eine genaue Prüfung benötigen wir Temperaturanforderung, Strecke, Termin und Angaben zur Ware.",
    },
    {
      keywords: ["international", "ausland", "europa"],
      answer:
        "Ja, internationale Transporte gehören zu unseren Leistungen. Senden Sie uns Start, Ziel, Termin und Frachtdetails für eine individuelle Prüfung.",
    },
    {
      keywords: ["dringend", "sofort", "express", "heute"],
      answer:
        "Für eine dringende Abholung kontaktieren Sie unser Team bitte direkt über WhatsApp oder Telefon.",
      suggestEscalation: true,
    },
  ],
  en: [
    {
      keywords: ["service", "transport", "offer"],
      answer:
        "We provide courier and express delivery, freight forwarding and truck transport, refrigerated transport, fixed routes, and international transport across Germany, Romania, and the EU.",
    },
    {
      keywords: ["price", "cost", "quote", "rate"],
      answer:
        "Pricing is calculated individually. I can capture your request; we need the pickup, delivery, cargo details, and your contact information.",
      suggestLead: true,
    },
    {
      keywords: ["cold", "refrigerated", "temperature"],
      answer:
        "Yes, we provide refrigerated transport. Please share the temperature requirement, route, date, and cargo details for an accurate assessment.",
    },
    {
      keywords: ["international", "abroad", "europe"],
      answer:
        "Yes, international transport is one of our services. Send us the origin, destination, date, and freight details for an individual assessment.",
    },
    {
      keywords: ["urgent", "immediately", "express", "today"],
      answer:
        "For an urgent pickup, please contact our team directly through WhatsApp or phone.",
      suggestEscalation: true,
    },
  ],
};

export function normalizeChatbotLocale(value: unknown): ChatbotLocale {
  if (value === "de" || value === "en" || value === "ro") return value;
  return "ro";
}

export function getFaqFallback(message: string, locale: ChatbotLocale) {
  const normalized = message.toLocaleLowerCase(locale === "ro" ? "ro" : locale);
  const asksAboutCoverage =
    locale === "ro"
      ? /(acoperi|livr|transport|servi).*(germania|românia|romania|europa|ue|regiune|oraș|oras)/.test(
          normalized,
        )
      : locale === "de"
        ? /(bedienen|fahren|liefern|transportieren).*(deutschland|rumänien|rumaenien|europa|bundesweit|stadt|region)/.test(
            normalized,
          )
        : /(serve|cover|deliver|provide|transport).*(germany|romania|europe|eu|region|city)/.test(
            normalized,
          );

  if (asksAboutCoverage) {
    if (locale === "ro") {
      return {
        answer:
          "Da. Oferim transport în Germania, România și în UE – ridicare și livrare în regiunile pe care le deservim.",
      };
    }
    if (locale === "de") {
      return {
        answer:
          "Ja. Wir bieten Transportleistungen in Deutschland, Rumänien und der EU an und bedienen Abhol- und Zielorte in unseren Einsatzgebieten.",
      };
    }
    return {
      answer:
        "Yes. We provide transport across Germany, Romania, and the EU, covering pickup and delivery in the regions we serve.",
    };
  }

  const match = faqs[locale].find((faq) =>
    faq.keywords.some((keyword) => normalized.includes(keyword)),
  );

  if (match) return match;

  if (locale === "ro") {
    return {
      answer:
        "Nu am informații sigure despre asta. Pot pune o întrebare de urmărire sau vă pot conecta direct cu echipa noastră.",
      suggestEscalation: true,
    };
  }
  if (locale === "de") {
    return {
      answer:
        "Dazu habe ich keine sichere Information. Ich kann Ihnen eine Rückfrage stellen oder Sie direkt mit unserem Team verbinden.",
      suggestEscalation: true,
    };
  }
  return {
    answer:
      "I do not have reliable information about that. I can ask a follow-up question or connect you directly with our team.",
    suggestEscalation: true,
  };
}
