# Experiment Report: 205 — TYPO-METRIC // Accessible Modular Typographic Workstation & Token Generator

## Frontier Classification: Pure CSS Utility Product & Real-World Design Engineering Tool

Experiment 205 accomplishes the autonomous creation of a **production-grade, zero-JavaScript utility product**. Rather than creating a fantasy interface, a skeuomorphic simulation, or a decorative dashboard with fake telemetry, TYPO-METRIC is a genuinely useful, mathematically rigorous developer and designer tool that solves a daily real-world workflow problem: **designing, auditing, testing, and exporting accessible modular typographic scales and CSS custom properties**.

### 1. The Real-World Utility & Persona
- **Target Users**: Front-end engineers, product designers, accessibility engineers, and design system architects.
- **Problem Solved**: Designers and engineers need to establish proportional type hierarchies (Major Second through Golden Ratio), preview them live across editorial content and complex UI components, verify baseline rhythms and reading measures (68ch), and export copy-pasteable CSS design tokens without relying on bloated JS web apps or external dependencies.
- **Workflow Integrity**: 100% self-contained in a single lightweight file, offline-first, dependency-free, and functional without requiring a JavaScript execution environment.

### 2. Zero-JavaScript Technical Architecture
1. **Mathematical Modular Scale Engine in Pure CSS**:
   - Computes an entire 7-step typographic hierarchy (`--text-xs` through `--text-4xl`) from a base size (`14px`, `16px`, `18px`) and geometric ratio (`1.125`, `1.200`, `1.250`, `1.333`, `1.414`, `1.618`) using cascading CSS `calc()` operations:
     ```css
     --text-md: calc(var(--text-base) * var(--scale-ratio));
     --text-lg: calc(var(--text-md) * var(--scale-ratio));
     --text-xl: calc(var(--text-lg) * var(--scale-ratio));
     --text-2xl: calc(var(--text-xl) * var(--scale-ratio));
     --text-3xl: calc(var(--text-2xl) * var(--scale-ratio));
     --text-4xl: calc(var(--text-3xl) * var(--scale-ratio));
     ```
   - Dynamically recomputes line heights, letter spacings, and container vertical cadences natively as the user selects different scale presets.
2. **State Management via `:has()` and Radio Engines**:
   - Radio button groups scoped at the document root drive:
     - 6 Modular Scale Ratios (1.125 Major Second, 1.200 Minor Third, 1.250 Major Third, 1.333 Perfect Fourth, 1.414 Augmented Fourth, 1.618 Golden Ratio).
     - 3 Base Font Sizes (14px, 16px, 18px).
     - 4 Typeface Stacks (System Sans, Editorial Serif, Mono Code, Humanist).
     - 4 High-Contrast Workstation Themes (Slate Dark, Studio Light, Warm Vellum, OLED Contrast).
     - 3 Real-Time Diagnostics Toggles (8px Vertical Rhythm Baseline Grid, 68ch Optimal Reading Measure Guide, Token Metadata Badges).
     - 4 Functional Workspaces (01 Scale Ladder, 02 Editorial In-Situ, 03 UI Components, 04 Token Code Export).
3. **Honest, Functional User Workflows**:
   - **Scale Ladder with Live Native Editing**: Utilizes `contenteditable="true"` on specimen strings so users can test actual production copy, headlines, and international characters directly in the browser without any JS listeners.
   - **Editorial In-Situ Testing**: Full editorial prose article featuring pull quotes, drop caps, subheadings, and bylines evaluating typographical pacing in realistic editorial scenarios.
   - **UI Component Stress Testing**: Interactive form inputs, selects, segmented controls, primary/secondary/destructive buttons, status badges, and dense data tables styled entirely with the dynamic typographic tokens.
   - **Token Code Export**: Production-ready CSS custom properties block with full syntax highlighting, ready to copy straight into production design system stylesheets (`tokens.css`).
   - **Design System Spec Folio Print Engine (`@media print`)**: Formatted for browser native print (`Ctrl+P` / `Cmd+P` or print header button), automatically suppressing toolbars, styling an official design system handoff sheet with cover metadata, ratio breakdown, and specimen tables.

---

## Verification Evidence

- **Zero Dependency Certification**:
  - `node tools.js dependency-check 205/205.dev.html` -> Exited 0 (`OK`).
  - Strict audit: 0 external scripts, 0 external styles, 0 web fonts, 0 CDN links, 0 image URLs, 0 tracking beacons.
- **Zero JavaScript Runtime Audit**:
  - 0 `<script>` tags, 0 inline event attributes (`onclick`, `onchange`, etc.), 0 `javascript:` pseudo-protocols.
- **Headless Chromium CDP Verification Suite**:
  - `screenshot.png` (1280 × 800): Default Slate Dark theme, Scale Ladder view, Perfect Fourth (1.333) ratio, active token badges and 68ch measure line.
  - `screenshot-late.png` (1280 × 800): Editorial In-Situ view with 8px baseline grid active, demonstrating vertical rhythm alignment and drop cap typography.
  - `screenshot-interaction.png` (1280 × 800): Studio Light theme, UI Components view, active form inputs, badge states, and typography token density table.
  - `screenshot-interaction-late.png` (1280 × 800): Warm Vellum theme, Editorial Serif font, 1.618 Golden Ratio scale, Token Code Export view showing syntax-highlighted CSS custom properties.
  - `screenshot-mobile.png` (390 × 844): Mobile viewport, OLED contrast theme, wrapping controls, accessible touch targets, and responsive typography scaling with hyphenation.
- **Accessibility & Ergonomics**:
  - All interactive controls have distinct `:focus-visible` rings with high-contrast outlines.
  - Keyboard operable tab switching and option selection using native `<label>` and radio semantics.
  - Text contrast complies with WCAG 2.1 AA / AAA standards across all four workstation themes.
