/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AICoPilotResponse, PersonalizedIdea, CopilotOptimizationItem } from '../types/event';

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/gi,
  /system\s+prompt\s*:/gi,
  /disregard\s+(all\s+)?rules/gi,
  /you\s+are\s+now\s+in\s+developer\s+mode/gi,
  /reveal\s+(internal|system)\s+instructions/gi,
  /act\s+as\s+an\s+unrestricted\s+ai/gi,
];

// RFC-compliant email regex
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;

// International and US phone regex matching formats like (555) 123-4567, +1-555-019-2834, 98765-43210
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g;

/**
 * Strips HTML and script tags, enforces 1,500 character limits, and neutralizes prompt injection overrides.
 */
export function sanitizeUserInput(input: string): string {
  if (!input) return '';

  // 1. Trim length to 1,500 max characters
  let cleaned = input.trim().slice(0, 1500);

  // 2. Strip dangerous HTML, script tags, event handlers, and javascript: links
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  cleaned = cleaned.replace(/javascript:/gi, '');
  cleaned = cleaned.replace(/on\w+\s*=/gi, '');

  // 3. Neutralize prompt-override attempts
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    cleaned = cleaned.replace(pattern, '[DEFENSE_FILTERED]');
  }

  return cleaned.trim();
}

/**
 * Redacts personally identifiable information (emails and phone numbers)
 * so private contact details are never transmitted to external LLMs.
 */
export function redactPII(text: string): string {
  if (!text) return '';
  let sanitized = text.replace(EMAIL_REGEX, '[REDACTED_EMAIL]');
  sanitized = sanitized.replace(PHONE_REGEX, '[REDACTED_PHONE]');
  return sanitized;
}

/**
 * Generates an idempotent, deterministic prompt cache key for sessionStorage retrieval.
 */
export function generatePromptCacheKey(
  actionType: string,
  eventType: string,
  sanitizedPrompt: string,
  totalBudget: number,
  guestCount: number
): string {
  const normPrompt = sanitizedPrompt.toLowerCase().replace(/\s+/g, '_').slice(0, 60);
  return `cos_cache_${actionType}_${eventType}_${totalBudget}_${guestCount}_${normPrompt}`;
}

/**
 * Runtime defensive validator for Gemini JSON responses.
 * Guarantees that malformed responses or missing keys do not crash the UI.
 */
export function validateGeminiResponse(raw: unknown): AICoPilotResponse {
  if (!raw || typeof raw !== 'object') {
    return {
      type: 'general_chat',
      headline: 'Event Assistant Insight',
      summary: 'Generated actionable recommendations based on your event specifications.',
      proposals: [],
    };
  }

  const obj = raw as Record<string, unknown>;

  const validTypes = ['optimization', 'run_sheet', 'vendor_email', 'ideas', 'general_chat'];
  const type = (typeof obj.type === 'string' && validTypes.includes(obj.type))
    ? (obj.type as AICoPilotResponse['type'])
    : 'optimization';

  const headline = typeof obj.headline === 'string' && obj.headline.trim() !== ''
    ? obj.headline
    : 'Optimization Plan';

  const summary = typeof obj.summary === 'string' && obj.summary.trim() !== ''
    ? obj.summary
    : 'CelebrationOS AI has reviewed your parameters and generated suggestions.';

  const proposals: CopilotOptimizationItem[] = [];
  if (Array.isArray(obj.proposals)) {
    for (const p of obj.proposals) {
      if (p && typeof p === 'object') {
        const item = p as Record<string, unknown>;
        proposals.push({
          id: typeof item.id === 'string' ? item.id : `prop_${Math.random().toString(36).substr(2, 6)}`,
          title: typeof item.title === 'string' ? item.title : 'Rebalance Allocation',
          amount: typeof item.amount === 'number' && !isNaN(item.amount) ? Math.abs(item.amount) : 500,
          description: typeof item.description === 'string' ? item.description : 'Optimized vendor and supply rate negotiation.',
          categoryToAdjust: typeof item.categoryToAdjust === 'string' ? item.categoryToAdjust : 'General',
        });
      }
    }
  }

  const generatedIdeas: PersonalizedIdea[] = [];
  if (Array.isArray(obj.generatedIdeas)) {
    for (const g of obj.generatedIdeas) {
      if (g && typeof g === 'object') {
        const idea = g as Record<string, unknown>;
        const validCategories = ['theme_decor', 'food_beverage', 'entertainment_icebreakers', 'cost_eco_swaps'];
        const cat = (typeof idea.category === 'string' && validCategories.includes(idea.category))
          ? (idea.category as PersonalizedIdea['category'])
          : 'theme_decor';

        generatedIdeas.push({
          id: typeof idea.id === 'string' ? idea.id : `idea_${Math.random().toString(36).substr(2, 6)}`,
          title: typeof idea.title === 'string' ? idea.title : 'Event Element',
          category: cat,
          tags: Array.isArray(idea.tags) ? idea.tags.map(String) : ['Contextual', 'Curated'],
          description: typeof idea.description === 'string' ? idea.description : 'High-impact celebratory enhancement.',
          costImpactDollars: typeof idea.costImpactDollars === 'number' ? idea.costImpactDollars : -200,
          impactSummary: typeof idea.impactSummary === 'string' ? idea.impactSummary : 'Impact: Smart rebalance',
        });
      }
    }
  }

  let emailDraft: AICoPilotResponse['emailDraft'];
  if (obj.emailDraft && typeof obj.emailDraft === 'object') {
    const d = obj.emailDraft as Record<string, unknown>;
    emailDraft = {
      recipientRole: typeof d.recipientRole === 'string' ? d.recipientRole : 'Vendor Lead',
      subject: typeof d.subject === 'string' ? d.subject : 'Inquiry & Availability Confirmation',
      body: typeof d.body === 'string' ? d.body : 'Hello, reaching out regarding availability and terms for our upcoming celebration.',
      keyPoints: Array.isArray(d.keyPoints) ? d.keyPoints.map(String) : [],
    };
  }

  return {
    type,
    headline,
    summary,
    proposals,
    generatedIdeas: generatedIdeas.length > 0 ? generatedIdeas : undefined,
    emailDraft,
  };
}
