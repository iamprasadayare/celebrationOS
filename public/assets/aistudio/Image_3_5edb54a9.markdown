---
name: CelebrationOS Editorial System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464554'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777586'
  outline-variant: '#c7c4d7'
  surface-tint: '#5148d7'
  primary: '#2a14b4'
  on-primary: '#ffffff'
  primary-container: '#4338ca'
  on-primary-container: '#c1beff'
  inverse-primary: '#c3c0ff'
  secondary: '#006c4e'
  on-secondary: '#ffffff'
  secondary-container: '#97f5cc'
  on-secondary-container: '#007353'
  tertiary: '#632900'
  on-tertiary: '#ffffff'
  tertiary-container: '#873b00'
  on-tertiary-container: '#ffb389'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#100069'
  on-primary-fixed-variant: '#372abf'
  secondary-fixed: '#97f5cc'
  secondary-fixed-dim: '#7bd8b1'
  on-secondary-fixed: '#002115'
  on-secondary-fixed-variant: '#00513a'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68e'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#763300'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  mono-data:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, high-contrast editorial SaaS aesthetic tailored for sophisticated event production and timeline orchestration. The visual language merges publication-grade typography with rigorous operational utility.

- **Brand Personality**: Polished, precise, composed, and architectural. It replaces chaotic party-planning tropes with the decisive clarity of an executive control room and the timeless polish of high-end editorial media.
- **Target Audience**: Professional event directors, hospitality managers, wedding orchestrators, and large-scale experiential producers requiring high data density alongside visual poise.
- **Emotional Response**: Supreme operational calm, clarity under temporal pressure, and understated luxury.
- **Design Movement**: Modern Editorial Minimalism blended with Utilitarian SaaS. Visual weight is communicated strictly via pure contrast, hairline borders, and purposeful hierarchy rather than gratuitous drop shadows or skeuomorphic styling.

## Colors

The palette is engineered around high structural contrast and strict WCAG AAA/AA readability standards (>7:1 contrast ratio across primary copy).

- **Canvas & Surfaces**:
  - Main Canvas (`surface-ground`): `#F8FAFC` (Alabaster Slate) creates a soft, luminous matte backdrop that prevents eye strain during prolonged operational workflows.
  - Cards & Containers (`surface-card`): `#FFFFFF` (Pure White) elevated strictly via crisp perimeter containment.
  - Structural Hairlines (`border-subtle`): `#CBD5E1` (Crisp Slate), providing distinct boundary definition without visual noise.
- **Typography & Content**:
  - Primary Text: `#0F172A` (Deep Slate) delivering near-maximum contrast against white and alabaster surfaces.
  - Secondary Text / Metadata: `#475569` (Muted Slate) for timestamps, secondary labels, and structural column headings.
- **Accents & Roles**:
  - Primary Action: `#4338CA` (Deep Indigo) with `#3730A3` for hover and active interaction states.
  - Success / Confirmed: `#047857` (Emerald), calibrated for schedule milestones and completed vendor contracts.
  - Warning / Pending: `#B45309` (Warm Amber), designating RSVP thresholds and impending deadlines.
  - Critical / Overdue: `#B91C1C` (Crimson), designating budget discrepancies, contract alerts, or run-of-show timing collisions.
  - Interactive Focus: `2px solid #4338CA` with a `2px` offset (`#FFFFFF`) for unambiguous keyboard accessibility.

## Typography

Typography pairs geometric editorial distinction with high-utility legibility.

- **Headlines (Plus Jakarta Sans)**: Used for major views, section dividers, and event titles. Employs tight negative letter-spacing to reinforce architectural posture and editorial presence.
- **Interface & Tabular Data (Inter)**: Applied across all data tables, run-of-show runtimes, financial values, and control labels. Numeric displays must enable tabular lining (`font-feature-settings: 'tnum' on, 'cv05' on`) to ensure perfect vertical alignment across multi-line itineraries and vendor ledgers.
- **Labels & Overlines**: Rendered in uppercase or semi-bold medium weights with slight positive tracking (`0.04em`) to establish visual separation between metadata and user-entered content.

## Layout & Spacing

The system enforces a 12-column responsive fluid grid anchored by structural rhythm and clear boundaries.

