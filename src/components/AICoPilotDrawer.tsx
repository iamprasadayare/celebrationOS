/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AICoPilotResponse, CopilotOptimizationItem } from '../types/event';
import {
  Bot,
  Sparkles,
  ShieldCheck,
  ArrowUp,
  X,
  Zap,
  Check,
  Clock,
  Send,
} from 'lucide-react';

interface AICoPilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  copilotResponse: AICoPilotResponse | null;
  isLoading: boolean;
  onSubmitPrompt: (promptText: string, actionType?: AICoPilotResponse['type']) => void;
  onApplySingleProposal: (proposal: CopilotOptimizationItem) => void;
  onApplyAllProposals: (proposals: CopilotOptimizationItem[]) => void;
  latencyMs?: number;
  servedFromCache?: boolean;
}

export const AICoPilotDrawer: React.FC<AICoPilotDrawerProps> = ({
  isOpen,
  onClose,
  copilotResponse,
  isLoading,
  onSubmitPrompt,
  onApplySingleProposal,
  onApplyAllProposals,
  latencyMs = 42,
  servedFromCache = true,
}) => {
  const [userInput, setUserInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    onSubmitPrompt(userInput.trim());
    setUserInput('');
  };

  const handleChipClick = (suggestion: string) => {
    let actionType: AICoPilotResponse['type'] = 'optimization';
    if (suggestion.includes('Run Sheet')) actionType = 'run_sheet';
    else if (suggestion.includes('Email')) actionType = 'vendor_email';
    else if (suggestion.includes('Venue')) actionType = 'ideas';

    onSubmitPrompt(suggestion, actionType);
  };

  const proposals = copilotResponse?.proposals || [];
  const totalSavings = proposals.reduce((acc, p) => acc + p.amount, 0);

  return (
    <>
      {/* Backdrop for mobile / tablet */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 xl:hidden animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <aside
        aria-label="CelebrationOS AI Co-Pilot Assistant"
        className="fixed right-0 top-16 bottom-0 w-full sm:w-[420px] md:w-[440px] bg-[#ffffff] dark:bg-[#151024] p-4 border-l border-[#e5ddcf] dark:border-[#2d2442] shadow-[0_4px_30px_rgba(0,0,0,0.25)] space-y-4 z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#f0eae1] dark:border-[#2d2442]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ff5e14] to-[#7c3aed] text-white flex items-center justify-center shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#18122b] dark:text-[#f5f3ff] leading-none font-headline">
                  AI Co-Pilot
                </h2>
                <span className="font-mono-data text-[11px] text-[#544c60] dark:text-[#a8a1b7]">
                  Autonomous Orchestrator
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d1fae5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] border border-[#a7f3d0] dark:border-[#047857] text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 text-[#059669] dark:text-[#10b981]" />
                <span>PII Masked</span>
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close AI Co-Pilot drawer"
                className="text-[#544c60] dark:text-[#a8a1b7] hover:text-[#18122b] dark:hover:text-white p-1 rounded-lg hover:bg-[#fff1eb] dark:hover:bg-[#281f3d]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Latency & Cache Status */}
          <div className="flex items-center justify-between text-[11px] text-[#544c60] dark:text-[#a8a1b7] px-1 py-2 font-mono-data">
            <span className="flex items-center gap-1 text-[#00875a] dark:text-[#10b981] font-bold">
              <Zap className="w-3.5 h-3.5 text-[#ff5e14]" />
              <span>{latencyMs}ms latency</span>
            </span>
            {servedFromCache && (
              <span className="px-2 py-0.5 rounded-full bg-[#ede9fe] dark:bg-[#2e1065] text-[#581c87] dark:text-[#d8b4fe] border border-[#ddd6fe] dark:border-[#581c87] font-bold text-[10px]">
                ⚡ Served from Cache
              </span>
            )}
          </div>

      {/* Active Conversation Thread */}
      <div className="space-y-3">
        {/* User Prompt Message Bubble */}
        <div className="flex flex-col items-end">
          <div className="bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white p-3 rounded-2xl rounded-tr-xs max-w-[92%] shadow-xs">
            <p className="text-xs leading-relaxed font-medium">
              Cut ₹2,00,000 from the wedding budget without reducing guest count or food quality.
            </p>
          </div>
          <span className="font-mono-data text-[10px] text-[#544c60] mt-1 mr-1">
            Today at 10:42 AM
          </span>
        </div>

        {/* AI Response Message Card */}
        {isLoading ? (
          <div className="bg-[#f8f4ed] p-4 rounded-2xl rounded-tl-xs space-y-2 border border-[#e5ddcf] animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff5e14] animate-spin" />
              <span className="text-xs font-bold text-[#18122b]">Analyzing Local Vendor Rates...</span>
            </div>
            <div className="h-3 bg-[#e5ddcf] rounded w-3/4" />
            <div className="h-3 bg-[#e5ddcf] rounded w-1/2" />
          </div>
        ) : copilotResponse ? (
          <div className="bg-gradient-to-br from-[#f8f4ed] to-[#fff1eb]/60 p-3.5 rounded-2xl rounded-tl-xs space-y-3 border border-[#fed7aa]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ff5e14]" />
              <span className="text-xs font-bold text-[#18122b] font-headline">
                {copilotResponse.headline}
              </span>
            </div>

            <p className="text-xs text-[#544c60] leading-relaxed">
              {copilotResponse.summary}
            </p>

            {/* Proposals */}
            {proposals.length > 0 && (
              <div className="space-y-2">
                {proposals.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-[#ffffff] p-3 rounded-xl space-y-1.5 shadow-xs border border-[#e5ddcf]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#18122b]">
                        {prop.title}
                      </span>
                      <span className="font-mono-data text-xs font-bold text-[#00875a]">
                        -₹{prop.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#544c60] leading-tight">
                      {prop.description}
                    </p>
                    <button
                      type="button"
                      disabled={prop.applied}
                      onClick={() => onApplySingleProposal(prop)}
                      className={`w-full py-1 text-center text-[11px] rounded-lg font-bold transition-all ${
                        prop.applied
                          ? 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0]'
                          : 'bg-[#fff1eb] hover:bg-[#fed7aa] text-[#c2410c] border border-[#fed7aa]'
                      }`}
                    >
                      {prop.applied ? 'Applied ✓' : `Apply Item (-₹${prop.amount.toLocaleString('en-IN')})`}
                    </button>
                  </div>
                ))}

                {/* Primary CTA Button */}
                <button
                  type="button"
                  onClick={() => onApplyAllProposals(proposals)}
                  aria-label={`Apply all optimization proposals saving ₹${totalSavings.toLocaleString('en-IN')}`}
                  className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff5e14] via-[#ff7a00] to-[#ffa000] text-white text-xs font-bold hover:from-[#ea580c] hover:to-[#f97316] transition-all shadow-[0_2px_12px_rgba(255,94,20,0.3)] focus-visible:ring-2 focus-visible:ring-[#ff5e14]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Apply All Recommendations (-₹{totalSavings.toLocaleString('en-IN')})</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

        {/* Suggested Inquiries */}
        <div className="pt-2">
          <span className="text-[11px] text-[#544c60] dark:text-[#a8a1b7] uppercase tracking-wider font-bold block mb-2">
            Suggested Inquiries
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => handleChipClick('Optimize Budget')}
              className="px-2.5 py-1 rounded-full bg-[#f8f4ed] dark:bg-[#1f1738] hover:bg-[#fff1eb] dark:hover:bg-[#2e2354] text-[#18122b] dark:text-[#f5f3ff] text-[11px] font-semibold transition-colors border border-[#e5ddcf] dark:border-[#382d54]"
            >
              Optimize Budget (₹)
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Day-Of Run Sheet')}
              className="px-2.5 py-1 rounded-full bg-[#f8f4ed] dark:bg-[#1f1738] hover:bg-[#fff1eb] dark:hover:bg-[#2e2354] text-[#18122b] dark:text-[#f5f3ff] text-[11px] font-semibold transition-colors border border-[#e5ddcf] dark:border-[#382d54]"
            >
              Shaadi Run Sheet
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Draft Vendor Email')}
              className="px-2.5 py-1 rounded-full bg-[#f8f4ed] dark:bg-[#1f1738] hover:bg-[#fff1eb] dark:hover:bg-[#2e2354] text-[#18122b] dark:text-[#f5f3ff] text-[11px] font-semibold transition-colors border border-[#e5ddcf] dark:border-[#382d54]"
            >
              Draft Vendor Terms
            </button>
            <button
              type="button"
              onClick={() => handleChipClick('Accessible Venue Ideas')}
              className="px-2.5 py-1 rounded-full bg-[#f8f4ed] dark:bg-[#1f1738] hover:bg-[#fff1eb] dark:hover:bg-[#2e2354] text-[#18122b] dark:text-[#f5f3ff] text-[11px] font-semibold transition-colors border border-[#e5ddcf] dark:border-[#382d54]"
            >
              Mandap & Decor Ideas
            </button>
          </div>
        </div>
      </div>

      {/* Prompt Input Box */}
      <form onSubmit={handleSubmit} className="pt-2">
        <label htmlFor="ai-prompt-input" className="sr-only">
          Ask CelebrationOS AI or generate custom schedules
        </label>
        <div className="relative flex items-center">
          <input
            id="ai-prompt-input"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask AI or optimize ₹ kharcha..."
            className="w-full h-11 pl-3 pr-10 rounded-xl bg-[#f8f4ed] dark:bg-[#1c1630] text-[#18122b] dark:text-[#f5f3ff] placeholder:text-[#544c60] dark:placeholder:text-[#a8a1b7] text-xs border border-[#e5ddcf] dark:border-[#382d54] focus:bg-white dark:focus:bg-[#161028] focus:ring-2 focus:ring-[#ff5e14] focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isLoading}
            aria-label="Send prompt to AI Co-Pilot"
            className="absolute right-1 w-8 h-8 rounded-lg bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white flex items-center justify-center hover:from-[#ea580c] hover:to-[#f97316] transition-colors focus-visible:ring-2 focus-visible:ring-[#ff5e14] disabled:opacity-50 shadow-xs"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  </>
  );
};
