"use client";

import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Eye,
  Info,
  MousePointerClick,
  Percent,
  Users,
} from "lucide-react";
import { getMockAnalyticsSnapshot } from "@/lib/dashboard-analytics/mock-analytics";
import type {
  AnalyticsPeriod,
  WebsiteAnalyticsSnapshot,
} from "@/lib/dashboard-analytics/types";
import type { LeadListItem } from "@/lib/leads/types";
import { cn } from "@/lib/utils";

type WebsiteAnalyticsPanelProps = {
  initialSnapshot: WebsiteAnalyticsSnapshot | null;
  storedLeads: LeadListItem[];
  clarityProjectId?: string;
};

function formatNumber(value: number) {
  return value.toLocaleString("en-GB");
}

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;
  const Icon = positive ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-semibold",
        positive ? "text-emerald-700" : "text-red-600",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden />
      {positive ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

function Bar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.max(4, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-logo-bg">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-foreground/55">{description}</p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

type DataSource = "mock" | "live" | "mixed";

function DataSourceBadge({ source }: { source: DataSource }) {
  const label =
    source === "live" ? "Live data" : source === "mixed" ? "Mixed" : "Mock preview";
  const className =
    source === "live"
      ? "bg-emerald-100 text-emerald-800 ring-emerald-600/20"
      : source === "mixed"
        ? "bg-amber-100 text-amber-800 ring-amber-600/20"
        : "bg-black/[0.05] text-foreground/55 ring-black/10";

  return (
    <span
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ring-1",
        className,
      )}
    >
      {label}
    </span>
  );
}

function KpiCard({
  label,
  value,
  icon,
  source,
  footer,
  changePct,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  source: DataSource;
  footer?: string;
  changePct?: number;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <DataSourceBadge source={source} />
          {icon}
        </div>
      </div>
      <p className="mt-2 text-3xl font-bold text-logo-bg">{value}</p>
      {changePct !== undefined ? (
        <div className="mt-2">
          <ChangeBadge value={changePct} />
        </div>
      ) : null}
      {footer ? (
        <p className="mt-2 text-xs text-foreground/50">{footer}</p>
      ) : null}
    </div>
  );
}

function KpiSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="h-3 w-20 rounded bg-black/[0.06]" />
      <div className="mt-4 h-8 w-24 rounded bg-black/[0.06]" />
      <div className="mt-3 h-3 w-16 rounded bg-black/[0.06]" />
    </div>
  );
}