- **Desktop (1024px+)**: 12-column grid with `2rem` outer margins and `1.5rem` gutters. Content containers cap at a max-width of `1440px` for ultra-wide monitors, remaining horizontally centered.
- **Tablet (768px - 1023px)**: 8-column layout with `1.5rem` margins and `1rem` gutters. Split-pane schedule views collapse into layered drawers or tabbed panes.
- **Mobile (<768px)**: 4-column layout with `1rem` margins and `0.75rem` gutters. Primary workflows prioritize vertical stacking and sticky action trays.
- **Spacing Cadence**: All spatial distances use a strict 4px/8px modular scale. Spacing tokens govern internal padding and margins between unrelated structural regions to prevent cognitive clutter.

## Elevation & Depth

Visual hierarchy is communicated through **structural containment and low-contrast outlines** rather than simulated 3D drop shadows.

- **Surface Separation**: Pure `#FFFFFF` containers rest directly on `#F8FAFC` alabaster canvas. Boundary definition is achieved using a 1px solid `#CBD5E1` border.
- **Elevation Levels**:
  - *Base*: Flat canvas `#F8FAFC`.
  - *Tier 1 (Cards, Modules)*: `#FFFFFF` background, 1px `#CBD5E1` border, no shadow.
  - *Tier 2 (Popovers, Dropdowns, Date Pickers)*: `#FFFFFF` background, 1px `#CBD5E1` border, supported by an ultra-diffused atmospheric shadow: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.
  - *Tier 3 (Modals, Orchestration Trays)*: Centered or docked sheets with `1px #CBD5E1` borders, backed by a high-contrast dark scrim: `rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(2px)`.
- **States**: Hover states shift borders from `#CBD5E1` to `#94A3B8` without artificially elevating the Y-axis.

## Shapes

The interface balances sharp editorial discipline with modern software usability through a controlled radius hierarchy (`roundedness: 2`).

- **Base Components**: Inputs, standard buttons, tabular cells, and alert badges use `0.5rem` (8px).
- **Cards & Data Modules**: Surfaces use `1rem` (16px, `rounded-lg`) to enclose related event modules.
- **Major Contextual Containers**: Large modal viewports, flyout summary sheets, and highlighted itinerary blocks scale to `1.5rem` (24px, `rounded-xl`).
- **Interactive Touch Targets**: Must honor a strict minimum interactive dimension of 44px × 44px on touch viewports, regardless of internal visual padding.

## Components

- **Buttons**:
  - *Primary*: `#4338CA` background, `#FFFFFF` text, `0.5rem` radius, minimum height of 44px. Hover state: `#3730A3`. Active: `#312E81`.
  - *Secondary / Outline*: `#FFFFFF` background, 1px solid `#CBD5E1`, `#0F172A` text. Hover: `#F1F5F9` background, `#94A3B8` border.
  - *Focus*: Outer ring of `2px solid #4338CA` with `2px` offset.
- **Input Fields & Selectors**:
  - Height: 44px. Background: `#FFFFFF`. Border: 1px solid `#CBD5E1`.
  - Text: `#0F172A`, Placeholder: `#94A3B8`.
  - Focus State: Border color switches directly to `#4338CA` with a 1px matching box-shadow glow or 2px outline.
- **Badges & Status Chips**:
  - Always pair a 14px vector icon with structured text for dual-channel recognition.
  - *Confirmed*: Background `#ECFDF5`, text `#047857`, border 1px solid `#A7F3D0`.
  - *Pending*: Background `#FFFBEB`, text `#B45309`, border 1px solid `#FDE68A`.
  - *Critical*: Background `#FEF2F2`, text `#B91C1C`, border 1px solid `#FECACA`.
  - *Neutral*: Background `#F1F5F9`, text `#334155`, border 1px solid `#E2E8F0`.
- **Cards & Event Modules**:
  - Background `#FFFFFF`, 1px solid `#CBD5E1`, border radius `1rem` (`rounded-lg`). Internal padding: `1.5rem`.
  - Headers feature geometric Plus Jakarta Sans titles accented by right-aligned action buttons or metadata chips.
- **Lists & Data Tables**:
  - Horizontal rules styled with 1px `#E2E8F0`. Row heights minimum 48px to satisfy accessible tap and scanning targets.
  - Numeric columns, run times, and financial budgets rendered in Inter with tabular digits.
- **Checkboxes & Radios**:
  - 20px × 20px dimensions with a 44px tap buffer. Border: 1.5px solid `#94A3B8`. Checked state: `#4338CA` fill with pure white tickmark or radial dot.