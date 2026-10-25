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
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-2xl border border-[#e5ddcf] shadow-[0_2px_12px_rgba(255,94,20,0.03)] flex flex-col justify-between">
      <div>
        {/* Header & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#18122b] font-headline">
              Personalized Ideas Studio
            </h2>
            <p className="text-xs text-[#544c60] mt-0.5">
              Contextual GenAI recommendations for {guestCount} guests in {location}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefreshIdeas}
            disabled={isLoading}
            aria-label="Refresh ideas using Gemini AI"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl bg-[#fff1eb] text-[#c2410c] hover:bg-[#fed7aa] text-xs font-bold transition-all focus-visible:ring-2 focus-visible:ring-[#ff5e14] shrink-0 self-start sm:self-auto border border-[#fed7aa] disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#ff5e14]' : ''}`} />
            <span>{isLoading ? 'Crafting Ideas...' : 'Refresh Ideas'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white shadow-xs'
                : 'bg-[#f8f4ed] text-[#544c60] hover:bg-[#fff1eb] border border-[#e5ddcf]'
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
                : 'bg-[#f8f4ed] text-[#544c60] hover:bg-[#fff1eb] border border-[#e5ddcf]'
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
                : 'bg-[#f8f4ed] text-[#544c60] hover:bg-[#d1fae5] border border-[#e5ddcf]'
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
                : 'bg-[#f8f4ed] text-[#544c60] hover:bg-[#ffe4e6] border border-[#e5ddcf]'
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
                : 'bg-[#f8f4ed] text-[#544c60] hover:bg-[#fef3c7] border border-[#e5ddcf]'
            }`}
          >
            Cost & Eco Swaps
          </button>
        </div>

        {/* Ideas Card Stack */}
        <div className="flex flex-col gap-2.5 mt-2">
          {filteredIdeas.map((idea) => {
            return (
              <article
                key={idea.id}
                className="p-3.5 rounded-xl bg-[#f8f4ed] border border-[#e5ddcf] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#fff1eb]/60 hover:border-[#fed7aa] transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-[#18122b] font-headline">
                      {idea.title}
                    </h3>
                    {idea.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full bg-[#ffffff] border border-[#fed7aa] text-[#c2410c] text-[10px] font-bold shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#544c60] line-clamp-2">
                    {idea.description}
                  </p>

                  <p className={`font-mono-data text-xs font-bold ${
                    idea.costImpactDollars < 0 ? 'text-[#00875a]' : 'text-[#c2410c]'
                  }`}>
                    {idea.impactSummary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddIdeaToPlan(idea)}
                  disabled={idea.applied}
                  aria-label={`Add idea "${idea.title}" to active Budget and Timeline`}
                  className={`inline-flex items-center justify-center gap-1 h-8 px-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    idea.applied
                      ? 'bg-[#d1fae5] text-[#065f46] border border-[#a7f3d0] cursor-default'
                      : 'bg-gradient-to-r from-[#6d28d9] to-[#4f46e5] text-white hover:from-[#581c87] hover:to-[#4338ca] shadow-xs'
                  }`}
                >
                  {idea.applied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#059669]" />
                      <span>Added ✓</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ Add</span>
                    </>
                  )}
                </button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Footer Model attribution */}
      <p className="mt-4 pt-3 border-t border-[#f0eae1] text-[11px] text-[#544c60] flex items-center gap-1.5 font-medium">
        <Brain className="w-3.5 h-3.5 text-[#ff5e14] shrink-0" />
        <span>Generated using {location} vendor inventory models & Rajasthani seasonal harvest schedules.</span>
      </p>
    </div>
  );
};
