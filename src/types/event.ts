/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type EventType = 'wedding' | 'birthday' | 'community';

export type PriorityLevel = 'high' | 'medium' | 'low';

export type TaskBucket = '6_months_out' | '3_months_out' | '1_month_out' | 'week_of' | 'day_of';

export interface BudgetItem {
  id: string;
  category: string;
  name: string;
  allocated: number;
  quotedOrActual: number;
  paid: number;
  status: 'under_budget' | 'on_cap' | 'over_budget';
  perHeadScalingRatio?: number; // 0 to 1 ratio determining how this item scales with guest count (e.g. 0.9 for catering, 0.1 for venue)
  notes?: string;
}

export interface BudgetCategorySummary {
  category: string;
  allocated: number;
  quotedOrActual: number;
  paid: number;
  variance: number; // allocated - quotedOrActual (positive = savings, negative = overrun)
  status: 'under_budget' | 'on_cap' | 'over_budget';
  itemCount: number;
}

export interface BudgetSummary {
  totalBudgetCap: number;
  totalAllocated: number;
  totalQuotedOrActual: number;
  totalPaid: number;
  unallocatedReserve: number;
  netConsolidatedSurplus: number; // totalAllocated - totalQuotedOrActual
  percentConsumed: number;
  percentReserveSafe: number;
  isOverBudget: boolean;
  categories: BudgetCategorySummary[];
  overrunCategories: string[];
}

export interface TimelineTask {
  id: string;
  title: string;
  phase: TaskBucket;
  daysBeforeEvent: number; // relative integer offset: 90 = 90 days before, 0 = day of
  dueTimeOfDay?: string; // e.g. "10:00 AM" for day-of tasks
  priority: PriorityLevel;
  completed: boolean;
  assignedVendorOrLead?: string;
  details?: string;
  metrics?: string; // e.g. "218 / 250 dietary responses"
  actionLabel?: string;
  actionUrl?: string;
}

export interface VendorChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  type: 'contract' | 'deposit' | 'safety_or_backup' | 'custom';
  meta?: string;
}

export interface VendorChecklistCard {
  id: string;
  name: string;
  serviceCategory: string;
  capAmount: number;
  depositAmount: number;
  paidAmount: number;
  status: 'booked' | 'shortlisted' | 'pending';
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  checklist: VendorChecklistItem[];
  notes?: string;
  complianceCertified: boolean;
}

export interface PersonalizedIdea {
  id: string;
  title: string;
  category: 'theme_decor' | 'food_beverage' | 'entertainment_icebreakers' | 'cost_eco_swaps';
  tags: string[];
  description: string;
  costImpactDollars: number; // positive = add-on, negative = savings
  impactSummary: string; // e.g. "Impact: -$300 variance savings"
  recommendedBudgetItem?: {
    category: string;
    name: string;
    allocated: number;
    quotedOrActual: number;
  };
  recommendedTimelineTask?: {
    title: string;
    phase: TaskBucket;
    daysBeforeEvent: number;
    priority: PriorityLevel;
  };
  applied?: boolean;
}

export interface EventPlan {
  id: string;
  type: EventType;
  title: string;
  targetDate: string; // ISO format "2026-11-18"
  location: string;
  guestCount: number;
  baselineBudgetCap: number;
  currencySymbol: string;
  budgetItems: BudgetItem[];
  timelineTasks: TimelineTask[];
  vendors: VendorChecklistCard[];
  personalizedIdeas: PersonalizedIdea[];
  contextNote?: string;
}

export interface CopilotOptimizationItem {
  id: string;
  title: string;
  amount: number; // positive savings value e.g. 1100
  description: string;
  categoryToAdjust: string;
  applied?: boolean;
}

export interface AICoPilotResponse {
  type: 'optimization' | 'run_sheet' | 'vendor_email' | 'ideas' | 'general_chat';
  headline: string;
  summary: string;
  proposals?: CopilotOptimizationItem[];
  runSheetTasks?: Partial<TimelineTask>[];
  emailDraft?: {
    recipientRole: string;
    subject: string;
    body: string;
    keyPoints: string[];
  };
  generatedIdeas?: PersonalizedIdea[];
  rawText?: string;
  servedFromCache?: boolean;
  latencyMs?: number;
  isFallback?: boolean;
  fallbackNotice?: string;
}

export interface TestResult {
  id: number;
  title: string;
  category: 'Budget Math' | 'Timeline Engine' | 'Security & Sanitization' | 'Schema Validator' | 'Efficiency' | 'Problem Alignment';
  description: string;
  passed: boolean;
  executionTimeMs: number;
  details: string;
  expected: string;
  received: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role?: string;
  verifiedEmail: boolean;
  provider: 'google' | 'gmail_manual';
  authTimestamp: string;
}

