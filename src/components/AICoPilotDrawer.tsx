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
    <aside
      aria-label="CelebrationOS AI Co-Pilot Assistant"
      className="w-full xl:w-[340px] shrink-0 bg-[#ffffff] p-4 rounded-2xl border border-[#c7c4d7] shadow-sm space-y-4 self-start sticky top-20 z-30"
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#4338ca] text-white flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#131b2e] leading-none font-headline">
              AI Co-Pilot
            </h2>
            <span className="font-mono-data text-[11px] text-[#464554]">
              Autonomous Orchestrator
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#97f5cc] text-[#007353] text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            <span>PII Masked</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close AI Co-Pilot drawer"
            className="text-[#464554] hover:text-[#131b2e] p-1 rounded hover:bg-[#f2f3ff]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Latency & Cache Status */}
      <div className="flex items-center justify-between text-[11px] text-[#464554] px-1 font-mono-data">
        <span className="flex items-center gap-1 text-[#006c4e] font-semibold">
          <Zap className="w-3 h-3" />
          <span>{latencyMs}ms latency</span>
        </span>
        {servedFromCache && (
          <span className="px-1.5 py-0.2 rounded bg-[#eaedff] text-[#2a14b4] font-semibold text-[10px]">
            Served from Cache
          </span>
        )}
      </div>

      {/* Active Conversation Thread */}
      <div className="space-y-3">
        {/* User Prompt Message Bubble */}
        <div className="flex flex-col items-end">
          <div className="bg-[#4338ca] text-white p-3 rounded-xl rounded-tr-xs max-w-[90%] shadow-xs">
            <p className="text-xs leading-relaxed">
              Cut $2,000 from the wedding budget without reducing guest count or food quality.
            </p>
          </div>
          <span className="font-mono-data text-[10px] text-[#464554] mt-1 mr-1">
            Today at 10:42 AM
          </span>
        </div>

        {/* AI Response Message Card */}
        {isLoading ? (
          <div className="bg-[#f2f3ff] p-4 rounded-xl rounded-tl-xs space-y-2 border border-[#eaedff] animate-pulse">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4338ca] animate-spin" />
              <span className="text-xs font-bold text-[#131b2e]">Thinking & Analyzing Rates...</span>
            </div>
            <div className="h-3 bg-[#e2e7ff] rounded w-3/4" />
            <div className="h-3 bg-[#e2e7ff] rounded w-1/2" />
          </div>
        ) : copilotResponse ? (
          <div className="bg-[#f2f3ff] p-3.5 rounded-xl rounded-tl-xs space-y-3 border border-[#eaedff]">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#4338ca]" />
              <span className="text-xs font-bold text-[#131b2e] font-headline">
                {copilotResponse.headline}
              </span>
            </div>

            <p className="text-xs text-[#464554] leading-relaxed">
              {copilotResponse.summary}
            </p>

            {/* Proposals */}
            {proposals.length > 0 && (
              <div className="space-y-2">
                {proposals.map((prop) => (
                  <div
                    key={prop.id}
                    className="bg-[#ffffff] p-2.5 rounded-lg space-y-1.5 shadow-xs border border-[#dae2fd]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#131b2e]">
                        {prop.title}
                      </span>
                      <span className="font-mono-data text-xs font-bold text-[#006c4e]">
                        -${prop.amount.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#464554] leading-tight">
                      {prop.description}
                    </p>
                    <button
                      type="button"
                      disabled={prop.applied}
                      onClick={() => onApplySingleProposal(prop)}
                      className={`w-full py-1 text-center text-[11px] rounded font-semibold transition-colors ${
                        prop.applied
                          ? 'bg-[#97f5cc] text-[#007353]'
                          : 'bg-[#eaedff] hover:bg-[#e2e7ff] text-[#4338ca]'
                      }`}
                    >
                      {prop.applied ? 'Applied ✓' : `Apply Item (-$${prop.amount.toLocaleString()})`}
                    </button>
                  </div>
                ))}

                {/* Primary CTA Button */}
                <button
                  type="button"
                  onClick={() => onApplyAllProposals(proposals)}
                  aria-label={`Apply all optimization proposals saving $${totalSavings.toLocaleString()}`}
                  className="w-full h-10 flex items-center justify-center gap-2 rounded-lg bg-[#4338ca] text-white text-xs font-semibold hover:bg-[#372abf] transition-all shadow-xs focus-visible:ring-2 focus-visible:ring-[#4338ca]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Apply All Recommendations (-${totalSavings.toLocaleString()})</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Suggested Inquiries */}
      <div className="pt-1">
        <span className="text-[11px] text-[#464554] uppercase tracking-wider font-semibold block mb-2">
          Suggested Inquiries
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => handleChipClick('Optimize Budget')}
            className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[11px] font-medium transition-colors border border-[#dae2fd]"
          >
            Optimize Budget
          </button>
          <button
            type="button"
            onClick={() => handleChipClick('Day-Of Run Sheet')}
            className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[11px] font-medium transition-colors border border-[#dae2fd]"
          >
            Day-Of Run Sheet
          </button>
          <button
            type="button"
            onClick={() => handleChipClick('Draft Vendor Email')}
            className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[11px] font-medium transition-colors border border-[#dae2fd]"
          >
            Draft Vendor Email
          </button>
          <button
            type="button"
            onClick={() => handleChipClick('Accessible Venue Ideas')}
            className="px-2.5 py-1 rounded-full bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] text-[11px] font-medium transition-colors border border-[#dae2fd]"
          >
            Accessible Venue Ideas
          </button>
        </div>
      </div>

      {/* Prompt Input Box */}
      <form onSubmit={handleSubmit} className="pt-1">
        <label htmlFor="ai-prompt-input" className="sr-only">
          Ask CelebrationOS AI or generate custom schedules
        </label>
        <div className="relative flex items-center">
          <input
            id="ai-prompt-input"
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask AI or generate schedules..."
            className="w-full h-11 pl-3 pr-10 rounded-lg bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#464554] text-xs border border-[#c7c4d7] focus:bg-white focus:ring-2 focus:ring-[#4338ca] focus:outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!userInput.trim() || isLoading}
            aria-label="Send prompt to AI Co-Pilot"
            className="absolute right-1 w-8 h-8 rounded-md bg-[#4338ca] text-white flex items-center justify-center hover:bg-[#372abf] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] disabled:opacity-50"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </form>
    </aside>
  );
};
