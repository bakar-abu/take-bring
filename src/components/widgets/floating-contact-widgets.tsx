"use client";

import { ChatbotWidget } from "@/components/widgets/chatbot-widget";
import { ExitIntentModal } from "@/components/widgets/exit-intent-modal";
import { PhoneCallWidget } from "@/components/widgets/phone-call-widget";
import { WhatsAppWidget } from "@/components/widgets/whatsapp-widget";

/** Chatbot + exit-intent modal + Call / WhatsApp (public site only). */
export function FloatingContactWidgets() {
  return (
    <>
      <ChatbotWidget />
      <PhoneCallWidget />
      <WhatsAppWidget />
      <ExitIntentModal />
    </>
  );
}