export function WebsiteAnalyticsPanel({
  initialSnapshot,
  storedLeads,
  clarityProjectId,
}: WebsiteAnalyticsPanelProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snapshot, setSnapshot] = useState<WebsiteAnalyticsSnapshot>(
    initialSnapshot ?? getMockAnalyticsSnapshot("30d"),
  );
  const [source, setSource] = useState<"live" | "mock">(
    initialSnapshot ? "live" : "mock",
  );
  const [error, setError] = useState<string | null>(null);

  async function loadSnapshot(nextPeriod: AnalyticsPeriod) {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/dashboard/analytics?period=${nextPeriod}`,
      );
      const data = (await response.json()) as {
        ok?: boolean;
        error?: string;
        snapshot?: WebsiteAnalyticsSnapshot;
        source?: "live" | "mock";
      };
      if (!response.ok || !data.ok || !data.snapshot) {
        throw new Error(data.error || "Could not load analytics.");
      }
      setSnapshot(data.snapshot);
      setSource("live");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load analytics.");
      // Keep last good snapshot; fall back to empty live zeros via mock only if none
      if (!initialSnapshot) {
        setSnapshot(getMockAnalyticsSnapshot(nextPeriod));
        setSource("mock");
      }
    } finally {
      setIsRefreshing(false);
    }
  }

  useEffect(() => {
    void loadSnapshot(period);
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void loadSnapshot(period);
      }
    }, 30000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when period changes
  }, [period]);

  function handlePeriodChange(next: AnalyticsPeriod) {
    if (next === period) return;
    setPeriod(next);
  }

  const hasStoredLeads = storedLeads.length > 0;
  const leadsSource: DataSource = source === "live" || hasStoredLeads ? "live" : "mock";
  const trafficSource: DataSource = source;

  const maxLocaleVisitors = Math.max(
    ...snapshot.locales.map((row) => row.visitors),
    1,
  );
  const maxLeadSource = Math.max(
    ...snapshot.leadSources.map((row) => row.leads),
    1,
  );
  const maxServiceViews = Math.max(
    ...snapshot.services.map((row) => row.views),
    1,
  );
  const maxCtaClicks = Math.max(...snapshot.ctas.map((row) => row.clicks), 1);

  const clarityUrl = clarityProjectId
    ? `https://clarity.microsoft.com/projects/view/${clarityProjectId}/dashboard`
    : "https://clarity.microsoft.com/";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-logo-bg/50">
            Insights
          </p>
          <h2 className="mt-1 text-xl font-extrabold text-logo-bg sm:text-2xl">
            Website Analytics
          </h2>
          <p className="mt-1 text-sm text-foreground/55">
            Live first-party traffic (consent-gated), real leads, and Clarity
            session insights. Auto-refreshes every 30 seconds.
          </p>
          {error ? (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          ) : null}
        </div>

        <div
          className="inline-flex rounded-lg border border-black/15 p-1"
          role="group"
          aria-label="Analytics period"
        >
          {(
            [
              { id: "7d", label: "Last 7 days" },
              { id: "30d", label: "Last 30 days" },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => handlePeriodChange(option.id)}
              disabled={isRefreshing}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-60",
                period === option.id
                  ? "bg-logo-bg text-white"
                  : "text-logo-bg/70 hover:text-logo-bg",
              )}
              aria-pressed={period === option.id}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <p>
          <strong>Live mode:</strong> page views and CTA clicks are stored in
          Supabase after cookie consent. Leads come from the leads inbox.
          Microsoft Clarity ({clarityProjectId || "not configured"}) provides
          session replays.
        </p>
      </div>

      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
          isRefreshing && "opacity-60",
        )}
        aria-busy={isRefreshing}
      >
        {isRefreshing && !snapshot.kpis ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <KpiCard
              label="Visitors"
              value={formatNumber(snapshot.kpis.visitors)}
              source={trafficSource}
              changePct={snapshot.kpis.visitorsChangePct}
              icon={<Users className="h-4 w-4 text-primary-dark" aria-hidden />}
            />
            <KpiCard
              label="Leads"
              value={formatNumber(snapshot.kpis.leads)}
              source={leadsSource}
              changePct={snapshot.kpis.leadsChangePct}
              footer={
                hasStoredLeads
                  ? `${storedLeads.length} total stored submission(s)`
                  : "Submit a test form to see live lead counts"
              }
              icon={
                <MousePointerClick
                  className="h-4 w-4 text-primary-dark"
                  aria-hidden
                />
              }
            />
            <KpiCard
              label="Conversion rate"
              value={`${snapshot.kpis.conversionRate.toFixed(2)}%`}
              source={trafficSource === "live" ? "live" : "mock"}
              footer="Leads ÷ visitors (same period)"
              icon={<Percent className="h-4 w-4 text-primary-dark" aria-hidden />}
            />
            <KpiCard
              label="Consent rate"
              value={`${snapshot.kpis.consentRate}%`}
              source={trafficSource}
              footer="Cookie accept rate → Clarity coverage"
              icon={<Eye className="h-4 w-4 text-primary-dark" aria-hidden />}
            />
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Traffic by locale"
          description="RO (Romanian) is default on `/`. EN is `/en`, DE (German HQ) is `/de`. Compare visit share vs lead share."
        >
          <ul className="space-y-4">
            {snapshot.locales.map((row) => (
              <li key={row.locale}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-logo-bg">{row.label}</span>
                  <span className="text-foreground/60">
                    {formatNumber(row.visitors)} visitors · {row.leads} leads (
                    {row.sharePct}%)
                  </span>
                </div>
                <Bar value={row.visitors} max={maxLocaleVisitors} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Leads by source"
          description="Which form / page produces inquiries — use this to prioritize pages."
          action={<DataSourceBadge source={leadsSource} />}
        >
          {snapshot.leadSources.length === 0 ? (
            <div className="rounded-xl border border-dashed border-black/10 px-4 py-10 text-center text-sm text-foreground/55">
              No lead sources yet. Submit a contact, service, or newsletter form
              on the public site to populate this table.
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="px-1 py-2 font-semibold text-logo-bg/80">
                    Source
                  </th>
                  <th className="w-20 px-1 py-2 font-semibold text-logo-bg/80">
                    Leads
                  </th>
                  <th className="w-28 px-1 py-2 font-semibold text-logo-bg/80">
                    Share
                  </th>
                </tr>
              </thead>
              <tbody>
                {snapshot.leadSources.map((row) => (
                  <tr key={row.formKey} className="border-b border-black/5">
                    <td className="truncate px-1 py-2.5 font-medium text-logo-bg">
                      {row.label}
                    </td>
                    <td className="px-1 py-2.5 text-foreground/80">
                      {row.leads}
                    </td>
                    <td className="px-1 py-2.5">
                      <div className="flex items-center gap-2">
                        <Bar value={row.leads} max={maxLeadSource} />
                        <span className="w-8 shrink-0 text-xs text-foreground/55">
                          {row.sharePct}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </SectionCard>
      </div>

      <SectionCard
        title="Service demand"
        description="Views vs leads for each service line — demand signal for sales & marketing."
      >
        <div className="overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/10">
                <th className="px-1 py-2 font-semibold text-logo-bg/80">
                  Service
                </th>
                <th className="hidden px-1 py-2 font-semibold text-logo-bg/80 sm:table-cell">
                  Path
                </th>
                <th className="w-24 px-1 py-2 font-semibold text-logo-bg/80">
                  Views
                </th>
                <th className="w-20 px-1 py-2 font-semibold text-logo-bg/80">
                  Leads
                </th>
                <th className="w-40 px-1 py-2 font-semibold text-logo-bg/80">
                  Interest
                </th>
              </tr>
            </thead>
            <tbody>
              {snapshot.services.map((row) => (
                <tr key={row.id} className="border-b border-black/5">
                  <td className="px-1 py-2.5 font-semibold text-logo-bg">
                    {row.label}
                  </td>
                  <td className="hidden px-1 py-2.5 text-xs leading-relaxed text-foreground/55 sm:table-cell">
                    {row.path.split(" · ").map((p) => (
                      <div key={p} className="font-mono">
                        {p}
                      </div>
                    ))}
                  </td>
                  <td className="px-1 py-2.5 text-foreground/80">
                    {formatNumber(row.views)}
                  </td>
                  <td className="px-1 py-2.5 text-foreground/80">{row.leads}</td>
                  <td className="px-1 py-2.5">
                    <Bar value={row.views} max={maxServiceViews} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="CTA performance"
          description="How visitors prefer to reach you — forms, call, WhatsApp, calculator."
        >
          <ul className="space-y-4">
            {snapshot.ctas.map((row) => (
              <li key={row.id}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-logo-bg">{row.label}</span>
                  <span className="text-foreground/60">
                    {formatNumber(row.clicks)} clicks
                    {row.conversions > 0
                      ? ` · ${row.conversions} converts`
                      : ""}
                  </span>
                </div>
                <Bar value={row.clicks} max={maxCtaClicks} />
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Top pages"
          description="Where attention lands — pair with engagement to spot weak pages."
        >
          <ul className="divide-y divide-black/5">
            {snapshot.topPages.map((row) => (
              <li
                key={row.path}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-logo-bg">
                    {row.label}
                  </p>
                  <p className="truncate text-xs text-foreground/50">
                    {row.path}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="font-semibold text-logo-bg">
                    {formatNumber(row.views)}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {row.engagementRate}% engaged
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard
          title="Content snapshot"
          description="Blog topics that attract attention and click through to contact."
        >
          <ul className="divide-y divide-black/5">
            {snapshot.blogs.map((row) => (
              <li
                key={row.slug}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold text-logo-bg">
                    {row.title}
                  </p>
                  <p className="truncate text-xs text-foreground/50">
                    /blog/{row.slug}
                  </p>
                </div>
                <div className="shrink-0 text-right text-xs text-foreground/60">
                  <p>{formatNumber(row.views)} views</p>
                  <p>{row.ctaClicks} CTA clicks</p>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          title="Microsoft Clarity"
          description="Session recordings, heatmaps, and rage clicks for UX decisions."
          action={
            <a
              href={clarityUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/15 px-3 py-1.5 text-xs font-bold text-logo-bg transition-colors hover:border-primary/50"
            >
              Open Clarity
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          }
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/45">
            Clarity setup checklist
          </p>
          <ul className="mb-4 space-y-2 text-sm">
            <ClarityChecklistItem
              done={Boolean(clarityProjectId)}
              label="NEXT_PUBLIC_CLARITY_PROJECT_ID configured"
            />
            <ClarityChecklistItem
              done
              label="Cookie consent gates Clarity script on public site"
            />
            <ClarityChecklistItem
              done={Boolean(clarityProjectId)}
              label="Deep link opens your Clarity project dashboard"
            />
          </ul>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li className="rounded-lg border border-black/10 px-3 py-2">
              Watch recordings of the <strong>price calculator</strong> and
              contact forms for drop-offs after captcha.
            </li>
            <li className="rounded-lg border border-black/10 px-3 py-2">
              Check heatmaps on the <strong>homepage hero</strong> and service
              CTAs (Book Express vs Call / WhatsApp).
            </li>
            <li className="rounded-lg border border-black/10 px-3 py-2">
              Review rage clicks on <strong>/tracking</strong> (page is still a
              stub) and mobile form fields.
            </li>
          </ul>
          <p className="mt-4 text-xs text-foreground/45">
            Clarity loads only after cookie consent. Consent rate above shows
            approximate coverage of sessions you can analyze.
            {clarityProjectId
              ? ` Project ID: ${clarityProjectId}`
              : " Set NEXT_PUBLIC_CLARITY_PROJECT_ID to deep-link your project."}
          </p>
        </SectionCard>
      </div>

      <p className="text-xs text-foreground/40">
        First-party events power KPIs after cookie consent. Clarity project{" "}
        {clarityProjectId || "xnbmal94h3"} is used for session replays. Data
        refreshes automatically every 30 seconds while this page is open.
      </p>
    </div>
  );
}

function ClarityChecklistItem({
  done,
  label,
}: {
  done: boolean;
  label: string;
}) {
  return (
    <li className="flex items-center gap-2 text-logo-bg/80">
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold",
          done
            ? "bg-emerald-100 text-emerald-800"
            : "bg-black/[0.06] text-foreground/40",
        )}
        aria-hidden
      >
        {done ? "✓" : "·"}
      </span>
      {label}
    </li>
  );
}
