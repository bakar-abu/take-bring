"use client";

import { ChatbotWidget } from "@/components/widgets/chatbot-widget";
import { PhoneCallWidget } from "@/components/widgets/phone-call-widget";
import { WhatsAppWidget } from "@/components/widgets/whatsapp-widget";

/** Chatbot (above) + Call / WhatsApp (bottom-right). Public site only. */
export function FloatingContactWidgets() {
  return (
    <>
      <ChatbotWidget />
      <PhoneCallWidget />
      <WhatsAppWidget />
    </>
  );
}
