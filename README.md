# SpendIQ

AI-powered expense analyzer. Upload a CSV of expenses and get a rich visual analysis — not just text, but tables, charts, flags, and savings recommendations.

**Built for [Overclock AI Operations Accelerator](https://overclockaccelerator.com) — Unit 4: AI-Powered Applications (Demo 2)**

## What It Does

SpendIQ takes your expense data (CSV upload, paste, or plain text description) and uses AI to analyze it. The key difference from a regular chatbot: the AI returns **structured JSON**, and the app renders that data as purpose-built visual components.

- **Expense Table** — Every transaction categorized with color-coded flags (overspending, duplicate, cuttable)
- **Category Breakdown** — Spending by category with progress bars and percentages
- **Summary Cards** — Total spend, transaction count, flagged items, potential savings at a glance
- **Savings Panel** — Prioritized opportunities to cut spending
- **Raw JSON Toggle** — See the exact structured data the AI returned that powers the UI above
- **Sample Data** — 36-transaction sample CSV for instant demo
- 8 models across 3 providers (Anthropic, OpenAI, OpenRouter)

## Why It Exists

This is Demo 2 in a three-part progression showing how AI can be embedded inside applications:

1. **[SimplyAI](https://github.com/Overclock-Accelerator/SimplyAI)** — AI returns text, app displays text
2. **SpendIQ** (this app) — AI returns structured JSON, app renders rich visual components
3. **[FinancialModeler IQ](https://github.com/Overclock-Accelerator/FinancialModeler-IQ)** — AI is deeply integrated with multiple tool calls, interactive computation, and research

The teaching point: **same API call, wildly different application.** The value of AI in an app isn't the model — it's what you build around the model's output.

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- TypeScript 5
- Multi-provider LLM caller (Anthropic, OpenAI, OpenRouter)

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add at least one API key
4. Run the dev server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
OPENROUTER_API_KEY=sk-or-...
```

At least one provider key is required. Add more to unlock additional models in the dropdown.

## Live Demo

[spendiq-ochre.vercel.app](https://spendiq-ochre.vercel.app)
