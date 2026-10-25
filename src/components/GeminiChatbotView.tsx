/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { EventPlan } from '../types/event';
import { sanitizeUserInput, redactPII } from '../utils/securitySanitizer';
import {
  Bot,
  Send,
  User,
  Sparkles,
  Zap,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  ArrowRight,
  BrainCircuit,
} from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

interface GeminiChatbotViewProps {
  activeEvent: EventPlan;
}

interface PersonaConfig {
  id: string;
  title: string;
  roleLabel: string;
  avatarIcon: string;
  systemInstruction: string;
  defaultQuestions: string[];
}

export const GeminiChatbotView: React.FC<GeminiChatbotViewProps> = ({ activeEvent }) => {
  const personas: PersonaConfig[] = [
    {
      id: 'director',
      title: 'Master Event Director',
      roleLabel: 'Logistics, Run-of-Show & Timeline Master',
      avatarIcon: '🎓',
      systemInstruction: `You are the Master Event Director for "${activeEvent.title}" (${activeEvent.type}).
Context: ${activeEvent.guestCount} guests, budget cap $${activeEvent.baselineBudgetCap}, location ${activeEvent.location}.
Provide concise, authoritative, and actionable operational guidance. Prioritize seamless scheduling, safety protocols, and contingency timing.`,
      defaultQuestions: [
        'How should I structure the day-of timing buffer before VIP guest arrivals?',
        'What are the key contingency steps if outdoor rain occurs at our venue?',
        'How do we ensure seamless handoff between audio engineers and the master of ceremonies?',
      ],
    },
    {
      id: 'culinary',
      title: 'Executive Chef & Dietary Sommelier',
      roleLabel: 'Catering, Allergen Matrices & Beverage Pairing',
      avatarIcon: '🍽️',
      systemInstruction: `You are the Executive Chef & Dietary Sommelier for "${activeEvent.title}" (${activeEvent.type}).
Context: ${activeEvent.guestCount} guests, location ${activeEvent.location}.
Provide expert culinary guidance: balanced multi-course tasting menus, interactive live stations, allergen management (vegan, nut-free, gluten-free), and signature beverage curation.`,
      defaultQuestions: [
        'How can we design an inclusive live street food station with strict allergen labeling?',
        'What are three signature seasonal welcome drinks that pair with our theme?',
        'What is the optimal per-guest calculation for champagne toast vs open bar spirits?',
      ],
    },
    {
      id: 'negotiator',
      title: 'Vendor Contract & Cost Negotiator',
      roleLabel: 'Budget Optimization, Vendor Clauses & Cap Defense',
      avatarIcon: '💼',
      systemInstruction: `You are the Vendor Contract & Cost Negotiator for "${activeEvent.title}".
Context: Total budget cap $${activeEvent.baselineBudgetCap}, ${activeEvent.guestCount} attendees.
Advise on contract language, deposit milestones, force majeure clauses, minimum food/beverage guarantees, and negotiating rate concessions.`,
      defaultQuestions: [
        'What contract clauses should I review before signing our audio and lighting agreement?',
        'How can I negotiate a 5-10% advance payment incentive with our catering partner?',
        'How do we structure headcount adjustment deadlines to avoid paying for last-minute cancellations?',
      ],
    },
    {
      id: 'stylist',
      title: 'Creative Theme & Decor Stylist',
      roleLabel: 'Atmosphere, Lighting, Floral & Visual Experience',
      avatarIcon: '🎨',
      systemInstruction: `You are the Creative Theme & Decor Stylist for "${activeEvent.title}" in ${activeEvent.location}.
Focus on memorable atmosphere: lighting cues, color harmony, sustainable floral swaps, and experiential photo moments that elevate guest sentiment.`,
      defaultQuestions: [
        'What are high-impact cost-effective floral swaps using local seasonal blossoms?',
        'How should we balance ambient warm lighting and spotlighting for dinner speeches?',
        'What interactive welcome installations encourage organic guest photo-sharing?',
      ],
    },
  ];

  const [selectedPersona, setSelectedPersona] = useState<PersonaConfig>(personas[0]);
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite'>('gemini-3.8-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_initial',
      role: 'assistant',
      content: `Welcome to CelebrationOS! I am your **${personas[0].title}** for **${activeEvent.title}** (${activeEvent.guestCount} guests at ${activeEvent.location}).\n\nHow can I help you orchestrate an unforgettable celebration today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const rawText = textToSend || inputPrompt;
    if (!rawText.trim() || isLoading) return;

    // Sanitize and shield PII
    const sanitized = sanitizeUserInput(rawText);
    const shielded = redactPII(sanitized);

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      role: 'user',
      content: shielded,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const historyPayload = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: historyPayload,
          systemInstruction: selectedPersona.systemInstruction,
          model: selectedModel,
          eventContext: {
            title: activeEvent.title,
            eventType: activeEvent.type,
            location: activeEvent.location,
            guestCount: activeEvent.guestCount,
            totalBudget: activeEvent.baselineBudgetCap,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I am ready to assist with your next operational milestone.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.warn('Chat request failed, generating fallback response:', err);
      const fallbackReply = `Regarding ${activeEvent.title}: For optimal results, coordinate directly with your lead vendors 14 days before event date to lock in headcount contingencies and acoustical schedules.`;
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: fallbackReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          modelUsed: `${selectedModel} (Offline)`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        role: 'assistant',
        content: `I am now ready to assist as your **${selectedPersona.title}** for **${activeEvent.title}**. What area should we inspect?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  const handlePersonaChange = (persona: PersonaConfig) => {
    setSelectedPersona(persona);
    setMessages((prev) => [
      ...prev,
      {
        id: `msg_p_switch_${Date.now()}`,
        role: 'assistant',
        content: `*Switched role persona to **${persona.title}** (${persona.roleLabel}).*\n\nHow can I apply my expertise to your celebration?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedModel,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-200">
      {/* Header and Controls */}
      <div className="bg-white p-5 rounded-2xl border border-[#c7c4d7] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#4338ca] text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#131b2e] font-headline">
                Gemini Multi-Turn AI Concierge
              </h2>
              <p className="text-xs text-[#464554] mt-0.5">
                Continuous conversational memory with customizable specialist personas.
              </p>
            </div>
          </div>
        </div>

        {/* Model Switcher & Reset */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1 p-1 bg-[#f2f3ff] rounded-lg border border-[#dae2fd]">
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.8-flash')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                selectedModel === 'gemini-3.8-flash'
                  ? 'bg-white text-[#4338ca] shadow-xs'
                  : 'text-[#464554] hover:text-[#131b2e]'
              }`}
            >
              Gemini 3.8 Flash (General)
            </button>
            <button
              type="button"
              onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                selectedModel === 'gemini-3.1-flash-lite'
                  ? 'bg-white text-[#4338ca] shadow-xs'
                  : 'text-[#464554] hover:text-[#131b2e]'
              }`}
            >
              Gemini 3.1 Flash Lite (Fast)
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetChat}
            aria-label="Reset conversation thread"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#c7c4d7] bg-white text-xs font-semibold text-[#464554] hover:bg-[#f2f3ff] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Specialist Persona Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {personas.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          return (
            <button
              key={persona.id}
              type="button"
              onClick={() => handlePersonaChange(persona)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap border shrink-0 ${
                isSelected
                  ? 'bg-[#4338ca] text-white border-[#4338ca] shadow-xs'
                  : 'bg-white text-[#131b2e] border-[#c7c4d7] hover:bg-[#f2f3ff]'
              }`}
            >
              <span className="text-sm">{persona.avatarIcon}</span>
              <span>{persona.title}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-white rounded-2xl border border-[#c7c4d7] shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Scrollable Messages Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-[#4338ca] text-white'
                      : 'bg-[#eaedff] text-[#4338ca] border border-[#dae2fd]'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : selectedPersona.avatarIcon}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed space-y-1 shadow-xs ${
                    isUser
                      ? 'bg-[#4338ca] text-white rounded-tr-xs'
                      : 'bg-[#f2f3ff] text-[#131b2e] border border-[#dae2fd] rounded-tl-xs'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 mb-0.5">
                    <span className="font-semibold">
                      {isUser ? 'You' : selectedPersona.title}
                    </span>
                    <span className="font-mono-data">{msg.timestamp}</span>
                  </div>

                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {!isUser && msg.modelUsed && (
                    <div className="pt-1 flex items-center gap-1 text-[10px] text-[#464554] opacity-80 font-mono-data">
                      <Sparkles className="w-3 h-3 text-[#4338ca]" />
                      <span>Model: {msg.modelUsed}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%] mr-auto items-center">
              <div className="w-8 h-8 rounded-full bg-[#eaedff] text-[#4338ca] flex items-center justify-center text-xs">
                {selectedPersona.avatarIcon}
              </div>
              <div className="p-3 bg-[#f2f3ff] rounded-2xl rounded-tl-xs border border-[#dae2fd] flex items-center gap-2 text-xs text-[#464554]">
                <Sparkles className="w-4 h-4 text-[#4338ca] animate-spin" />
                <span>{selectedPersona.title} is synthesizing advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Banner */}
        <div className="px-4 py-2 bg-[#faf8ff] border-t border-[#eaedff] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-[#464554] uppercase tracking-wider font-bold shrink-0">
            Suggested:
          </span>
          {selectedPersona.defaultQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-full bg-white text-[#4338ca] hover:bg-[#e2e7ff] text-[11px] font-medium border border-[#dae2fd] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>{q}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-[#c7c4d7] flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={`Ask your ${selectedPersona.title} anything about ${activeEvent.title}...`}
              className="w-full h-11 pl-4 pr-10 text-xs rounded-xl bg-[#f2f3ff] text-[#131b2e] placeholder:text-[#464554] border border-[#c7c4d7] focus:bg-white focus:ring-2 focus:ring-[#4338ca] focus:outline-none transition-all"
            />
            <div className="absolute right-3 top-3 text-[#006c4e] flex items-center gap-1 text-[10px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PII Shield</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            aria-label="Send message to Gemini Chatbot"
            className="w-11 h-11 rounded-xl bg-[#4338ca] text-white flex items-center justify-center hover:bg-[#372abf] transition-colors focus-visible:ring-2 focus-visible:ring-[#4338ca] disabled:opacity-50 shrink-0 shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
