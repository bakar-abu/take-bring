"use client";

import { PhoneCallWidget } from "@/components/widgets/phone-call-widget";
import { TawkToChat } from "@/components/widgets/tawk-to-chat";
import { WhatsAppWidget } from "@/components/widgets/whatsapp-widget";

/** Tawk.to (bottom-left) + Call / WhatsApp (bottom-right). Public site only. */
export function FloatingContactWidgets() {
  return (
    <>
      <TawkToChat />
      <PhoneCallWidget />
      <WhatsAppWidget />
    </>
  );
}
