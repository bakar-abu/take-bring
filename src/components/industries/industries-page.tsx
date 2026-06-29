"use client";

import { IndustriesAwards } from "./industries-awards";
import { IndustriesCtaBand, IndustriesLeadForm } from "./industries-lead-form";
import { IndustriesExpertise } from "./industries-expertise";
import { IndustriesFaq } from "./industries-faq";
import { IndustriesGrid } from "./industries-grid";
import { IndustriesHero } from "./industries-hero";
import { IndustriesIntro } from "./industries-intro";
import { IndustriesMetrics } from "./industries-metrics";
import { IndustriesProcess } from "./industries-process";
import { IndustriesSolutions } from "./industries-solutions";
import { IndustriesStats } from "./industries-stats";
import { IndustriesTrust } from "./industries-trust";

export function IndustriesPage() {
  return (
    <>
      <IndustriesHero />
      <IndustriesStats />
      <IndustriesIntro />
      <IndustriesGrid />
      <IndustriesExpertise />
      <IndustriesSolutions />
      <IndustriesMetrics />
      <IndustriesProcess />
      <IndustriesAwards />
      <IndustriesTrust />
      <IndustriesFaq />
      <IndustriesLeadForm />
      <IndustriesCtaBand />
    </>
  );
}
