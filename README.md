# ProbViz — Statistics & Probability Visualizer

An interactive, educational tool for visualizing probability distributions. Enter parameters for
the Normal, t, Binomial, or Poisson distribution and see the probability, the shaded region on the
curve/PMF, and a step-by-step formula explanation.

> _"See the curve, understand the concept."_

## Version history

| Version | Change |
|---|---|
| 1.0 | Four distributions; probability from a value; shaded plot |
| 2.0 | Generated explanations; continuity correction; precision control |
| 2.1 | KaTeX typesetting; modular refactor; usage analytics |
| 2.2 | React + TypeScript + Tailwind rewrite; `user-scalable=no` removed (WCAG 1.4.4) |
| 2.3 | Explanation panel fixed for strict inequalities; k = 0 guard |
| 2.4 | Landing worked example; clickable examples; three more `between` forms; clear button; typography and palette refresh |

The displayed version lives in `src/lib/version.ts` and should match both
`package.json` and the release's git tag.

## Tech stack

Rebuilt (v2.2+) as a modern single-page app:

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives) — neutral design system, light/dark mode
- **Recharts** for the distribution plots (theme-aware)
- **jStat** for the statistical calculations
- **KaTeX** for rendering formulas

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  lib/
    stats.ts          # probability calculations (pure, framework-free)
    plot-data.ts      # curve / PMF data generators for the charts
    explanations.ts   # LaTeX formula + interpretation text
    types.ts          # shared types
    utils.ts          # cn() class-name helper
    use-chart-colors.ts
  components/
    ui/               # shadcn/ui primitives
    forms/            # one form per distribution
    tabs/             # Continuous / Discrete / About tabs
    DistributionPlot.tsx
    ExplanationPanel.tsx
    Katex.tsx
    theme-provider.tsx, mode-toggle.tsx
  App.tsx, main.tsx, index.css
```

## Deployment

The build output in `dist/` is a static site — deploy it to any static host.

The app builds at the **root base path** (`base: "/"`). To host under a GitHub Pages repo subpath
(e.g. `https://<user>.github.io/stats-probability-visualizer/`):

1. In `vite.config.ts`, set `base: "/stats-probability-visualizer/"`.
2. Update the GoatCounter `data-goatcounter` path in `index.html` if needed.

## Analytics

Uses [GoatCounter](https://www.goatcounter.com/) — a lightweight, privacy-friendly analytics
service (no personal data, no cross-site tracking). Configured via a script tag in `index.html`.

## Disclaimer

For educational use only. Always verify results with established statistical software before relying
on them for critical work. Created for students by Suriyati Ujang © 2025.
