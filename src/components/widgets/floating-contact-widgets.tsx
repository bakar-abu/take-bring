"use client";

import { PhoneCallWidget } from "@/components/widgets/phone-call-widget";
import { WhatsAppWidget } from "@/components/widgets/whatsapp-widget";

/** Call / WhatsApp floating contacts (bottom-right). Public site only. */
export function FloatingContactWidgets() {
  return (
    <>
      <PhoneCallWidget />
      <WhatsAppWidget />
    </>
  );
}
