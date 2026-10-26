# CelebrationOS — GenAI Event Planning Assistant

**CelebrationOS** is a production-grade, accessible GenAI event planning orchestrator built for Indian celebrations (Weddings, Milestone Birthdays, and Community Utsavs). It synchronizes budget governance, chronological milestone schedules, vendor due-diligence, and creative planning into a unified reactive platform powered by Google Gemini.

---

## 1. Chosen Vertical
**Event & Celebration Operations (Indian Celebratory Market)**
- **Indian Wedding ("Shaadi") Mode**: Multi-ceremony timeline (Mehendi, Sangeet, Haldi, Baraat, Pheras, Reception), ₹25,00,000 budget cap, and vendor logistics.
- **Milestone Birthday Mode**: "Maya's 30th Celebration" with 60 guests, ₹4,50,000 budget cap, cocktail batching, and entertainment run-sheet.
- **Community Gathering Mode**: "Greenwood Cultural & Charity Fest" for 500 attendees, ₹12,00,000 budget, volunteer rosters, and municipal compliance.

---

## 2. Approach & Architecture
CelebrationOS is architected on **deterministic computation paired with autonomous AI orchestration**:
- **Deterministic Pure-Math Core (`budgetMath.ts`, `timelineMath.ts`)**: All sums, variances, per-head elasticity scaling, and chronological $T$-minus offsets are calculated mathematically in TypeScript with zero LLM rounding errors or hallucinations.
- **State-Synchronized Architecture**: A single unified `EventPlan` reactive state drives the 4 core pillars:
  1. **Budget Tracker & What-If Elasticity Simulator**: Categorized line-item tracking (`Allocated`, `Quoted/Actual`, `Paid`, `Status`) with dynamic guest scaling.
  2. **Chronological Milestone & Day-Of Run-Sheet**: Integer day-offset engine dynamically adjusting deadlines whenever the master event date shifts.
  3. **Vendor Due-Diligence Checklists**: Verification workflows (FSSAI licenses, 10 PM sound curfew, backup power, advance settlement discounts).
  4. **Personalized Ideas Studio**: Structured recommendations across Themes, F&B, Entertainment, and Cost/Eco-swaps with 1-click addition into active Budget and Timeline.

---

## 3. How the Solution Works
1. **Event Mode Switcher & AI Wizard**: Users can explore pre-populated templates or launch the "+ New Event with AI" wizard to generate custom plans.
2. **AI Co-Pilot Integration**: A server-side Express proxy (`/api/ai/copilot`) communicates securely with `@google/genai` using structured JSON schemas (`Type.OBJECT`).
3. **Prompt Caching & Resilience**: `sessionStorage` caching keyed by prompt payload delivers instant (<5ms) cached responses and saves tokens. If the network or quota is restricted, a smart deterministic engine takes over seamlessly with clear status badges.
4. **Interactive Diagnostics Suite**: Built-in 12-assertion automated test runner with microsecond benchmarks and a live PII Redaction & XSS Sanitizer sandbox.

---

## 4. Key Assumptions Made
1. **Currency & Locale**: Standardized on INR (`₹`) formatted with `en-IN` grouping (Lakhs and Crores).
2. **Hybrid Cost Elasticity**: Line items feature individual scaling ratios (e.g., F&B scales linearly with headcounts, whereas Venue and AV rentals remain fixed).
3. **Privacy First**: Sensitive contact information (phone numbers, emails) is masked client-side before any prompt reaches an LLM.

---

## 5. Evaluation Focus Areas

### Code Quality
- Modular TypeScript structure with zero `any` types.
- Pure functions separated from UI components.
- Responsive, clean interface styled with Tailwind CSS in an Indian celebratory palette (Royal Violet, Marigold Saffron, Gulabi Pink, and Emerald Green).

### Security
- **Prompt Injection Defense**: Strips override patterns and trims payloads to 1,500 characters (`securitySanitizer.ts`).
- **PII Shield**: Regex redaction replacing emails with `[REDACTED_EMAIL]` and phone numbers with `[REDACTED_PHONE]`.
- **Privacy Mask**: Header toggle masking sensitive figures for screen sharing with external vendors.

### Efficiency
- Sub-5ms response times via structured `sessionStorage` hashing.
- Compact context summarization reducing token consumption.
- Zero client-side API key exposure (server-side proxy).

### Testing
- Automated 12-assertion diagnostics suite testing budget arithmetic, schedule offsets, cache key generation, and PII filters.
- Real-time interactive sanitizer sandbox for evaluator verification.

### Accessibility (WCAG 2.1 AA)
- High-Contrast mode toggle (`.high-contrast` styling).
- Accessible keyboard navigation (`Escape` closes all modals, full tab indexing).
- Semantic tables with `<th scope="col">` and ARIA live regions for screen-reader announcements.

---

## Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express, `@google/genai` (`gemini-2.5-flash`, `gemini-3.8-flash`).
- **Build**: Vite.
