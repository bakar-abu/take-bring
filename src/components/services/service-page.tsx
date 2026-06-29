"use client";

import type { ServiceId } from "@/config/services";
import { SERVICES } from "@/config/services";
import { ServiceAdvantages } from "./service-advantages";
import { ServiceCtaBand } from "./service-cta-band";
import { ServiceFaq } from "./service-faq";
import { ServiceFleet } from "./service-fleet";
import { ServiceHero, ServiceStatsRow } from "./service-hero";
import { ServiceIntro } from "./service-intro";
import { ServiceLeadForm } from "./service-lead-form";
import { ServiceManagement } from "./service-management";
import { ServiceSteps } from "./service-steps";
import { ServiceUseCases } from "./service-use-cases";

export function ServicePage({ serviceId }: { serviceId: ServiceId }) {
  const config = SERVICES[serviceId];

  return (
    <>
      <ServiceHero config={config} />
      {config.showStatsRow ? <ServiceStatsRow serviceId={config.id} /> : null}
      <ServiceIntro serviceId={config.id} />
      <ServiceFleet config={config} />
      <ServiceAdvantages config={config} />
      <ServiceManagement config={config} />
      <ServiceSteps config={config} />
      <ServiceUseCases serviceId={config.id} />
      <ServiceFaq serviceId={config.id} />
      <ServiceLeadForm config={config} />
      <ServiceCtaBand serviceId={config.id} />
    </>
  );
}
