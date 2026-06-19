import type { Locale } from "@/types/locale";

export type CaseStudyMetric = {
  label: Record<Locale, string>;
  value: Record<Locale, string>;
};

export type CaseStudy = {
  id: "case1" | "case2" | "case3";
  slug: string;
  image: string;
  industry: Record<Locale, string>;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
  challenge: Record<Locale, string>;
  solution: Record<Locale, string>;
  impact: Record<Locale, string>;
  metrics: CaseStudyMetric[];
};

const en = {
  case1: {
    industry: "Courier service & local deliveries",
    title: "Faster local deliveries for businesses",
    excerpt:
      "Our courier and local delivery services help businesses manage daily shipments efficiently with reliable pickup and on-time delivery.",
    challenge:
      "The client handled many short-notice city shipments and lacked visibility into pickup windows and delivery ETAs.",
    solution:
      "We introduced fixed pickup windows, priority route planning, and a clear tracking-update workflow for dispatch and recipients.",
    impact:
      "Fewer support follow-ups, faster turnaround cycles, and better day-to-day planning for operations.",
    metrics: [
      { label: "Faster delivery speed", value: "+32%" },
      { label: "On-time deliveries", value: "98.6%" },
      { label: "Fewer support tickets", value: "-27%" },
    ],
  },
  case2: {
    industry: "Refrigerated transport",
    title: "Reliable cold-chain transports",
    excerpt:
      "Our refrigerated transport solutions ensure safe, temperature-controlled deliveries for goods that require a stable cold chain throughout transport.",
    challenge:
      "Temperature-sensitive shipments with different setpoints had to be distributed without breaking the cold chain.",
    solution:
      "We combined temperature-controlled vehicles, digital temperature documentation, preplanned loading routines, and escalation paths for deviations.",
    impact:
      "Higher product safety, stronger audit readiness, and significantly reduced losses from temperature deviations.",
    metrics: [
      { label: "Temperature deviations", value: "-41%" },
      { label: "Claim rate", value: "-33%" },
      { label: "Audit readiness", value: "99.1%" },
    ],
  },
  case3: {
    industry: "Freight forwarding & international shipping",
    title: "Efficient transport across regions",
    excerpt:
      "With our freight forwarding and international shipping solutions, businesses can move goods smoothly across national and international routes.",
    challenge:
      "Multiple destination countries, fluctuating volumes, and different transit-time targets made planning inconsistent.",
    solution:
      "We grouped lanes into stable transport corridors, standardized departure windows, and prioritized shipments by transit-time target.",
    impact:
      "Better capacity utilization, more predictable pre-carriage, and higher delivery reliability across international lanes.",
    metrics: [
      { label: "Transit time improvement", value: "+24%" },
      { label: "Route coverage", value: "+18 countries" },
      { label: "Capacity utilization", value: "+21%" },
    ],
  },
};

const de = {
  case1: {
    industry: "Kurierdienst & Lokale Lieferungen",
    title: "Schnellere lokale Lieferungen fuer Unternehmen",
    excerpt:
      "Unsere Kurier- und lokalen Lieferdienste helfen Unternehmen, taegliche Sendungen effizient mit zuverlaessiger Abholung und puenktlicher Zustellung zu verwalten.",
    challenge:
      "Der Kunde hatte viele kurzfristige City-Sendungen und zu wenig Transparenz bei Abholzeiten und ETA fuer Empfaenger.",
    solution:
      "Wir haben feste Zeitfenster, priorisierte Tourenplanung und ein klares Tracking-Update-Format fuer Disposition und Empfaenger eingefuehrt.",
    impact:
      "Weniger Nachfragen im Support, schnellere Umlaeufe und bessere Planbarkeit fuer das operative Team.",
    metrics: [
      { label: "Schneller zugestellt", value: "+32%" },
      { label: "Puenktlich zugestellt", value: "98.6%" },
      { label: "Weniger Support-Tickets", value: "-27%" },
    ],
  },
  case2: {
    industry: "Kuehltransport",
    title: "Zuverlaessige Kuehlketten-Transporte",
    excerpt:
      "Unsere Kuehltransportloesungen gewaehrleisten sichere und temperaturkontrollierte Lieferungen fuer Waren, die eine stabile Kuehlkette waehrend des Transports benoetigen.",
    challenge:
      "Temperatursensible Sendungen mit verschiedenen Sollwerten mussten ohne Unterbrechung der Kuehlkette verteilt werden.",
    solution:
      "Wir haben temperaturgefuehrte Fahrzeuge mit digitaler Dokumentation, vorbereiteten Beladeablaeufen und Eskalationspfaden fuer Abweichungen kombiniert.",
    impact:
      "Mehr Produktsicherheit, stabilere Audits und deutlich geringere Ausfallkosten durch Temperaturabweichungen.",
    metrics: [
      { label: "Temperaturabweichungen", value: "-41%" },
      { label: "Reklamationsquote", value: "-33%" },
      { label: "Audit-Sicherheit", value: "99.1%" },
    ],
  },
  case3: {
    industry: "Freight Forwarding & Internationaler Versand",
    title: "Effizienter Transport ueber Regionen hinweg",
    excerpt:
      "Mit unseren Freight-Forwarding- und internationalen Versandloesungen koennen Unternehmen ihre Waren reibungslos ueber nationale und internationale Routen transportieren.",
    challenge:
      "Mehrere Lieferlaender, wechselnde Volumina und unterschiedliche Laufzeitziele erschwerten eine stabile Planung.",
    solution:
      "Wir haben Routen in feste Korridore gebuendelt, Abfahrtsfenster standardisiert und Sendungspriorisierung nach Laufzeit eingefuehrt.",
    impact:
      "Bessere Kapazitaetsauslastung, planbare Vorlaeufe und hoehere Liefertreue auf internationalen Strecken.",
    metrics: [
      { label: "Laufzeit verbessert", value: "+24%" },
      { label: "Routenabdeckung", value: "+18 Laender" },
      { label: "Kapazitaetsauslastung", value: "+21%" },
    ],
  },
};

function buildCase(
  id: CaseStudy["id"],
  slug: string,
  image: string,
): CaseStudy {
  return {
    id,
    slug,
    image,
    industry: { de: de[id].industry, en: en[id].industry, ro: en[id].industry },
    title: { de: de[id].title, en: en[id].title, ro: en[id].title },
    excerpt: { de: de[id].excerpt, en: en[id].excerpt, ro: en[id].excerpt },
    challenge: {
      de: de[id].challenge,
      en: en[id].challenge,
      ro: en[id].challenge,
    },
    solution: {
      de: de[id].solution,
      en: en[id].solution,
      ro: en[id].solution,
    },
    impact: { de: de[id].impact, en: en[id].impact, ro: en[id].impact },
    metrics: de[id].metrics.map((metric, index) => ({
      label: {
        de: metric.label,
        en: en[id].metrics[index].label,
        ro: en[id].metrics[index].label,
      },
      value: {
        de: metric.value,
        en: en[id].metrics[index].value,
        ro: en[id].metrics[index].value,
      },
    })),
  };
}

export const CASE_STUDIES: CaseStudy[] = [
  buildCase("case1", "faster-local-deliveries-for-businesses", "/images/case-study-1.webp"),
  buildCase("case2", "reliable-cold-chain-transports", "/images/case-study-2.webp"),
  buildCase("case3", "efficient-transport-across-regions", "/images/case-study-3.webp"),
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((item) => item.slug === slug);
}
