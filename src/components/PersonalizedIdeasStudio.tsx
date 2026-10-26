/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PersonalizedIdea } from '../types/event';
import {
  Sparkles,
  RefreshCw,
  Plus,
  Check,
  Brain,
} from 'lucide-react';

interface PersonalizedIdeasStudioProps {
  ideas: PersonalizedIdea[];
  eventTitle: string;
  location: string;
  guestCount: number;
  onAddIdeaToPlan: (idea: PersonalizedIdea) => void;
  onRefreshIdeas: () => void;
  isLoading?: boolean;
}

export const PersonalizedIdeasStudio: React.FC<PersonalizedIdeasStudioProps> = ({
  ideas,
  location,
  guestCount,
  onAddIdeaToPlan,
  onRefreshIdeas,
  isLoading = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredIdeas = selectedCategory === 'all'
    ? ideas
    : ideas.filter((i) => i.category === selectedCategory);

  return (
    <div className="bg-[#ffffff] dark:bg-[#151024] p-4 sm:p-6 rounded-2xl border border-[#e5ddcf] dark:border-[#2d2442] shadow-[0_2px_12px_rgba(255,94,20,0.03)] flex flex-col justify-between w-full">
      <div>
        {/* Header & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0eae1] dark:border-[#2d2442]">
          <div>
            <h2 className="text-lg font-bold text-[#18122b] dark:text-[#f5f3ff] font-headline">
              Personalized Ideas Studio
            </h2>
            <p className="text-xs text-[#544c60] dark:text-[#a8a1b7] mt-0.5">
              Contextual GenAI recommendations for {guestCount} guests in {location}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefreshIdeas}
            disabled={isLoading}
            aria-label="Refresh ideas using Gemini AI"
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-xl bg-[#fff1eb] dark:bg-[#3d1704] text-[#c2410c] dark:text-[#ffbc99] hover:bg-[#fed7aa] dark:hover:bg-[#521e06] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shrink-0 self-start sm:self-auto border border-[#fed7aa] dark:border-[#7c2d12] disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#ff5e14]' : ''}`} />
            <span>{isLoading ? 'Crafting Ideas...' : 'Refresh Ideas'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 mb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'bg-[#f8f4ed] dark:bg-[#1a142c] text-[#544c60] dark:text-[#a8a1b7] hover:bg-[#fff1eb] dark:hover:bg-[#281f3d] border border-[#e5ddcf] dark:border-[#382d54]'
            }`}
          >
            All Categories
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('theme_decor')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'theme_decor'
                ? 'bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white shadow-xs'
                : 'bg-[#f8f4ed] dark:bg-[#1a142c] text-[#544c60] dark:text-[#a8a1b7] hover:bg-[#fff1eb] dark:hover:bg-[#281f3d] border border-[#e5ddcf] dark:border-[#382d54]'
            }`}
          >
            Mandap & Decor
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('food_beverage')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'food_beverage'
                ? 'bg-gradient-to-r from-[#00875a] to-[#10b981] text-white shadow-xs'
                : 'bg-[#f8f4ed] dark:bg-[#1a142c] text-[#544c60] dark:text-[#a8a1b7] hover:bg-[#d1fae5] dark:hover:bg-[#0c2e22] border border-[#e5ddcf] dark:border-[#382d54]'
            }`}
          >
            Chaat & Banquet
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('entertainment_icebreakers')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'entertainment_icebreakers'
                ? 'bg-gradient-to-r from-[#ec4899] to-[#f43f5e] text-white shadow-xs'
                : 'bg-[#f8f4ed] dark:bg-[#1a142c] text-[#544c60] dark:text-[#a8a1b7] hover:bg-[#ffe4e6] dark:hover:bg-[#3d1522] border border-[#e5ddcf] dark:border-[#382d54]'
            }`}
          >
            Sangeet & Entertainment
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('cost_eco_swaps')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'cost_eco_swaps'
                ? 'bg-gradient-to-r from-[#d97706] to-[#f59e0b] text-white shadow-xs'
                : 'bg-[#f8f4ed] dark:bg-[#1a142c] text-[#544c60] dark:text-[#a8a1b7] hover:bg-[#fef3c7] dark:hover:bg-[#381f0a] border border-[#e5ddcf] dark:border-[#382d54]'
            }`}
          >
            Cost & Eco Swaps
          </button>
        </div>

        {/* Ideas Responsive Grid (Expanded Full Width) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-2">
          {filteredIdeas.map((idea) => {
            return (
              <article
                key={idea.id}
                className="p-4 rounded-xl bg-[#f8f4ed] dark:bg-[#1a142c] border border-[#e5ddcf] dark:border-[#2d2442] flex flex-col justify-between gap-3 group hover:border-[#fed7aa] dark:hover:border-[#7c2d12] transition-all shadow-xs"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-[#18122b] dark:text-[#f5f3ff] font-headline">
                      {idea.title}
                    </h3>
                    {idea.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full bg-[#ffffff] dark:bg-[#120e22] border border-[#fed7aa] dark:border-[#7c2d12] text-[#c2410c] dark:text-[#ffbc99] text-[10px] font-bold shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#544c60] dark:text-[#a8a1b7] line-clamp-3">
                    {idea.description}
                  </p>

                  <p className={`font-mono-data text-xs font-bold pt-1 ${
                    idea.costImpactDollars < 0 ? 'text-[#00875a] dark:text-[#10b981]' : 'text-[#c2410c] dark:text-[#ff8a00]'
                  }`}>
                    {idea.impactSummary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddIdeaToPlan(idea)}
                  disabled={idea.applied}
                  aria-label={`Add idea "${idea.title}" to active Budget and Timeline`}
                  className={`inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-xl text-xs font-bold transition-all w-full mt-1 ${
                    idea.applied
                      ? 'bg-[#d1fae5] dark:bg-[#064e3b] text-[#065f46] dark:text-[#a7f3d0] border border-[#a7f3d0] dark:border-[#047857] cursor-default'
                      : 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white hover:from-[#581c87] hover:to-[#4338ca] shadow-xs'
                  }`}
                >
                  {idea.applied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#059669] dark:text-[#10b981]" />
                      <span>Added to Plan ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add to Budget & Timeline</span>
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer Model attribution */}
      <p className="mt-4 pt-3 border-t border-[#f0eae1] dark:border-[#2d2442] text-[11px] text-[#544c60] dark:text-[#a8a1b7] flex items-center gap-1.5 font-medium">
        <Brain className="w-3.5 h-3.5 text-[#ff5e14] shrink-0" />
        <span>Generated using {location} vendor inventory models & Rajasthani seasonal harvest schedules.</span>
      </p>
    </div>
  );
};
