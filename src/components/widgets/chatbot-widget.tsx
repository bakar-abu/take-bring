"use client";

import {
  Bot,
  LoaderCircle,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  BUSINESS_PHONE,
  BUSINESS_WHATSAPP,
  normalizeChatbotLocale,
  type ChatbotLocale,
} from "@/config/chatbot-knowledge";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type Copy = {
  assistant: string;
  welcome: string;
  placeholder: string;
  send: string;
  close: string;
  typing: string;
  quote: string;
  services: string;
  human: string;
  whatsapp: string;
  call: string;
  leadTitle: string;
  leadIntro: string;
  fullName: string;
  email: string;
  phone: string;
  pickup: string;
  delivery: string;
  request: string;
  submit: string;
  submitting: string;
  success: string;
  leadError: string;
  chatError: string;
  privacy: string;
  aiNotice: string;
  proactive: string;
  proactiveAria: string;
  chipServices: string;
  chipQuote: string;
  chipHuman: string;
};

const copy: Record<ChatbotLocale, Copy> = {
  ro: {
    assistant: "Asistent Take & Bring",
    welcome:
      "Bună! Cum vă pot ajuta cu transportul? Pot răspunde la întrebări sau pot prelua o cerere de ofertă.",
    placeholder: "Scrieți întrebarea …",
    send: "Trimite",
    close: "Închide chatul",
    typing: "Se pregătește răspunsul …",
    quote: "Cerere ofertă",
    services: "Serviciile noastre",
    human: "Vorbesc cu o persoană",
    whatsapp: "WhatsApp",
    call: "Sună",
    leadTitle: "Cerere de ofertă",
    leadIntro:
      "Lăsați datele dvs. Cererea apare direct la echipa noastră.",
    fullName: "Nume complet *",
    email: "Email *",
    phone: "Telefon / WhatsApp *",
    pickup: "Loc ridicare",
    delivery: "Loc livrare",
    request: "Ce trebuie transportat?",
    submit: "Trimite cererea",
    submitting: "Se trimite …",
    success:
      "Mulțumim! Cererea a fost salvată. Echipa noastră vă contactează cât mai curând.",
    leadError:
      "Cererea nu a putut fi salvată. Folosiți WhatsApp sau sunați-ne.",
    chatError:
      "Nu pot încărca un răspuns AI acum. Puteți totuși trimite o cerere sau contacta echipa.",
    privacy:
      "Datele de contact sunt stocate doar pentru procesarea cererii.",
    aiNotice: "Asistent AI – confirmați detaliile importante cu echipa.",
    proactive: "Bună, cum vă pot ajuta?",
    proactiveAria: "Deschide chatul – asistentul vrea să ajute",
    chipServices: "Ce servicii oferiți?",
    chipQuote: "Aș dori o ofertă individuală.",
    chipHuman: "Vreau să vorbesc cu o persoană.",
  },
  de: {
    assistant: "Take & Bring Assistent",
    welcome:
      "Hallo! Wie kann ich Ihnen bei Ihrem Transport helfen? Ich beantworte Fragen oder nehme Ihre Angebotsanfrage auf.",
    placeholder: "Ihre Frage eingeben …",
    send: "Senden",
    close: "Chat schließen",
    typing: "Antwort wird erstellt …",
    quote: "Angebot anfragen",
    services: "Unsere Leistungen",
    human: "Mit einem Menschen sprechen",
    whatsapp: "WhatsApp",
    call: "Anrufen",
    leadTitle: "Angebotsanfrage",
    leadIntro:
      "Hinterlassen Sie Ihre Daten. Ihre Anfrage erscheint direkt bei unserem Team.",
    fullName: "Vollständiger Name *",
    email: "E-Mail *",
    phone: "Telefon / WhatsApp *",
    pickup: "Abholort",
    delivery: "Zielort",
    request: "Was soll transportiert werden?",
    submit: "Anfrage senden",
    submitting: "Wird gesendet …",
    success:
      "Vielen Dank! Ihre Anfrage wurde gespeichert. Unser Team meldet sich so schnell wie möglich.",
    leadError:
      "Ihre Anfrage konnte nicht gespeichert werden. Bitte nutzen Sie WhatsApp oder rufen Sie uns an.",
    chatError:
      "Ich kann gerade keine AI-Antwort laden. Sie können trotzdem eine Anfrage senden oder unser Team direkt kontaktieren.",
    privacy:
      "Ihre Kontaktdaten werden nur zur Bearbeitung Ihrer Anfrage gespeichert.",
    aiNotice: "AI-Assistent – wichtige Angaben bitte bestätigen lassen.",
    proactive: "Hallo, wie kann ich Ihnen helfen?",
    proactiveAria: "Chat öffnen – Assistent möchte helfen",
    chipServices: "Welche Leistungen bieten Sie an?",
    chipQuote: "Ich möchte ein individuelles Angebot anfragen.",
    chipHuman: "Ich möchte mit einem Mitarbeiter sprechen.",
  },
  en: {
    assistant: "Take & Bring Assistant",
    welcome:
      "Hello! How can I help with your transport? I can answer questions or capture your quote request.",
    placeholder: "Type your question …",
    send: "Send",
    close: "Close chat",
    typing: "Preparing an answer …",
    quote: "Request a quote",
    services: "Our services",
    human: "Talk to a person",
    whatsapp: "WhatsApp",
    call: "Call",
    leadTitle: "Quote request",
    leadIntro:
      "Leave your details and your request will appear directly for our team.",
    fullName: "Full name *",
    email: "Email *",
    phone: "Phone / WhatsApp *",
    pickup: "Pickup location",
    delivery: "Delivery location",
    request: "What needs to be transported?",
    submit: "Send request",
    submitting: "Sending …",
    success:
      "Thank you! Your request has been saved. Our team will contact you as soon as possible.",
    leadError:
      "We could not save your request. Please use WhatsApp or call us.",
    chatError:
      "I cannot load an AI answer right now. You can still send a request or contact our team directly.",
    privacy:
      "Your contact details are stored only to process your request.",
    aiNotice: "AI assistant – please confirm important details with our team.",
    proactive: "Hi, how can I help you?",
    proactiveAria: "Open chat – assistant wants to help",
    chipServices: "Which services do you offer?",
    chipQuote: "I would like to request an individual quote.",
    chipHuman: "I want to speak with a person.",
  },
};

