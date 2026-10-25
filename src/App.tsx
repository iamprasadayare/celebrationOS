/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  EventPlan,
  EventType,
  BudgetItem,
  TimelineTask,
  VendorChecklistCard,
  PersonalizedIdea,
  AICoPilotResponse,
  CopilotOptimizationItem,
} from './types/event';
import { WEDDING_EVENT, BIRTHDAY_EVENT, COMMUNITY_EVENT } from './data/mockEvents';
import { calculateBudgetSummary, scaleBudgetByGuestCount } from './utils/budgetMath';
import { queryCelebrationOSAI } from './services/geminiService';

import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { BudgetHealthCards } from './components/BudgetHealthCards';
import { BudgetBreakdownTable } from './components/BudgetBreakdownTable';
import { ChronologicalTimeline } from './components/ChronologicalTimeline';
import { VendorChecklists } from './components/VendorChecklists';
import { PersonalizedIdeasStudio } from './components/PersonalizedIdeasStudio';
import { AICoPilotDrawer } from './components/AICoPilotDrawer';
import { DiagnosticsView } from './components/DiagnosticsView';
import { NewEventWizardModal } from './components/NewEventWizardModal';
import { VendorEmailModal } from './components/VendorEmailModal';
import { GuestSimulatorModal } from './components/GuestSimulatorModal';
import { ExportSummaryModal } from './components/ExportSummaryModal';

