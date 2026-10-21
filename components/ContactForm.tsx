'use client';

import { useState, type FormEvent } from 'react';

export default function ContactForm({
  recipientEmail,
  defaultSubject,
  labels,
}: {
  recipientEmail: string;
  defaultSubject: string;
  labels: {
    heading: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    submitLabel: string;
  };
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const finalSubject = subject.trim() || defaultSubject;
    const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
    const mailto = `mailto:${recipientEmail}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  return (
    // Warm terracotta-tinted card (not white/near-white) — reads clearly as
    // its own card against the page's paler cream background.
    <div className="rounded border border-terracotta/15 bg-card-warm p-6 shadow-sm sm:p-8">
      <h2 className="mb-5 font-head text-2xl text-headline-green">{labels.heading}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cf-name" className="mb-1 block text-sm font-medium text-ink">
            {labels.nameLabel} *
          </label>
          <input
            id="cf-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded border border-black/15 bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-black/30 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1 block text-sm font-medium text-ink">
            {labels.emailLabel} *
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded border border-black/15 bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-black/30 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <div>
          <label htmlFor="cf-subject" className="mb-1 block text-sm font-medium text-ink">
            {labels.subjectLabel}
          </label>
          <input
            id="cf-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded border border-black/15 bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-black/30 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <div>
          <label htmlFor="cf-msg" className="mb-1 block text-sm font-medium text-ink">
            {labels.messageLabel}
          </label>
          <textarea
            id="cf-msg"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded border border-black/15 bg-[#FBF7F0] px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-black/30 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-xs uppercase tracking-widest text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-ink hover:text-cream"
        >
          {labels.submitLabel} <span aria-hidden="true">→</span>
        </button>
      </form>
    </div>
  );
}
