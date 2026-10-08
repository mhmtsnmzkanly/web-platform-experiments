# Experiment 205: Journal — TYPO-METRIC // Accessible Modular Typographic Workstation

## Problem Statement & Mission

The goal of Experiment 205 is to design and build an authentic, genuinely useful **tool-oriented product interface** for a credible real-world user and task. Unlike previous experiments (201: space OS, 202: Haute Horlogerie pocket watch, 203: large-format camera obscura, 204: Op-Art gallery), this interface must serve an everyday professional need with 100% pure HTML and CSS—with **zero runtime JavaScript**.

Every primary action must produce an honest, observable result without faking backend calculations, pretend database saves, or inert mockups.

---

## Candidate Concepts & Evaluation

### Candidate 1: TYPO-METRIC // Accessible Modular Typographic Workstation (Selected)
- **Target User**: Front-end engineers, product designers, design system maintainers, and digital typographers.
- **Problem Solved**: Calibrating harmonious modular type scales, auditing vertical baseline rhythms, inspecting reading measures (45–75ch), validating WCAG contrast across light/dark themes, and exporting clean CSS custom property tokens for handoff.
- **Why Pure CSS Works Authentically**: Typography and layout are the native medium of the browser. Modular scale ratios (1.125, 1.200, 1.250, 1.333, 1.414, 1.618) can be calculated directly via CSS custom properties (`calc()`, `rem`). Native `contenteditable="true"` enables typing live copy directly into the specimen sheet. Native forms, radio selectors, and `:has()` manage workspace tabs and diagnostic overlays. A dedicated `@media print` stylesheet formats an immaculate design-token handoff folio.
- **Verdict**: Selected. Deepest alignment with native web platform capabilities, credible real-world value, and zero false claims.

### Candidate 2: AUDIT-FLOW // WCAG 2.2 Pre-Flight Accessibility & Quality Workbook
- **Target User**: QA testers, accessibility auditors, frontend leads before deployment.
- **Problem Solved**: Verifying WCAG 2.2 Level A/AA compliance across Perceivable, Operable, Understandable, and Robust criteria.
- **Evaluation**: Strong use of native checkboxes and CSS `counter-increment`, but checklist workflows can feel repetitive compared to an active typographic design tool.

### Candidate 3: BILL-CRAFT // Micro-Studio Commercial Invoice & Packing Spec Sheet
- **Target User**: Freelancers, independent contractors, design studios.
- **Problem Solved**: Generating clean, tax-compliant PDF commercial invoices without subscribing to SaaS platforms.
- **Evaluation**: Highly useful, but functionally narrower in interaction depth and responsive UI complexity than a design system workstation.

---

## Architectural Decisions & CSS Engineering

1. **Zero Runtime JavaScript Discipline**:
   - Exactly 0 `<script>` tags, zero inline event handlers, and zero external CDNs/fonts.
   - The tool relies on semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<fieldset>`, `<input type="radio">`, `<input type="checkbox">`, `<details>`, `<summary>`).

2. **Mathematical Modular Scale Engine in Pure CSS**:
   - Variables defined at `:root` for base size (`--font-base: 16px`) and scale ratio (`--scale-ratio: 1.25`).
   - Derived typographic tokens calculated hierarchically:
     - `--text-xs: calc(var(--font-base) / var(--scale-ratio));`
     - `--text-sm: var(--font-base);`
     - `--text-md: calc(var(--text-sm) * var(--scale-ratio));`
     - `--text-lg: calc(var(--text-md) * var(--scale-ratio));`
     - `--text-xl: calc(var(--text-lg) * var(--scale-ratio));`
     - `--text-2xl: calc(var(--text-xl) * var(--scale-ratio));`
     - `--text-3xl: calc(var(--text-2xl) * var(--scale-ratio));`
     - `--text-4xl: calc(var(--text-3xl) * var(--scale-ratio));`
   - Switching scale ratio radios immediately recomputes the entire specimen typography across all viewports.

3. **Substantive Workspace Views**:
   - **Tab 1: Hierarchical Scale Ladder**: Step-by-step type ladder from Display 3XL down to Micro Caption, with live token pills, computed rems, line-height ratios, and editable text fields (`contenteditable="true"`).
   - **Tab 2: In-Situ Editorial Article**: Real-world magazine/blog article testing heading contrast, paragraph lead, pull quote, multi-column body text, and footnotes.
   - **Tab 3: Product UI Components**: Testing the scale in real software UI (inputs, buttons, modal dialogs, status badges, tables, and form validation states).
   - **Tab 4: CSS Token Export**: Production-ready, copyable CSS `:root` block showing exact variables for developer handoff.

4. **Diagnostic Tooling (Toggles via CSS `:has()`)**:
   - **8px Baseline Grid Overlay**: Repeating linear gradient aligned with root line-height to verify vertical rhythm.
   - **Reading Measure Guide**: Rulers indicating 45ch, 65ch, and 75ch boundaries for optimal reading comfort.
   - **Token Metadata Badges**: Showing variable names and computed metrics.

5. **Production-Grade Print Stylesheet (`@media print`)**:
   - Conceals toolbars, tab navigation, and interactive chrome.
   - Re-formats the document into an authoritative, clean 2-page Design Token Handoff Folio suitable for PDF export or client binders.
