"use client";

import { PhoneCallWidget } from "@/components/widgets/phone-call-widget";
import { WhatsAppWidget } from "@/components/widgets/whatsapp-widget";

/** Fixed bottom-right Call + WhatsApp (TimeZone pattern). Public site only. */
export function FloatingContactWidgets() {
  return (
    <>
      <PhoneCallWidget />
      <WhatsAppWidget />
    </>
  );
}
