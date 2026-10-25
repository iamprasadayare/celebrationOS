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
  Sparkles,
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

  const recipient = selectedVendor?.name || emailDraft?.recipientRole || 'Head of Catering Operations';
  const subject = emailDraft?.subject || `Inquiry & Terms Review: ${eventTitle} - Production Milestone`;
  const bodyText = emailDraft?.body || `Dear ${recipient},\n\nWe are preparing the final run-of-show and schedule for ${eventTitle}. In accordance with our production milestone checklist, we would appreciate confirmation on the following items:\n\n1. Final headcount adjustment deadline.\n2. Rain/weather backup protocols.\n3. Early payment balance schedule.\n\nPlease share your updated itemized schedule at your earliest convenience.\n\nWarm regards,\nCelebrationOS Host Team`;
  const keyPoints = emailDraft?.keyPoints || [
    'Guaranteed headcount cutoff timeline',
    'Acoustical & curfew compliance schedule',
    'Advance payment incentive negotiation',
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(`To: ${recipient}\nSubject: ${subject}\n\n${bodyText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#131b2e]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-[#c7c4d7] shadow-xl w-full max-w-xl p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#131b2e] font-headline">
                AI Vendor Inquiry & Negotiation Drafter
              </h2>
              <p className="text-xs text-[#464554]">
                Optimized communications tailored for terms review, headcounts, and discounts.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-[#464554] hover:text-[#131b2e] p-1 rounded hover:bg-[#f2f3ff]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between bg-[#f2f3ff] p-2.5 rounded-lg border border-[#dae2fd] text-xs">
            <span className="font-semibold text-[#131b2e]">Target Partner: <strong>{recipient}</strong></span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#006c4e]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PII Masked</span>
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">Subject</label>
            <input
              type="text"
              readOnly
              value={subject}
              className="w-full h-9 px-3 text-xs rounded-lg border border-[#c7c4d7] bg-[#f2f3ff] font-medium text-[#131b2e]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">Key Negotiation Levers</label>
            <div className="flex flex-wrap gap-1.5">
              {keyPoints.map((pt, i) => (
                <span key={i} className="px-2.5 py-1 rounded-full bg-[#eaedff] text-[#2a14b4] text-[11px] font-semibold">
                  • {pt}
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131b2e] mb-1">Drafted Body</label>
            <textarea
              readOnly
              rows={7}
              value={bodyText}
              className="w-full p-3 text-xs rounded-lg border border-[#c7c4d7] bg-white font-mono-data text-[#131b2e] leading-relaxed resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#eaedff]">
          <span className="text-[11px] text-[#464554] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#4338ca]" />
            <span>Generated with Gemini 2.5 Flash</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg border border-[#c7c4d7] text-xs font-medium text-[#464554] hover:bg-[#f2f3ff]"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#4338ca] hover:bg-[#372abf] text-white text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca]"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#97f5cc]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Draft'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
