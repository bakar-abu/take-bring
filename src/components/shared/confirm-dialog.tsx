"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2, TriangleAlert, X } from "lucide-react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  pending = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute inset-0 bg-logo-bg/70 backdrop-blur-sm"
            aria-label="Close dialog"
            disabled={pending}
          />
          <motion.div
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-black/5"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="absolute right-3 top-3 rounded-lg p-1.5 text-logo-bg/50 transition-colors hover:bg-black/[0.04] hover:text-logo-bg disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                <TriangleAlert className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h3 className="text-base font-bold text-logo-bg">{title}</h3>
                <p className="mt-1 text-sm text-foreground/60">{description}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={pending}
                className="rounded-lg border border-black/15 px-4 py-2 text-sm font-semibold text-logo-bg transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={pending}
                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Working...
                  </>
                ) : (
                  confirmLabel
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
