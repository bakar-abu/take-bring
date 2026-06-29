"use client";

import { AboutAwards } from "./about-awards";
import { AboutCapabilities } from "./about-capabilities";
import { AboutCtaBand, AboutLeadForm } from "./about-lead-form";
import { AboutFaq } from "./about-faq";
import { AboutHero } from "./about-hero";
import { AboutJourney } from "./about-journey";
import { AboutMetrics } from "./about-metrics";
import { AboutMission } from "./about-mission";
import { AboutStats } from "./about-stats";
import { AboutStory } from "./about-story";
import { AboutTeam } from "./about-team";
import { AboutValues } from "./about-values";
import { AboutWhy } from "./about-why";

export function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStats />
      <AboutStory />
      <AboutMission />
      <AboutValues />
      <AboutJourney />
      <AboutCapabilities />
      <AboutMetrics />
      <AboutTeam />
      <AboutAwards />
      <AboutWhy />
      <AboutFaq />
      <AboutLeadForm />
      <AboutCtaBand />
    </>
  );
}