export default function App() {
  // Master Event Repositories
  const [eventsMap, setEventsMap] = useState<Record<string, EventPlan>>({
    wedding: WEDDING_EVENT,
    birthday: BIRTHDAY_EVENT,
    community: COMMUNITY_EVENT,
  });

  const [activeEventId, setActiveEventId] = useState<string>('wedding');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // Accessibility & UI Toggles
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(true);
  const [ariaLiveMessage, setAriaLiveMessage] = useState<string>('');

  // AI Co-Pilot State
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);
  const [aiLatencyMs, setAiLatencyMs] = useState<number>(42);
  const [lastAiSource, setLastAiSource] = useState<'cache' | 'api'>('cache');

  // Default initial Co-Pilot optimization matching Stitch mockup with Indian INR values
  const [copilotResponse, setCopilotResponse] = useState<AICoPilotResponse | null>({
    type: 'optimization',
    headline: 'Optimization Plan',
    summary:
      'Analyzed Udaipur vendor rates, seasonal floral availability, and print vs digital costs. Here is an optimized plan to save ₹2,00,000:',
    proposals: [
      {
        id: 'prop_init_1',
        title: 'Floral Seasonality Swap',
        amount: 110000,
        description: 'Swap imported orchids for local Marigold & Mogra garlands across 14 banquet tables.',
        categoryToAdjust: 'Decor & Mandap',
        applied: false,
      },
      {
        id: 'prop_init_2',
        title: 'Digital WhatsApp & Web Invites',
        amount: 90000,
        description: 'Replace heavy gold-foil card stock with personalized RSVP web microsites + QR badges.',
        categoryToAdjust: 'Logistics & Guest Transit',
        applied: false,
      },
    ],
    servedFromCache: true,
    latencyMs: 42,
  });

  // Modals
  const [showNewEventWizard, setShowNewEventWizard] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedVendorForEmail, setSelectedVendorForEmail] = useState<VendorChecklistCard | undefined>(undefined);
  const [showSimulatorModal, setShowSimulatorModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Active Event
  const activeEvent = useMemo(() => {
    return eventsMap[activeEventId] || eventsMap['wedding'];
  }, [eventsMap, activeEventId]);

  // Memoized deterministic Budget Summary
  const budgetSummary = useMemo(() => {
    return calculateBudgetSummary(activeEvent.budgetItems, activeEvent.baselineBudgetCap);
  }, [activeEvent.budgetItems, activeEvent.baselineBudgetCap]);

  // Apply high-contrast mode class
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Global Escape key listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowNewEventWizard(false);
        setShowEmailModal(false);
        setShowSimulatorModal(false);
        setShowExportModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mode Switcher handler
  const handleSelectEventType = useCallback((type: EventType) => {
    setActiveEventId(type);
    setAriaLiveMessage(`Switched active event mode to ${type}.`);
  }, []);

  // Update Active Event helper
  const updateCurrentEvent = useCallback(
    (updater: (prev: EventPlan) => EventPlan) => {
      setEventsMap((prev) => {
        const current = prev[activeEventId];
        if (!current) return prev;
        const updated = updater(current);
        return {
          ...prev,
          [activeEventId]: updated,
        };
      });
    },
    [activeEventId]
  );

  // Budget Items Management
  const handleAddBudgetItem = useCallback(
    (newItem: Omit<BudgetItem, 'id'>) => {
      const id = `b_user_${Date.now()}`;
      updateCurrentEvent((event) => ({
        ...event,
        budgetItems: [...event.budgetItems, { ...newItem, id }],
      }));
      setAriaLiveMessage(`Added budget line "${newItem.name}".`);
    },
    [updateCurrentEvent]
  );

  const handleUpdateBudgetItem = useCallback(
    (updatedItem: BudgetItem) => {
      updateCurrentEvent((event) => ({
        ...event,
        budgetItems: event.budgetItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      }));
      setAriaLiveMessage(`Updated budget line "${updatedItem.name}".`);
    },
    [updateCurrentEvent]
  );

  const handleDeleteBudgetItem = useCallback(
    (id: string) => {
      updateCurrentEvent((event) => ({
        ...event,
        budgetItems: event.budgetItems.filter((item) => item.id !== id),
      }));
      setAriaLiveMessage('Deleted budget item.');
    },
    [updateCurrentEvent]
  );

  // What-If Guest Scaler slider
  const handleGuestCountChange = useCallback(
    (newCount: number) => {
      updateCurrentEvent((event) => {
        const scaledItems = scaleBudgetByGuestCount(event.budgetItems, event.guestCount, newCount);
        return {
          ...event,
          guestCount: newCount,
          budgetItems: scaledItems,
        };
      });
      setAriaLiveMessage(`Scaled guest count to ${newCount}.`);
    },
    [updateCurrentEvent]
  );

  // Apply simulated budget from modal
  const handleApplySimulatedBudget = useCallback(
    (scaledItems: BudgetItem[], newGuestCount: number) => {
      updateCurrentEvent((event) => ({
        ...event,
        guestCount: newGuestCount,
        budgetItems: scaledItems,
      }));
      setAriaLiveMessage(`Applied simulated budget for ${newGuestCount} guests.`);
    },
    [updateCurrentEvent]
  );

  // Timeline Task Toggle
  const handleToggleTask = useCallback(
    (taskId: string) => {
      updateCurrentEvent((event) => ({
        ...event,
        timelineTasks: event.timelineTasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      }));
      setAriaLiveMessage('Updated milestone completion status.');
    },
    [updateCurrentEvent]
  );

  // Add Timeline Task
  const handleAddTimelineTask = useCallback(
    (newTask: Omit<TimelineTask, 'id'>) => {
      const id = `t_user_${Date.now()}`;
      updateCurrentEvent((event) => ({
        ...event,
        timelineTasks: [...event.timelineTasks, { ...newTask, id }],
      }));
      setAriaLiveMessage(`Added timeline task "${newTask.title}".`);
    },
    [updateCurrentEvent]
  );

  // Vendor Checklist Toggle
  const handleToggleVendorChecklistItem = useCallback(
    (vendorId: string, itemId: string) => {
      updateCurrentEvent((event) => ({
        ...event,
        vendors: event.vendors.map((v) => {
          if (v.id !== vendorId) return v;
          return {
            ...v,
            checklist: v.checklist.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
          };
        }),
      }));
      setAriaLiveMessage('Updated vendor checklist verification.');
    },
    [updateCurrentEvent]
  );

  // One-click Add Idea to Budget & Timeline
  const handleAddIdeaToPlan = useCallback(
    (idea: PersonalizedIdea) => {
      updateCurrentEvent((event) => {
        // 1. Mark idea applied
        const updatedIdeas = event.personalizedIdeas.map((i) => (i.id === idea.id ? { ...i, applied: true } : i));

        // 2. Add budget item if specified
        let updatedBudget = [...event.budgetItems];
        if (idea.recommendedBudgetItem) {
          const newBId = `b_idea_${idea.id}`;
          if (!updatedBudget.some((b) => b.id === newBId)) {
            updatedBudget.push({
              id: newBId,
              category: idea.recommendedBudgetItem.category,
              name: idea.recommendedBudgetItem.name,
              allocated: idea.recommendedBudgetItem.allocated,
              quotedOrActual: idea.recommendedBudgetItem.quotedOrActual,
              paid: 0,
              status: idea.recommendedBudgetItem.allocated >= idea.recommendedBudgetItem.quotedOrActual ? 'under_budget' : 'over_budget',
              perHeadScalingRatio: 0.5,
              notes: `Added from Ideas Studio: "${idea.title}"`,
            });
          }
        }

        // 3. Add timeline task if specified
        let updatedTimeline = [...event.timelineTasks];
        if (idea.recommendedTimelineTask) {
          const newTId = `t_idea_${idea.id}`;
          if (!updatedTimeline.some((t) => t.id === newTId)) {
            updatedTimeline.push({
              id: newTId,
              title: idea.recommendedTimelineTask.title,
              phase: idea.recommendedTimelineTask.phase,
              daysBeforeEvent: idea.recommendedTimelineTask.daysBeforeEvent,
              priority: idea.recommendedTimelineTask.priority,
              completed: false,
              details: `Initiative: ${idea.title}`,
            });
          }
        }

        return {
          ...event,
          personalizedIdeas: updatedIdeas,
          budgetItems: updatedBudget,
          timelineTasks: updatedTimeline,
        };
      });

      setAriaLiveMessage(`Added idea "${idea.title}" to active Budget and Timeline.`);
    },
    [updateCurrentEvent]
  );

  // AI Co-Pilot query handler
  const handleCopilotPrompt = useCallback(
    async (promptText: string, actionType: AICoPilotResponse['type'] = 'optimization') => {
      setIsLoadingAi(true);
      setAriaLiveMessage('AI Co-Pilot is analyzing celebration parameters...');

      try {
        const response = await queryCelebrationOSAI({
          prompt: promptText,
          actionType,
          activeEvent,
        });

        setCopilotResponse(response);
        setAiLatencyMs(response.latencyMs || 42);
        setLastAiSource(response.servedFromCache ? 'cache' : 'api');

        if (response.emailDraft) {
          setShowEmailModal(true);
        }

        setAriaLiveMessage(`AI Co-Pilot generated: ${response.headline}`);
      } catch (err) {
        console.error('Copilot request error:', err);
      } finally {
        setIsLoadingAi(false);
      }
    },
    [activeEvent]
  );

  // Apply single proposal from Co-Pilot
  const handleApplySingleProposal = useCallback(
    (proposal: CopilotOptimizationItem) => {
      updateCurrentEvent((event) => {
        const updatedBudget = event.budgetItems.map((item) => {
          if (item.category.toLowerCase().includes(proposal.categoryToAdjust.toLowerCase())) {
            const newActual = Math.max(0, item.quotedOrActual - proposal.amount);
            const status: BudgetItem['status'] = item.allocated > newActual ? 'under_budget' : item.allocated < newActual ? 'over_budget' : 'on_cap';
            return {
              ...item,
              quotedOrActual: newActual,
              status,
            };
          }
          return item;
        });

        return {
          ...event,
          budgetItems: updatedBudget,
        };
      });

      // Mark applied in copilot response
      setCopilotResponse((prev) => {
        if (!prev || !prev.proposals) return prev;
        return {
          ...prev,
          proposals: prev.proposals.map((p) => (p.id === proposal.id ? { ...p, applied: true } : p)),
        };
      });

      setAriaLiveMessage(`Applied AI recommendation: ${proposal.title} (-${activeEvent.currencySymbol}${proposal.amount.toLocaleString('en-IN')}).`);
    },
    [updateCurrentEvent, activeEvent.currencySymbol]
  );

  // Apply all proposals from Co-Pilot
  const handleApplyAllProposals = useCallback(
    (proposals: CopilotOptimizationItem[]) => {
      proposals.forEach((p) => {
        if (!p.applied) {
          handleApplySingleProposal(p);
        }
      });
      setAriaLiveMessage('Successfully applied all AI budget optimization recommendations.');
    },
    [handleApplySingleProposal]
  );

  // Create new event from wizard
  const handleCreateNewEvent = useCallback((newEvent: EventPlan) => {
    setEventsMap((prev) => ({
      ...prev,
      [newEvent.id]: newEvent,
    }));
    setActiveEventId(newEvent.id);
    setAriaLiveMessage(`Successfully created and activated new event "${newEvent.title}".`);
  }, []);

  // Open email drafter for vendor
  const handleOpenEmailDrafter = useCallback(
    (vendor?: VendorChecklistCard) => {
      setSelectedVendorForEmail(vendor);
      setShowEmailModal(true);
      if (!copilotResponse?.emailDraft) {
        handleCopilotPrompt(
          vendor ? `Draft inquiry email to ${vendor.name} for ${vendor.serviceCategory}` : 'Draft vendor inquiry email',
          'vendor_email'
        );
      }
    },
    [copilotResponse, handleCopilotPrompt]
  );

  return (
    <div className="bg-[#fbf9f5] min-h-screen text-[#1f2421] antialiased selection:bg-[#ff5e14] selection:text-white">
      {/* Screen-reader Live Announcer */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaLiveMessage}
      </div>

      {/* Global Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        activeEvent={activeEvent}
        onSelectEventType={handleSelectEventType}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        privacyMask={privacyMask}
        onTogglePrivacyMask={() => setPrivacyMask(!privacyMask)}
        onOpenNewEventWizard={() => setShowNewEventWizard(true)}
      />

      {/* Main App Content Area */}
      <div className="pl-0 lg:pl-[250px] transition-all">
        {/* Global Top Header */}
        <Header
          activeEvent={activeEvent}
          onOpenSimulator={() => setShowSimulatorModal(true)}
          onOpenDiagnostics={() => setActiveTab('diagnostics')}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          isCopilotOpen={isCopilotOpen}
          privacyMask={privacyMask}
          onExport={() => setShowExportModal(true)}
        />

        {/* Primary Page Container */}
        <main className="relative pt-20 px-4 sm:px-6 py-6 w-full max-w-[1600px] mx-auto min-h-screen">
          {/* VIEW: Diagnostics Suite */}
          {activeTab === 'diagnostics' ? (
            <DiagnosticsView onBackToDashboard={() => setActiveTab('overview')} />
          ) : (
            <div className="flex flex-col xl:flex-row items-start gap-6 w-full">
              {/* CENTER WORKSPACE (Cards & Tables) */}
              <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
                {/* Fallback Resilience Notification Banner */}
                {copilotResponse?.isFallback && (
                  <div className="p-3.5 bg-[#f0fdf4] border border-[#86efac] rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00875a] animate-pulse shrink-0" />
                      <span className="text-[#166534] font-semibold truncate">
                        {copilotResponse.fallbackNotice}
                      </span>
                    </div>
                    <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#166534] font-bold text-[11px] border border-[#bbf7d0]">
                      Deterministic Mode
                    </span>
                  </div>
                )}

                {/* 1. TOP KPI SUMMARY ROW (4 Bento Cards) */}
                <BudgetHealthCards
                  budgetSummary={budgetSummary}
                  tasks={activeEvent.timelineTasks}
                  vendors={activeEvent.vendors}
                  currencySymbol={activeEvent.currencySymbol}
                  privacyMask={privacyMask}
                  aiLatencyMs={aiLatencyMs}
                  lastAiSource={lastAiSource}
                />

                {/* 2. MIDDLE SPLIT ROW: Budget Table (58%) & Chronological Timeline (42%) */}
                <section aria-label="Financials and Production Milestones" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
                  <div className="lg:col-span-7">
                    <BudgetBreakdownTable
                      items={activeEvent.budgetItems}
                      summary={budgetSummary}
                      currencySymbol={activeEvent.currencySymbol}
                      privacyMask={privacyMask}
                      onTriggerRebalance={() => handleCopilotPrompt('Cut ₹2,00,000 from current budget without sacrificing guest hospitality', 'optimization')}
                      onAddItem={handleAddBudgetItem}
                      onDeleteItem={handleDeleteBudgetItem}
                      onUpdateItem={handleUpdateBudgetItem}
                      guestCount={activeEvent.guestCount}
                      onGuestCountChange={handleGuestCountChange}
                    />
                  </div>

                  <div className="lg:col-span-5">
                    <ChronologicalTimeline
                      tasks={activeEvent.timelineTasks}
                      targetDate={activeEvent.targetDate}
                      onToggleTask={handleToggleTask}
                      onAddTask={handleAddTimelineTask}
                      onTriggerRunSheetAI={() => handleCopilotPrompt('Generate detailed day-of hourly run-sheet for all ceremonies', 'run_sheet')}
                    />
                  </div>
                </section>

                {/* 3. BOTTOM SPLIT ROW: Vendor Checklists (50%) & Personalized Ideas Studio (50%) */}
                <section aria-label="Vendor Verification and Ideas Studio" className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                  <VendorChecklists
                    vendors={activeEvent.vendors}
                    currencySymbol={activeEvent.currencySymbol}
                    privacyMask={privacyMask}
                    onOpenEmailDrafter={handleOpenEmailDrafter}
                    onToggleChecklistItem={handleToggleVendorChecklistItem}
                  />

                  <PersonalizedIdeasStudio
                    ideas={activeEvent.personalizedIdeas}
                    eventTitle={activeEvent.title}
                    location={activeEvent.location}
                    guestCount={activeEvent.guestCount}
                    onAddIdeaToPlan={handleAddIdeaToPlan}
                    onRefreshIdeas={() => handleCopilotPrompt('Generate fresh personalized ideas for theme, food, entertainment, and eco-swaps', 'ideas')}
                    isLoading={isLoadingAi}
                  />
                </section>
              </div>

              {/* DOCKED RIGHT AI CO-PILOT ASSISTANT */}
              <AICoPilotDrawer
                isOpen={isCopilotOpen}
                onClose={() => setIsCopilotOpen(false)}
                copilotResponse={copilotResponse}
                isLoading={isLoadingAi}
                onSubmitPrompt={handleCopilotPrompt}
                onApplySingleProposal={handleApplySingleProposal}
                onApplyAllProposals={handleApplyAllProposals}
                latencyMs={aiLatencyMs}
                servedFromCache={lastAiSource === 'cache'}
              />
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      <NewEventWizardModal
        isOpen={showNewEventWizard}
        onClose={() => setShowNewEventWizard(false)}
        onCreateEvent={handleCreateNewEvent}
      />

      <VendorEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        selectedVendor={selectedVendorForEmail}
        emailDraft={copilotResponse?.emailDraft}
        eventTitle={activeEvent.title}
      />

      <GuestSimulatorModal
        isOpen={showSimulatorModal}
        onClose={() => setShowSimulatorModal(false)}
        activeEvent={activeEvent}
        onApplySimulatedBudget={handleApplySimulatedBudget}
        privacyMask={privacyMask}
      />

      <ExportSummaryModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        activeEvent={activeEvent}
        budgetSummary={budgetSummary}
      />
    </div>
  );
}
