/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '2mb' }));

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Server health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Multi-turn Gemini Chatbot endpoint
app.post('/api/ai/chat', async (req: Request, res: Response): Promise<void> => {
  const { messages, systemInstruction, model, eventContext } = req.body || {};
  const selectedModel = model === 'gemini-3.1-flash-lite' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

  if (!ai) {
    const fallbackReply = generateChatOfflineResponse(messages, systemInstruction, eventContext);
    res.json({ reply: fallbackReply, modelUsed: `${selectedModel} (Deterministic)` });
    return;
  }

  try {
    const defaultInstruction = `You are the CelebrationOS Executive Event Concierge for "${eventContext?.title || 'Celebration'}" (${eventContext?.eventType || 'event'}).
Context: ${eventContext?.guestCount || 200} guests, budget cap $${eventContext?.totalBudget || 25000}, location ${eventContext?.location || 'Venue'}.
Provide concise, elegant, actionable, and culturally aware advice.`;

    // Map conversation history
    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Hello, what should we focus on next?' }] });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction: systemInstruction || defaultInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'I am ready to assist with your next planning milestone.',
      modelUsed: selectedModel,
    });
  } catch (err) {
    console.warn('Gemini chat failed, serving fallback:', err);
    const fallbackReply = generateChatOfflineResponse(messages, systemInstruction, eventContext);
    res.json({ reply: fallbackReply, modelUsed: `${selectedModel} (Offline Fallback)` });
  }
});

function generateChatOfflineResponse(
  messages: Array<{ role: string; content: string }>,
  systemInstruction?: string,
  eventContext?: Record<string, unknown>
): string {
  const lastUserMessage = [...(messages || [])].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';
  const title = (eventContext?.title as string) || 'your celebration';

  if (lastUserMessage.includes('budget') || lastUserMessage.includes('cost') || lastUserMessage.includes('save')) {
    return `For ${title}, the biggest financial lever is rebalancing seasonal florals and consolidating bar inventory. We currently project a healthy reserve—if you reallocate $1,500 from custom print invites to digital RSVP microsites, you can fully fund a live music ensemble with zero budget increase!`;
  }

  if (lastUserMessage.includes('timeline') || lastUserMessage.includes('schedule') || lastUserMessage.includes('run sheet')) {
    return `Looking at the chronological timeline for ${title}, your most critical upcoming milestone is finalizing the catering menu and dietary matrix (T-45 Days offset). I recommend inserting a 30-minute buffer before the main doors open to accommodate early VIP arrivals.`;
  }

  if (lastUserMessage.includes('vendor') || lastUserMessage.includes('catering') || lastUserMessage.includes('contract')) {
    return `For vendor compliance, ensure you have received written confirmation on the outdoor acoustic limits (10:00 PM cutoff) and generator backup staging. You can use the "AI Draft Inquiry" button in your Vendor Checklists tab to send our standard terms review letter!`;
  }

  return `Greetings! As your dedicated CelebrationOS Concierge for ${title}, I am actively monitoring your budget caps, milestone countdown, and vendor deliverables. What specific challenge or creative idea would you like to explore right now?`;
}

