"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, MessageCircle, X } from "lucide-react";
import { useTranslations } from "next-intl";

const PROPERTY_ID = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();
const WIDGET_ID = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim();
const SCRIPT_ID = "tawk-to-embed";

const SUGGESTED_QUESTIONS = [
  { id: "book", labelKey: "q1" },
  { id: "track", labelKey: "q2" },
  { id: "international", labelKey: "q3" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

function ignoreTawkError() {
  // Tawk callbacks fail silently if the chat session is not ready yet.
}

function openTawkChat(question?: string, questionId?: string) {
  const api = window.Tawk_API;
  if (!api) return;

  api.showWidget?.();
  api.maximize?.();

  if (question) {
    api.setAttributes?.(
      {
        selectedQuestion: question,
        questionId: questionId ?? "",
      },
      ignoreTawkError,
    );
    api.addEvent?.(
      "suggested_question",
      { question, questionId: questionId ?? "" },
      ignoreTawkError,
    );
  }

  if (questionId) {
    api.addTags?.([questionId], ignoreTawkError);
  }
}

function removeTawkDom() {
  document.getElementById(SCRIPT_ID)?.remove();
  document
    .querySelectorAll(
      'iframe[src*="tawk.to"], iframe[title*="chat widget"], div[id^="tawk"]',
    )
    .forEach((node) => node.remove());
}

/**
 * Tawk.to live chat on the public site (bottom-left, so it does not cover
 * the existing WhatsApp / call widgets). Suggested questions are shown in
 * our launcher; picking one opens the Tawk widget with that topic attached.
 */
export function TawkToChat() {
  const t = useTranslations("tawkChat");
  const [panelOpen, setPanelOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const configured = Boolean(PROPERTY_ID && WIDGET_ID);

  useEffect(() => {
    if (!configured || !PROPERTY_ID || !WIDGET_ID) return;

    let cancelled = false;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    window.Tawk_API.customStyle = {
      zIndex: 40,
      visibility: {
        desktop: { position: "bl", xOffset: 16, yOffset: 16 },
        mobile: { position: "bl", xOffset: 12, yOffset: 16 },
      },
    };

    window.Tawk_API.onLoad = () => {
      if (cancelled) return;
      window.Tawk_API?.hideWidget?.();
    };

    window.Tawk_API.onChatMaximized = () => {
      if (cancelled) return;
      setChatOpen(true);
      setPanelOpen(false);
    };

    window.Tawk_API.onChatMinimized = () => {
      if (cancelled) return;
      setChatOpen(false);
      window.Tawk_API?.hideWidget?.();
    };

    window.Tawk_API.onChatHidden = () => {
      if (cancelled) return;
      setChatOpen(false);
    };

    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = `https://embed.tawk.to/${PROPERTY_ID}/${WIDGET_ID}`;
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      document.body.appendChild(script);
    }

    return () => {
      cancelled = true;
      window.Tawk_API?.shutdown?.();
      removeTawkDom();
      delete window.Tawk_API;
      delete window.Tawk_LoadStart;
    };
  }, [configured]);

  const handleQuestion = useCallback((question: string, questionId: string) => {
    setPanelOpen(false);
    openTawkChat(question, questionId);
  }, []);

  const handleOpenChat = useCallback(() => {
    setPanelOpen(false);
    openTawkChat();
  }, []);

  if (!configured || chatOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start sm:bottom-6 sm:left-6">
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="mb-3 w-[min(calc(100vw-2rem),20.5rem)] overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5"
            role="dialog"
            aria-labelledby="tawk-questions-title"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-3 bg-logo-bg px-4 py-3.5">
              <div>
                <p
                  id="tawk-questions-title"
                  className="text-sm font-extrabold text-white"
                >
                  {t("title")}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/75">
                  {t("greeting")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={t("close")}
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <ul className="flex flex-col gap-1 p-2">
              {SUGGESTED_QUESTIONS.map((item) => {
                const question = t(item.labelKey);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      data-analytics-cta={`tawk-question-${item.id}`}
                      onClick={() => handleQuestion(question, item.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-logo-bg transition-colors hover:bg-primary/10"
                    >
                      <span>{question}</span>
                      <ChevronRight
                        className="h-4 w-4 shrink-0 text-primary"
                        aria-hidden
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="border-t border-black/5 p-2">
              <button
                type="button"
                data-analytics-cta="tawk-open-chat"
                onClick={handleOpenChat}
                className="flex w-full items-center justify-center rounded-xl bg-primary px-3 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
              >
                {t("openChat")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        data-analytics-cta="floating-tawk"
        onClick={() => setPanelOpen((open) => !open)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-logo-bg text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl sm:h-16 sm:w-16"
        aria-label={panelOpen ? t("close") : t("openAria")}
        aria-expanded={panelOpen}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.85, ease: EASE }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {panelOpen ? (
          <X className="h-7 w-7 sm:h-8 sm:w-8" strokeWidth={2.25} aria-hidden />
        ) : (
          <MessageCircle
            className="h-7 w-7 sm:h-8 sm:w-8"
            strokeWidth={2.25}
            aria-hidden
          />
        )}
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-logo-bg"
          animate={{ scale: [1, 1.3, 1], opacity: [0.75, 0, 0.75] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </motion.button>
    </div>
  );
}
