"use client";

import React, { useState } from "react";
import { ArrowUpRight, Mail, Phone, User } from "lucide-react";

type InquiryOption = {
  value: string;
  label: string;
};

type ContactLeadFormProps = {
  formKey: string;
  labels: {
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    phone: string;
    phonePlaceholder: string;
    inquiryType: string;
    inquiryTypePlaceholder: string;
    inquiryOptions: InquiryOption[];
    message: string;
    messagePlaceholder: string;
    submitButton: string;
    submitSending: string;
    successMessage: string;
    errorMessage: string;
    helperText?: string;
  };
  style?: {
    formClassName?: string;
    labelClassName?: string;
    inputClassName?: string;
    selectClassName?: string;
    textareaClassName?: string;
    buttonClassName?: string;
    helperTextClassName?: string;
    showIcons?: boolean;
  };
};

export function ContactLeadForm({ formKey, labels, style }: ContactLeadFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [inquiryType, setInquiryType] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const showIcons = Boolean(style?.showIcons);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSubmitted(true);
      setFullName("");
      setEmail("");
      setWhatsapp("");
      setInquiryType("");
      setMessage("");
    } catch {
      setSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <p className="text-sm font-medium text-white">{labels.successMessage}</p>
    );
  }

  return (
    <form
      data-form-key={formKey}
      onSubmit={handleSubmit}
      className={style?.formClassName ?? "space-y-4"}
      noValidate
    >
      <div>
        <label htmlFor={`${formKey}-name`} className={style?.labelClassName}>
          {labels.fullName} *
        </label>
        <div className="relative">
          <input
            id={`${formKey}-name`}
            type="text"
            name="fullName"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={labels.fullNamePlaceholder}
            className={style?.inputClassName}
          />
          {showIcons ? (
            <User
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
              strokeWidth={1.5}
              aria-hidden
            />
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={`${formKey}-email`} className={style?.labelClassName}>
          {labels.email} *
        </label>
        <div className="relative">
          <input
            id={`${formKey}-email`}
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={labels.emailPlaceholder}
            className={style?.inputClassName}
          />
          {showIcons ? (
            <Mail
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
              strokeWidth={1.5}
              aria-hidden
            />
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor={`${formKey}-phone`} className={style?.labelClassName}>
          {labels.phone} *
        </label>
        <div className="relative">
          <input
            id={`${formKey}-phone`}
            type="tel"
            name="whatsapp"
            required
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder={labels.phonePlaceholder}
            className={style?.inputClassName}
          />
          {showIcons ? (
            <Phone
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50"
              strokeWidth={1.5}
              aria-hidden
            />
          ) : null}
        </div>
        {labels.helperText ? (
          <p className={style?.helperTextClassName}>{labels.helperText}</p>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${formKey}-inquiry`} className={style?.labelClassName}>
          {labels.inquiryType} *
        </label>
        <select
          id={`${formKey}-inquiry`}
          name="inquiryType"
          required
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
          className={style?.selectClassName ?? style?.inputClassName}
        >
          <option value="">{labels.inquiryTypePlaceholder}</option>
          {labels.inquiryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${formKey}-message`} className={style?.labelClassName}>
          {labels.message} *
        </label>
        <textarea
          id={`${formKey}-message`}
          name="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={labels.messagePlaceholder}
          className={style?.textareaClassName ?? style?.inputClassName}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={style?.buttonClassName}
      >
        {isSubmitting ? labels.submitSending : labels.submitButton}
        <ArrowUpRight className="h-5 w-5" strokeWidth={2} aria-hidden />
      </button>
    </form>
  );
}