const PROACTIVE_DELAY_MS = 20_000;
const PROACTIVE_SESSION_KEY = "tb-chatbot-proactive-shown";

/** Short soft chime via Web Audio — no media file required. */
function playProactiveChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playTone = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.02);
    };

    playTone(880, now, 0.14);
    playTone(1174.66, now + 0.12, 0.18);
    window.setTimeout(() => {
      void ctx.close();
    }, 500);
  } catch {
    // Autoplay / AudioContext restrictions — fail silently
  }
}

function createMessage(role: Message["role"], content: string): Message {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
  };
}

export function ChatbotWidget() {
  const currentLocale = useLocale();
  const locale = normalizeChatbotLocale(currentLocale);
  const t = copy[locale];
  const [isOpen, setIsOpen] = useState(false);
  const [showProactive, setShowProactive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    createMessage("assistant", t.welcome),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const proactiveFiredRef = useRef(false);
  const isOpenRef = useRef(false);
  const sessionIdRef = useRef(
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen) setShowProactive(false);
  }, [isOpen]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, showLeadForm]);

  useEffect(() => {
    setMessages((current) =>
      current.length === 1 && current[0].role === "assistant"
        ? [createMessage("assistant", t.welcome)]
        : current,
    );
  }, [t.welcome]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.sessionStorage.getItem(PROACTIVE_SESSION_KEY) === "1") {
        proactiveFiredRef.current = true;
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    const timer = window.setTimeout(() => {
      if (proactiveFiredRef.current) return;
      try {
        window.sessionStorage.setItem(PROACTIVE_SESSION_KEY, "1");
      } catch {
        // ignore
      }
      proactiveFiredRef.current = true;
      if (isOpenRef.current) return;
      setShowProactive(true);
      playProactiveChime();
    }, PROACTIVE_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  function openChatFromProactive() {
    setShowProactive(false);
    setIsOpen(true);
  }

  const whatsappUrl = useMemo(() => {
    const latestUserMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user")?.content;
    const text =
      locale === "ro"
        ? `Bună Take & Bring, am nevoie de ajutor cu cererea mea${latestUserMessage ? `: ${latestUserMessage}` : "."}`
        : locale === "de"
          ? `Hallo Take & Bring, ich benötige Hilfe mit meiner Anfrage${latestUserMessage ? `: ${latestUserMessage}` : "."}`
          : `Hello Take & Bring, I need help with my request${latestUserMessage ? `: ${latestUserMessage}` : "."}`;
    return `https://wa.me/${BUSINESS_WHATSAPP}?text=${encodeURIComponent(text)}`;
  }, [locale, messages]);

  async function sendMessage(text: string) {
    const content = text.trim();
    if (!content || isLoading) return;

    const nextMessages = [...messages, createMessage("user", content)];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: nextMessages.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });
      const data = (await response.json()) as {
        answer?: string;
        error?: string;
        suggestLead?: boolean;
      };

      if (!response.ok || !data.answer) throw new Error(data.error);
      setMessages((current) => [
        ...current,
        createMessage("assistant", data.answer as string),
      ]);
      if (data.suggestLead) setShowLeadForm(true);
    } catch {
      setMessages((current) => [
        ...current,
        createMessage("assistant", t.chatError),
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function trackInteraction(interactionType: "whatsapp_click" | "phone_click") {
    const latestMessage = [...messages]
      .reverse()
      .find((message) => message.role === "user")?.content;
    void fetch("/api/chatbot/interaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        interactionType,
        sessionId: sessionIdRef.current,
        locale,
        pagePath: window.location.pathname,
        latestMessage,
      }),
    }).catch(() => {
      // Tracking must never block the visitor's call or WhatsApp action.
    });
  }

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingLead(true);
    setLeadError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/chatbot/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.get("fullName"),
          email: form.get("email"),
          phone: form.get("phone"),
          pickup: form.get("pickup"),
          delivery: form.get("delivery"),
          message: form.get("message"),
          companyWebsite: form.get("companyWebsite"),
          locale,
          sessionId: sessionIdRef.current,
          pagePath: window.location.pathname,
          transcript: messages.map(({ role, content }) => ({ role, content })),
        }),
      });
      if (!response.ok) throw new Error();

      setLeadSubmitted(true);
      setMessages((current) => [
        ...current,
        createMessage("assistant", t.success),
      ]);
    } catch {
      setLeadError(t.leadError);
    } finally {
      setIsSubmittingLead(false);
    }
  }

  return (
    <>
      {isOpen ? (
        <section
          aria-label={t.assistant}
          className="fixed inset-x-3 bottom-3 z-[80] flex max-h-[min(720px,calc(100dvh-24px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:right-6 sm:h-[min(680px,calc(100dvh-48px))] sm:w-[390px]"
        >
          <header className="flex items-center justify-between bg-logo-bg px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-logo-bg">
                <Bot size={22} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold">{t.assistant}</h2>
                <p className="text-[11px] text-white/75">{t.aiNotice}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/10"
              aria-label={t.close}
            >
              <X size={20} />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" ? (
                  <span className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-logo-bg text-white">
                    <Bot size={15} />
                  </span>
                ) : null}
                <p
                  className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-sm bg-logo-bg text-white"
                      : "rounded-bl-sm border border-slate-200 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {isLoading ? (
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <LoaderCircle size={15} className="animate-spin" />
                {t.typing}
              </div>
            ) : null}

            {!isLoading && messages.length === 1 ? (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void sendMessage(t.chipServices)}
                  className="rounded-full border border-primary bg-white px-3 py-1.5 text-xs font-semibold text-logo-bg hover:bg-primary/10"
                >
                  {t.services}
                </button>
                <button
                  type="button"
                  onClick={() => void sendMessage(t.chipQuote)}
                  className="rounded-full border border-primary bg-white px-3 py-1.5 text-xs font-semibold text-logo-bg hover:bg-primary/10"
                >
                  {t.quote}
                </button>
                <button
                  type="button"
                  onClick={() => void sendMessage(t.chipHuman)}
                  className="rounded-full border border-primary bg-white px-3 py-1.5 text-xs font-semibold text-logo-bg hover:bg-primary/10"
                >
                  {t.human}
                </button>
              </div>
            ) : null}

            {showLeadForm && !leadSubmitted ? (
              <form
                onSubmit={handleLeadSubmit}
                className="space-y-2.5 rounded-xl border border-primary/40 bg-white p-3 shadow-sm"
              >
                <div>
                  <h3 className="text-sm font-bold text-logo-bg">{t.leadTitle}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {t.leadIntro}
                  </p>
                </div>
                <input
                  name="companyWebsite"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                {(
                  [
                    ["fullName", t.fullName, "text", "name"],
                    ["email", t.email, "email", "email"],
                    ["phone", t.phone, "tel", "tel"],
                    ["pickup", t.pickup, "text", "address-line1"],
                    ["delivery", t.delivery, "text", "address-line1"],
                  ] as const
                ).map(([name, placeholder, type, autoComplete]) => (
                  <input
                    key={name}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    placeholder={placeholder}
                    required={["fullName", "email", "phone"].includes(name)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                ))}
                <textarea
                  name="message"
                  rows={2}
                  placeholder={t.request}
                  className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="text-[10px] leading-relaxed text-slate-500">
                  {t.privacy}
                </p>
                {leadError ? (
                  <p className="text-xs font-medium text-red-600">{leadError}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={isSubmittingLead}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-logo-bg px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-logo-bg/90 disabled:opacity-60"
                >
                  {isSubmittingLead ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  {isSubmittingLead ? t.submitting : t.submit}
                </button>
              </form>
            ) : null}

            <div className="flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackInteraction("whatsapp_click")}
                data-analytics-cta="chatbot-whatsapp"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2.5 text-xs font-bold text-white"
              >
                <MessageCircle size={16} />
                {t.whatsapp}
              </a>
              <a
                href={`tel:${BUSINESS_PHONE}`}
                onClick={() => trackInteraction("phone_click")}
                data-analytics-cta="chatbot-call"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-xs font-bold text-logo-bg"
              >
                <Phone size={16} />
                {t.call}
              </a>
            </div>
            <div ref={messageEndRef} />
          </div>

          <form
            onSubmit={handleChatSubmit}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1_000}
              placeholder={t.placeholder}
              className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-primary"
              aria-label={t.placeholder}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-logo-bg text-white disabled:opacity-40"
              aria-label={t.send}
            >
              <Send size={18} />
            </button>
          </form>
        </section>
      ) : (
        <>
          {showProactive ? (
            <button
              type="button"
              onClick={openChatFromProactive}
              className="fixed bottom-[14.5rem] right-4 z-[61] flex max-w-[min(280px,calc(100vw-5.5rem))] items-end gap-2 sm:bottom-[15.5rem] sm:right-6"
              aria-label={t.proactiveAria}
            >
              <span className="rounded-2xl rounded-br-sm border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-medium leading-snug text-logo-bg shadow-lg">
                {t.proactive}
              </span>
              <span className="mb-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-logo-bg text-white shadow-md">
                <Bot size={16} aria-hidden="true" />
              </span>
            </button>
          ) : null}
          <button
            type="button"
            data-analytics-cta="floating-chatbot"
            onClick={() => {
              setShowProactive(false);
              setIsOpen(true);
            }}
            className="fixed bottom-44 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-logo-bg text-white shadow-lg transition hover:scale-110 hover:bg-logo-bg/90 sm:bottom-48 sm:right-6 sm:h-16 sm:w-16"
            aria-label={t.assistant}
          >
            <MessageCircle size={28} />
            <span
              className={`absolute right-0 top-0 h-4 w-4 rounded-full border-2 border-white ${
                showProactive ? "animate-pulse bg-primary" : "bg-primary"
              }`}
            />
          </button>
        </>
      )}
    </>
  );
}
