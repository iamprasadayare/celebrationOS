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
    <div className="bg-[#ffffff] p-4 sm:p-6 rounded-xl border border-[#c7c4d7] shadow-xs flex flex-col justify-between">
      <div>
        {/* Header & Refresh */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#131b2e] font-headline">
              Personalized Ideas Studio
            </h2>
            <p className="text-xs text-[#464554] mt-0.5">
              Contextual GenAI recommendations for {guestCount} guests in {location}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefreshIdeas}
            disabled={isLoading}
            aria-label="Refresh ideas using Gemini AI"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] shrink-0 self-start sm:self-auto border border-[#c7c4d7] disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#4338ca]' : ''}`} />
            <span>{isLoading ? 'Generating...' : 'Refresh'}</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#4338ca] text-white'
                : 'bg-[#f2f3ff] text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            All Categories
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('theme_decor')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'theme_decor'
                ? 'bg-[#4338ca] text-white'
                : 'bg-[#f2f3ff] text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            Theme & Decor
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('food_beverage')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'food_beverage'
                ? 'bg-[#4338ca] text-white'
                : 'bg-[#f2f3ff] text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            Food & Beverage
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('entertainment_icebreakers')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'entertainment_icebreakers'
                ? 'bg-[#4338ca] text-white'
                : 'bg-[#f2f3ff] text-[#464554] hover:bg-[#eaedff]'
            }`}
          >
            Entertainment
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('cost_eco_swaps')}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors whitespace-nowrap ${
              selectedCategory === 'cost_eco_swaps'
                ? 'bg-[#4338ca] text-white'
                : 'bg-[#f2f3ff] text-[#464554] hover:bg-[#eaedff]'
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
                className="p-3.5 rounded-lg bg-[#f2f3ff] border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-[#eaedff]/60 transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xs font-bold text-[#131b2e] font-headline">
                      {idea.title}
                    </h3>
                    {idea.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-full bg-[#ffffff] border border-[#dae2fd] text-[#4338ca] text-[10px] font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-[#464554] line-clamp-2">
                    {idea.description}
                  </p>

                  <p className={`font-mono-data text-xs font-semibold ${
                    idea.costImpactDollars < 0 ? 'text-[#006c4e]' : 'text-[#873b00]'
                  }`}>
                    {idea.impactSummary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddIdeaToPlan(idea)}
                  disabled={idea.applied}
                  aria-label={`Add idea "${idea.title}" to active Budget and Timeline`}
                  className={`inline-flex items-center justify-center gap-1 h-8 px-3 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                    idea.applied
                      ? 'bg-[#97f5cc] text-[#007353] cursor-default'
                      : 'bg-[#e2e7ff] hover:bg-[#4338ca] hover:text-white text-[#2a14b4]'
                  }`}
                >
                  {idea.applied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
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
      <p className="mt-4 pt-3 border-t border-[#eaedff] text-[11px] text-[#464554] flex items-center gap-1.5">
        <Brain className="w-3.5 h-3.5 text-[#4338ca] shrink-0" />
        <span>Generated using {location} vendor inventory models & regional seasonal schedules.</span>
      </p>
    </div>
  );
};
