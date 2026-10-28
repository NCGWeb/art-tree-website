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

  const [website, setWebsite] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('sent');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      // Server mail unavailable: fall back to the visitor's own mail app.
      setStatus('idle');
      const finalSubject = subject.trim() || defaultSubject;
      const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`;
      window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(body)}`;
    }
  }

  return (
    <div className="rounded border border-gold-dark/25 bg-gradient-to-br from-[#E9D4AC] to-[#DEBF8C] p-6 shadow-sm sm:p-8">
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
            className="w-full rounded border border-tan/40 bg-cream-deep/70 px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
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
            className="w-full rounded border border-tan/40 bg-cream-deep/70 px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
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
            className="w-full rounded border border-tan/40 bg-cream-deep/70 px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
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
            className="w-full rounded border border-tan/40 bg-cream-deep/70 px-3.5 py-2.5 text-sm text-ink transition-colors duration-300 ease-out hover:border-terracotta/40 focus:border-terracotta focus:outline-none focus:ring-2 focus:ring-terracotta/20"
          />
        </div>
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="absolute -left-[9999px] h-0 w-0 opacity-0"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 border border-ink px-6 py-3 text-xs uppercase tracking-widest text-ink transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-ink hover:text-cream disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : labels.submitLabel} <span aria-hidden="true">→</span>
        </button>
        {status === 'sent' && (
          <p role="status" className="text-sm text-headline-green">
            Thank you, your message has been sent. We will get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}
