export type AnalyticsPeriod = "7d" | "30d";

export type AnalyticsKpis = {
  visitors: number;
  leads: number;
  conversionRate: number;
  consentRate: number;
  visitorsChangePct: number;
  leadsChangePct: number;
};

export type LocaleTraffic = {
  locale: "ro" | "de" | "en";
  label: string;
  visitors: number;
  leads: number;
  sharePct: number;
};

export type LeadSourceRow = {
  formKey: string;
  label: string;
  leads: number;
  sharePct: number;
};

export type ServiceDemandRow = {
  id: string;
  label: string;
  path: string;
  views: number;
  leads: number;
};

export type CtaPerformanceRow = {
  id: string;
  label: string;
  clicks: number;
  conversions: number;
};

export type TopPageRow = {
  path: string;
  label: string;
  views: number;
  engagementRate: number;
};

export type BlogContentRow = {
  slug: string;
  title: string;
  views: number;
  ctaClicks: number;
};

export type BreakdownRow = {
  key: string;
  label: string;
  visitors: number;
  sharePct: number;
};

export type WebsiteAnalyticsSnapshot = {
  period: AnalyticsPeriod;
  kpis: AnalyticsKpis;
  locales: LocaleTraffic[];
  countries: BreakdownRow[];
  devices: BreakdownRow[];
  browsers: BreakdownRow[];
  leadSources: LeadSourceRow[];
  services: ServiceDemandRow[];
  ctas: CtaPerformanceRow[];
  topPages: TopPageRow[];
  blogs: BlogContentRow[];
};