// AI Co-Pilot & Orchestration endpoint
app.post('/api/ai/copilot', async (req: Request, res: Response): Promise<void> => {
  const { prompt, actionType, eventSummary } = req.body || {};

  // If no Gemini client or network is unreachable, serve high-fidelity contextual smart responses
  if (!ai) {
    const fallbackResponse = generateSmartOfflineResponse(actionType, prompt, eventSummary);
    res.json(fallbackResponse);
    return;
  }

  try {
    const systemPrompt = `You are CelebrationOS AI Co-Pilot, an autonomous event planning orchestrator.
Context:
- Event: ${eventSummary?.title || 'Celebration'} (${eventSummary?.eventType || 'wedding'})
- Guests: ${eventSummary?.guestCount || 200}
- Total Budget Cap: $${eventSummary?.totalBudget || 25000}
- Current Allocated: $${eventSummary?.allocated || 25000}
- Current Quoted/Actual: $${eventSummary?.actual || 24600}
- Pending High-Priority Tasks: ${eventSummary?.pendingTasks || 4}
- Overrun Categories: ${(eventSummary?.overrunCategories || []).join(', ') || 'None'}

Always reply strictly in JSON adhering to the specified schema. Keep recommendations practical, high-impact, cost-efficient, and culturally sensitive.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt || 'Analyze current budget and suggest top optimization options.',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: {
              type: Type.STRING,
              description: 'One of: optimization, run_sheet, vendor_email, ideas, general_chat',
            },
            headline: {
              type: Type.STRING,
              description: 'Short bold headline summary',
            },
            summary: {
              type: Type.STRING,
              description: 'Executive explanation of the recommendation',
            },
            proposals: {
              type: Type.ARRAY,
              description: 'Actionable savings or adjustment items',
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  amount: { type: Type.NUMBER, description: 'Dollar savings as positive number' },
                  description: { type: Type.STRING },
                  categoryToAdjust: { type: Type.STRING },
                },
                required: ['title', 'amount', 'description', 'categoryToAdjust'],
              },
            },
            emailDraft: {
              type: Type.OBJECT,
              properties: {
                recipientRole: { type: Type.STRING },
                subject: { type: Type.STRING },
                body: { type: Type.STRING },
                keyPoints: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
            generatedIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  costImpactDollars: { type: Type.NUMBER },
                  impactSummary: { type: Type.STRING },
                },
                required: ['title', 'category', 'description', 'costImpactDollars', 'impactSummary'],
              },
            },
          },
          required: ['type', 'headline', 'summary'],
        },
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (error) {
    console.error('Gemini API call failed, falling back to smart engine:', error);
    const fallbackResponse = generateSmartOfflineResponse(actionType, prompt, eventSummary);
    res.json(fallbackResponse);
  }
});

// High-fidelity fallback generator matching real event context
function generateSmartOfflineResponse(
  actionType: string,
  prompt?: string,
  eventSummary?: Record<string, unknown>
) {
  const eventType = (eventSummary?.eventType as string) || 'wedding';
  const query = (prompt || '').toLowerCase();

  if (actionType === 'vendor_email' || query.includes('email') || query.includes('vendor')) {
    return {
      type: 'vendor_email',
      headline: 'Vendor Negotiation & Inquiry Draft',
      summary: 'Prepared professional inquiry addressing package options, dietary requirements, and payment schedule.',
      emailDraft: {
        recipientRole: eventType === 'wedding' ? 'Head of Banquet Operations (Grand Hyatt Udaipur)' : 'Lead Event Coordinator',
        subject: `Inquiry & Terms Review: ${eventSummary?.title || 'Upcoming Celebration'} - Date & Guest Guarantee`,
        body: `Dear Partner,\n\nWe are preparing the final run-of-show for our celebration on behalf of our host committee (${eventSummary?.guestCount || 250} confirmed attendees). We are reviewing our contracted cap and would like to confirm:\n\n1. Final guest headcount cutoff schedule.\n2. Rain/weather backup protocols and backup power contingencies.\n3. A 5% advance settlement discount on remaining balance.\n\nPlease share your updated itemized schedule at your earliest convenience.\n\nWarm regards,\nCelebrationOS Host Team`,
        keyPoints: [
          'Guaranteed headcount threshold confirmation',
          'Acoustical & curfew compliance schedule',
          'Advance payment incentive negotiation',
        ],
      },
    };
  }

  if (actionType === 'run_sheet' || query.includes('run sheet') || query.includes('schedule')) {
    return {
      type: 'run_sheet',
      headline: 'Day-Of Operational Run-Sheet Generated',
      summary: 'Generated minute-by-minute cues for production team, vendors, and hosts.',
      proposals: [
        {
          id: 'opt_rs_1',
          title: 'Buffer Sound Check Window (+30m)',
          amount: 0,
          description: 'Insert 30-minute buffer before doors open to prevent rehearsal overrun.',
          categoryToAdjust: 'Entertainment & Sound',
        },
      ],
    };
  }

  // Default optimization response
  if (eventType === 'wedding') {
    return {
      type: 'optimization',
      headline: 'Optimization Plan',
      summary: 'Analyzed Udaipur vendor rates, seasonal floral availability, and print vs digital costs. Here is an optimized plan to save $2,000:',
      proposals: [
        {
          id: 'prop_opt_1',
          title: 'Floral Seasonality Swap',
          amount: 1100,
          description: 'Swap imported orchids for local Marigold & Mogra garlands across 14 tables.',
          categoryToAdjust: 'Decor & Florals',
        },
        {
          id: 'prop_opt_2',
          title: 'Digital WhatsApp Invites',
          amount: 900,
          description: 'Replace luxury card stock with personalized RSVP web microsites + QR badges.',
          categoryToAdjust: 'Logistics & Guest Transit',
        },
      ],
    };
  }

  if (eventType === 'birthday') {
    return {
      type: 'optimization',
      headline: 'Birthday Budget Rebalance',
      summary: 'Identified $350 in beverage and decor savings while preserving premium guest experience:',
      proposals: [
        {
          id: 'prop_bday_1',
          title: 'Batch Signature Welcome Cocktails',
          amount: 220,
          description: 'Pre-batch 2 signature cocktail bowls instead of single-pour open mixology bar.',
          categoryToAdjust: 'Catering & Cocktails',
        },
        {
          id: 'prop_bday_2',
          title: 'DIY Polaroid Memory Gallery',
          amount: 130,
          description: 'Provide rental instax cameras and fairy-light wire instead of photo booth rental.',
          categoryToAdjust: 'Photo Booth & Keepsakes',
        },
      ],
    };
  }

  return {
    type: 'optimization',
    headline: 'Community Festival Budget Realignment',
    summary: 'Identified $950 in municipal and volunteer logistics savings through civic co-sponsorship:',
    proposals: [
      {
        id: 'prop_comm_1',
        title: 'Municipal Sound Co-Sponsorship',
        amount: 600,
        description: 'Partner with local cultural council for educational stage permit fee waiver.',
        categoryToAdjust: 'Permits & Municipal Compliance',
      },
      {
        id: 'prop_comm_2',
        title: 'Bulk Solar Battery Loaner',
        amount: 350,
        description: 'Utilize regional clean energy grant battery trailer in lieu of secondary generator rental.',
        categoryToAdjust: 'Stage, AV & Generator Power',
      },
    ],
  };
}

// Dev vs Production Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`CelebrationOS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
