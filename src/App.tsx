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
  UserProfile,
} from './types/event';
import { WEDDING_EVENT, BIRTHDAY_EVENT, COMMUNITY_EVENT } from './data/mockEvents';
import { calculateBudgetSummary, scaleBudgetByGuestCount } from './utils/budgetMath';
import { downloadTimelineIcs } from './utils/calendarIcs';
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
import { GoogleSignInModal } from './components/GoogleSignInModal';

export default function App() {
  // Master Event Repositories
  const [eventsMap, setEventsMap] = useState<Record<string, EventPlan>>({
    wedding: WEDDING_EVENT,
    birthday: BIRTHDAY_EVENT,
    community: COMMUNITY_EVENT,
  });

  const [activeEventId, setActiveEventId] = useState<string>('wedding');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');

  // User Profile & Authentication State (Persisted in localStorage)
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('celebrationos_user');
      return stored ? (JSON.parse(stored) as UserProfile) : null;
    } catch {
      return null;
    }
  });
  const [showSignInModal, setShowSignInModal] = useState<boolean>(false);

  // Theme (Dark / Light Mode)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('celebrationos_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  // Section Highlighting for Navigation
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null);

  // Accessibility & UI Toggles
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
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

  // Synchronize Dark / Light Mode with HTML documentElement & document.body
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem('celebrationos_theme', theme);
    } catch (err) {
      console.warn('Failed to save theme setting:', err);
    }
  }, [theme]);

  const handleToggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  // Smooth Scroll and Highlight Handler for Section Navigation
  const handleNavigateToSection = useCallback(
    (tab: ActiveTab) => {
      if (tab === 'diagnostics') {
        setActiveTab('diagnostics');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setAriaLiveMessage('Navigated to Diagnostics and Self-Tests suite.');
        return;
      }

      // If currently on diagnostics, return to overview dashboard view first
      if (activeTab === 'diagnostics') {
        setActiveTab(tab);
      } else {
        setActiveTab(tab);
      }

      // Allow DOM to render or switch views if coming from diagnostics
      setTimeout(() => {
        const targetElement = document.getElementById(`section-${tab}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setHighlightedSection(tab);
          setAriaLiveMessage(`Navigated and focused on ${tab} section.`);

          // Reset highlight glow after 2.4 seconds
          setTimeout(() => {
            setHighlightedSection(null);
          }, 2400);
        }
      }, 50);
    },
    [activeTab]
  );

  // Auto-detect active section during manual page scroll
  useEffect(() => {
    if (activeTab === 'diagnostics') return;
    const sectionIds: ActiveTab[] = ['overview', 'budget', 'timeline', 'vendors', 'ideas'];
    const onScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const id of sectionIds) {
        const el = document.getElementById(`section-${id}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [activeTab]);

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
        setShowSignInModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Authentication Handlers
  const handleSignIn = useCallback((profile: UserProfile) => {
    setUser(profile);
    try {
      localStorage.setItem('celebrationos_user', JSON.stringify(profile));
    } catch (err) {
      console.warn('Failed to save user session:', err);
    }
    setAriaLiveMessage(`Welcome, ${profile.name}! Signed in with Gmail.`);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem('celebrationos_user');
    } catch (err) {
      console.warn('Failed to remove user session:', err);
    }
    setAriaLiveMessage('Signed out of Google account.');
  }, []);

  // .ics Calendar Export Handler
  const handleExportIcs = useCallback(() => {
    downloadTimelineIcs(activeEvent);
    setAriaLiveMessage(`Exported ${activeEvent.title} timeline milestones to .ics file.`);
  }, [activeEvent]);

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
    <div className={`app-root ${theme === 'dark' ? 'dark' : ''} bg-[#fbf9f5] dark:bg-[#0b0816] min-h-screen text-[#1f2421] dark:text-[#f5f3ff] antialiased selection:bg-[#ff5e14] selection:text-white transition-colors duration-300`}>
      {/* Screen-reader Live Announcer */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {ariaLiveMessage}
      </div>

      {/* Global Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleNavigateToSection}
        activeEvent={activeEvent}
        onSelectEventType={handleSelectEventType}
        highContrast={highContrast}
        onToggleHighContrast={() => setHighContrast(!highContrast)}
        privacyMask={privacyMask}
        onTogglePrivacyMask={() => setPrivacyMask(!privacyMask)}
        onOpenNewEventWizard={() => setShowNewEventWizard(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main App Content Area */}
      <div className="pl-0 lg:pl-[250px] transition-all">
        {/* Global Top Header */}
        <Header
          activeEvent={activeEvent}
          onOpenSimulator={() => setShowSimulatorModal(true)}
          onOpenDiagnostics={() => handleNavigateToSection('diagnostics')}
          onToggleCopilot={() => setIsCopilotOpen(!isCopilotOpen)}
          isCopilotOpen={isCopilotOpen}
          privacyMask={privacyMask}
          onExport={() => setShowExportModal(true)}
          user={user}
          onOpenSignInModal={() => setShowSignInModal(true)}
          onSignOut={handleSignOut}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Primary Page Container */}
        <main className="relative pt-20 px-4 sm:px-6 py-6 w-full max-w-[1600px] mx-auto min-h-screen">
          {/* VIEW: Diagnostics Suite */}
          {activeTab === 'diagnostics' ? (
            <DiagnosticsView onBackToDashboard={() => handleNavigateToSection('overview')} />
          ) : (
            <div className="w-full flex flex-col gap-8">
              {/* Fallback Resilience Notification Banner */}
              {copilotResponse?.isFallback && (
                <div className="p-3.5 bg-[#f0fdf4] dark:bg-[#064e3b]/40 border border-[#86efac] dark:border-[#047857] rounded-xl flex items-center justify-between gap-3 text-xs shadow-xs animate-in fade-in">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00875a] dark:bg-[#10b981] animate-pulse shrink-0" />
                    <span className="text-[#166534] dark:text-[#a7f3d0] font-semibold truncate">
                      {copilotResponse.fallbackNotice}
                    </span>
                  </div>
                  <span className="shrink-0 px-2.5 py-0.5 rounded-full bg-[#dcfce7] dark:bg-[#064e3b] text-[#166534] dark:text-[#a7f3d0] font-bold text-[11px] border border-[#bbf7d0] dark:border-[#047857]">
                    Deterministic Mode
                  </span>
                </div>
              )}

              {/* 1. TOP KPI SUMMARY ROW (Overview Section) */}
              <section
                id="section-overview"
                aria-label="Overview KPI Summary"
                className={`w-full scroll-mt-24 transition-all duration-500 relative rounded-2xl ${
                  highlightedSection === 'overview'
                    ? 'ring-4 ring-[#ff5e14] shadow-[0_0_35px_rgba(255,94,20,0.35)] scale-[1.002]'
                    : ''
                }`}
              >
                {highlightedSection === 'overview' && (
                  <div className="absolute -top-3.5 right-6 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-[11px] font-bold shadow-md flex items-center gap-1 animate-pulse">
                    <span>✦ Active: Overview</span>
                  </div>
                )}
                <BudgetHealthCards
                  budgetSummary={budgetSummary}
                  tasks={activeEvent.timelineTasks}
                  vendors={activeEvent.vendors}
                  currencySymbol={activeEvent.currencySymbol}
                  privacyMask={privacyMask}
                  aiLatencyMs={aiLatencyMs}
                  lastAiSource={lastAiSource}
                />
              </section>

              {/* 2. BUDGET & KHARCHA SECTION: Full width to right */}
              <section
                id="section-budget"
                aria-label="Budget and Kharcha Breakdown"
                className={`w-full scroll-mt-24 transition-all duration-500 relative rounded-2xl ${
                  highlightedSection === 'budget'
                    ? 'ring-4 ring-[#ff5e14] shadow-[0_0_35px_rgba(255,94,20,0.35)] scale-[1.002]'
                    : ''
                }`}
              >
                {highlightedSection === 'budget' && (
                  <div className="absolute -top-3.5 right-6 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-[11px] font-bold shadow-md flex items-center gap-1 animate-pulse">
                    <span>✦ Active: Budget & Kharcha</span>
                  </div>
                )}
                <BudgetBreakdownTable
                  items={activeEvent.budgetItems}
                  summary={budgetSummary}
                  currencySymbol={activeEvent.currencySymbol}
                  privacyMask={privacyMask}
                  onTriggerRebalance={() =>
                    handleCopilotPrompt('Cut ₹2,00,000 from current budget without sacrificing guest hospitality', 'optimization')
                  }
                  onAddItem={handleAddBudgetItem}
                  onDeleteItem={handleDeleteBudgetItem}
                  onUpdateItem={handleUpdateBudgetItem}
                  guestCount={activeEvent.guestCount}
                  onGuestCountChange={handleGuestCountChange}
                />
              </section>

              {/* 3. CHRONOLOGICAL TIMELINE SECTION: Brought below Budget & Kharcha, full width */}
              <section
                id="section-timeline"
                aria-label="Production Milestones and Run-Sheet"
                className={`w-full scroll-mt-24 transition-all duration-500 relative rounded-2xl ${
                  highlightedSection === 'timeline'
                    ? 'ring-4 ring-[#ff5e14] shadow-[0_0_35px_rgba(255,94,20,0.35)] scale-[1.002]'
                    : ''
                }`}
              >
                {highlightedSection === 'timeline' && (
                  <div className="absolute -top-3.5 right-6 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-[11px] font-bold shadow-md flex items-center gap-1 animate-pulse">
                    <span>✦ Active: Timeline & Run-Sheet</span>
                  </div>
                )}
                <ChronologicalTimeline
                  tasks={activeEvent.timelineTasks}
                  targetDate={activeEvent.targetDate}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTimelineTask}
                  onTriggerRunSheetAI={() =>
                    handleCopilotPrompt('Generate detailed day-of hourly run-sheet for all ceremonies', 'run_sheet')
                  }
                  onExportIcs={handleExportIcs}
                />
              </section>

              {/* 4. VENDOR CHECKLISTS SECTION: Expanded size, full width */}
              <section
                id="section-vendors"
                aria-label="Vendor Due-Diligence and Deliverables"
                className={`w-full scroll-mt-24 transition-all duration-500 relative rounded-2xl ${
                  highlightedSection === 'vendors'
                    ? 'ring-4 ring-[#ff5e14] shadow-[0_0_35px_rgba(255,94,20,0.35)] scale-[1.002]'
                    : ''
                }`}
              >
                {highlightedSection === 'vendors' && (
                  <div className="absolute -top-3.5 right-6 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-[11px] font-bold shadow-md flex items-center gap-1 animate-pulse">
                    <span>✦ Active: Vendor Checklists</span>
                  </div>
                )}
                <VendorChecklists
                  vendors={activeEvent.vendors}
                  currencySymbol={activeEvent.currencySymbol}
                  privacyMask={privacyMask}
                  onOpenEmailDrafter={handleOpenEmailDrafter}
                  onToggleChecklistItem={handleToggleVendorChecklistItem}
                />
              </section>

              {/* 5. PERSONALIZED IDEAS SECTION: Brought below Vendor Checklists, full width */}
              <section
                id="section-ideas"
                aria-label="Personalized Ideas Studio"
                className={`w-full scroll-mt-24 transition-all duration-500 relative rounded-2xl ${
                  highlightedSection === 'ideas'
                    ? 'ring-4 ring-[#ff5e14] shadow-[0_0_35px_rgba(255,94,20,0.35)] scale-[1.002]'
                    : ''
                }`}
              >
                {highlightedSection === 'ideas' && (
                  <div className="absolute -top-3.5 right-6 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#ff5e14] to-[#ff8a00] text-white text-[11px] font-bold shadow-md flex items-center gap-1 animate-pulse">
                    <span>✦ Active: Personalized Ideas Studio</span>
                  </div>
                )}
                <PersonalizedIdeasStudio
                  ideas={activeEvent.personalizedIdeas}
                  eventTitle={activeEvent.title}
                  location={activeEvent.location}
                  guestCount={activeEvent.guestCount}
                  onAddIdeaToPlan={handleAddIdeaToPlan}
                  onRefreshIdeas={() =>
                    handleCopilotPrompt('Generate fresh personalized ideas for theme, food, entertainment, and eco-swaps', 'ideas')
                  }
                  isLoading={isLoadingAi}
                />
              </section>
            </div>
          )}

          {/* DOCKED RIGHT AI CO-PILOT ASSISTANT (Slide-Over Panel) */}
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
        </main>
      </div>

      {/* MODALS */}
      <GoogleSignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
        onSignIn={handleSignIn}
        currentUser={user}
      />

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
