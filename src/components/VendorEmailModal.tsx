/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { VendorChecklistCard, AICoPilotResponse } from '../types/event';
import {
  Mail,
  Copy,
  Check,
  X,
  Send,
  ShieldCheck,
} from 'lucide-react';

interface VendorEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVendor?: VendorChecklistCard;
  emailDraft?: AICoPilotResponse['emailDraft'];
  eventTitle: string;
}

export const VendorEmailModal: React.FC<VendorEmailModalProps> = ({
  isOpen,
  onClose,
  selectedVendor,
  emailDraft,
  eventTitle,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const recipient = selectedVendor?.name || emailDraft?.recipientRole || 'Head of Catering & Banquets';
  const subject = emailDraft?.subject || `Inquiry & Terms Review: ${eventTitle} - Production Milestone`;
  const bodyText = emailDraft?.body || `Dear ${recipient},\n\nWe are preparing the final run-of-show and schedule for ${eventTitle}. In accordance with our production milestone checklist, we would appreciate confirmation on the following items:\n\n1. Final headcount adjustment deadline.\n2. Rain/weather backup protocols for mandap/lawn.\n3. Early payment balance schedule.\n\nPlease share your updated itemized schedule at your earliest convenience.\n\nWarm regards,\nCelebrationOS Host Team`;
  const keyPoints = emailDraft?.keyPoints || [
    'Guaranteed headcount cutoff timeline',
    'Acoustical & curfew compliance schedule (10:00 PM)',
    'Advance payment incentive negotiation',
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${recipient}\nSubject: ${subject}\n\n${bodyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1e1b4b]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#eedfd6] shadow-2xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#f3eae4]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6d28d9] to-[#ff5e14] text-white flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1f2421] font-headline">
                AI Vendor Inquiry & Negotiation Drafter
              </h2>
              <p className="text-xs text-[#6e726e]">
                Optimized communications tailored for Indian vendor negotiations, headcounts, and discounts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#6e726e] hover:text-[#1f2421] p-1.5 rounded-lg hover:bg-[#fbf9f5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between bg-[#fbf9f5] p-3 rounded-xl border border-[#eedfd6] text-xs">
            <span className="font-semibold text-[#1f2421]">Target Partner: <strong>{recipient}</strong></span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00875a]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PII Masked</span>
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2421] mb-1">Subject</label>
            <input
              type="text"
              readOnly
              value={subject}
              className="w-full h-9 px-3 text-xs rounded-xl border border-[#eedfd6] bg-[#fbf9f5] font-medium text-[#1f2421]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2421] mb-1">Key Negotiation Levers</label>
            <div className="flex flex-wrap gap-1.5">
              {keyPoints.map((point, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-md bg-[#fff7ed] border border-[#ffedd5] text-[#c2410c] text-[11px] font-medium"
                >
                  ✓ {point}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1f2421] mb-1">Message Body</label>
            <textarea
              readOnly
              rows={7}
              value={bodyText}
              className="w-full p-3 text-xs rounded-xl border border-[#eedfd6] bg-white text-[#1f2421] font-sans leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#f3eae4]">
          <span className="text-[11px] text-[#6e726e]">
            Phone & emails automatically redacted before AI generation
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-[#eedfd6] text-xs font-semibold text-[#6e726e] hover:bg-[#fbf9f5] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-gradient-to-r from-[#6d28d9] to-[#7c3aed] hover:from-[#5b21b6] hover:to-[#6d28d9] text-white text-xs font-semibold transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-[#6d28d9]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#86efac]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
