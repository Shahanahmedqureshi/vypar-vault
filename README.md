<div align="center">

# ⚡ Voice2Vault OS

### *VyaparVault ERP — a multi-agent AI workforce for Indian small businesses & mandis*

**Speak or snap a kachha bill in Hinglish. Get a verified voucher, a caught math error, and a ready-to-scan UPI QR.**

![Gemma 4](https://img.shields.io/badge/Model-Gemma%204%20(26B--A4B--IT)-4285F4?logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## 📖 Overview

Small traders in India still run their business on handwritten **kachha bills**, voice notes and a paper **khata**. Mistakes creep in, such as a wrong balance, a duplicate entry or an unnoticed credit-limit breach, and nobody catches them until the money is already lost.

**Voice2Vault OS** is an autonomous, multi-agent system that turns that messy input into clean, auditable accounting records:

- 🎙️ Takes a **Hinglish text, voice note or photo of a handwritten bill**
- 🧠 A **Planner Agent** (Google Gemma 4) breaks the request into a task graph
- 🤖 Specialist **worker agents** extract, audit, record, risk-check and collect
- 🛡️ **Pure deterministic code** does every calculation, never the LLM
- ✋ A **human approval gate** stops anything risky before it is committed

> Gemma 4 is an open-weight model, so it can be self-hosted to keep business data on your own infrastructure. This build calls the model through the Gemini API.

---

## ✨ Key Features

| Feature | What it does |
|---|---|
| **Multimodal intake** | Accepts Hinglish text, voice (browser Web Speech API, `hi-IN`) and handwritten bill photos (OCR). |
| **Forensic math audit** | Checks `Total − Paid == Stated Pending` deterministically and flags any mismatch. |
| **Auto-generated vouchers** | Writes verified vouchers to the ledger with an idempotency key, so duplicates are blocked. |
| **Credit-risk check** | Computes exposure ratio and compares it to each customer's credit limit. |
| **Instant UPI QR** | Renders a pre-filled UPI payment QR client-side for quick settlement. |
| **WhatsApp digital parchi** | Drafts a receipt message in an outbox, and **never auto-sends**. |
| **Human-in-the-loop** | Pauses on math mismatch, high risk, uncertain intake, limit breach and outbox release. |
| **Live DAG visualizer** | Shows the task graph in real time, with status colors, timings and dependencies. |
| **Excel / CSV export** | Client-side `.xlsx` and `.csv` export through SheetJS. |
| **Failure-handling demo** | Simulates tool failure and model rate limits to show recovery with exponential backoff. |
| **Judge Mode** | Auto-runs the three demo scenarios in sequence, pausing at approval gates. |

---

## 🏗️ Architecture

```
Request (Hinglish Text / Voice / Photo)
                  │
                  ▼
          ┌───────────────┐
          │ Planner Agent │  (Gemma → strict JSON DAG plan)
          └───────┬───────┘
                  │
                  ▼
          ┌───────────────┐
          │   Task DAG    │  (topological order + parallelism)
          └───────┬───────┘
                  │
                  ▼
       ┌───────────────────────┐        ┌───────────────────────┐
       │     Worker Agents     │ <────> │ Tools (Simulated DB)  │
       │ ├── Intake Agent      │        │ ├── lookup_price      │
       │ ├── Auditor Agent     │        │ ├── search_customer   │
       │ ├── Ledger Agent      │        │ ├── audit_math        │
       │ ├── Risk Agent        │        │ ├── calc_credit_risk  │
       │ ├── Collections Agent │        │ ├── write_voucher     │
       │ └── Reporter Agent    │        │ └── update_inventory  │
       └──────────┬────────────┘        └───────────────────────┘
                  │
                  ▼
       ┌───────────────────────┐
       │      Supervisor       │  (deterministic state machine + retries)
       └──────────┬────────────┘
                  │
                  ▼
       ┌───────────────────────┐
       │ Human Approval Policy │  (math mismatch / high risk / outbox)
       └──────────┬────────────┘
                  │
                  ▼
               Outputs
       ├── Master Ledger & Vouchers   (IndexedDB)
       ├── Pre-filled UPI QR          (client-side)
       ├── WhatsApp Digital Parchi    (draft outbox)
       └── Excel / CSV Export         (SheetJS)
```

### Design principles

1. **The LLM never does arithmetic.** Gemma plans, extracts and explains. All money math runs in plain TypeScript functions that are unit-tested.
2. **Never invent data.** If a rate is not in the price list, the item is marked *estimated* and not guessed.
3. **Humans approve what matters.** Anything risky or ambiguous pauses for a decision.
4. **Fail safely.** The supervisor retries with exponential backoff, and skips downstream tasks when something fails for good.
5. **No fabricated metrics.** The UI shows live timings measured with `performance.now()`.

---

## 🤖 The Agents

| Agent | Type | Responsibility |
|---|---|---|
| **Planner** | LLM | Turns the request into a JSON task DAG. Validates the schema, retries, and falls back to a template DAG. |
| **Intake** | LLM (multimodal) | Extracts customer, items, amounts, stated pending, confidence and language. |
| **Auditor** | Hybrid | Deterministic math check, with the LLM only writing the Hinglish explanation. |
| **Ledger** | Deterministic | Idempotent voucher write, keyed on `customer + date + total + hash(items)`. |
| **Risk** | Deterministic | Exposure ratio and credit-limit check against configurable thresholds. |
| **Collections** | Deterministic | Pre-filled UPI QR (`vyaparvault@upi`) and WhatsApp receipt draft. |
| **Reporter** | Deterministic | Daily collection tallies and customer ledger statements. |
| **Supervisor** | State machine | Topological execution, parallel ready tasks, retries, approval gates. |

---

## 🎬 Demo Scenarios

Three one-click scenarios are built in, and **Judge Mode** runs all of them in sequence.

**1. Happy path**
> *"Patel Hardware pe 50 box drill bits, 15000 ka bill, 12000 mila, baaki 3000"*

The arithmetic matches and risk is low. The voucher is committed instantly and a pre-filled UPI QR is generated.

**2. Forensic math mismatch**
> *"Sharma Kirana pe 20 peti oil utaara, 42000 bill, 15000 mila, baaki 29000"*

`42,000 − 15,000 = ₹27,000`, but the note claims `₹29,000`. The system catches the **₹2,000 overstatement** and halts at the approval gate, where the merchant chooses the computed balance.

**3. Failure injection & auto-retry**

A simulated Godown DB write failure is injected. The Supervisor catches it, retries with exponential backoff, recovers, and logs the recovery in the audit trace.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4 |
| **UI / visuals** | Lucide icons, Motion, Recharts |
| **Server** | Express, run with `tsx` (`server.ts`) |
| **AI** | Google Gemma 4 (`gemma-4-26b-a4b-it`) via `@google/genai` |
| **Storage** | IndexedDB, with an in-memory fallback |
| **Voice input** | Browser Web Speech API (`hi-IN`) |
| **QR codes** | `qrcode` (rendered client-side) |
| **Export** | SheetJS (`xlsx`) |

The simulated backend has these tables: `customers`, `price_list`, `inventory`, `vouchers`, `ledger_entries`, `outbox`, `audit_log` and `message_bus`.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+** (or [Bun](https://bun.sh), since a `bun.lock` is included)
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Shahanahmedqureshi/Voice2Vault.git
cd Voice2Vault

# 2. Install dependencies
npm install          # or: bun install

# 3. Set up environment variables
cp .env.example .env
# then edit .env and add your key (see below)

# 4. Start the app
npm run dev
```

Open the local URL printed in your terminal.

### Environment variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | API key for Gemini / Gemma calls. |
| `APP_URL` | Optional | URL where the app is hosted. AI Studio injects it automatically on Cloud Run. |

> 🔒 Never commit your real `.env` file. It is already listed in `.gitignore`.

### Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the dev server (`tsx server.ts`). |
| `npm run build` | Production build with Vite. |
| `npm start` | Run the server. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Type-check with `tsc --noEmit`. |
| `npm run clean` | Remove `dist` and `server.js`. |

---

## 🧪 Testing

Pure financial functions are covered by an automated suite in `src/tools/unitTests.ts`, including the **42,000 / 15,000 / 29,000** benchmark case. Run it from the in-app **Unit Tests** modal.

---

## 📁 Project Structure

```
Voice2Vault/
├── server.ts                    # Express server (Gemma API proxy)
├── index.html
├── vite.config.ts
├── src/
│   ├── App.tsx                  # App shell + Judge Mode
│   ├── agents/                  # planner, intake, auditor, ledger,
│   │                            # risk, collections, reporter
│   ├── orchestrator/
│   │   └── supervisor.ts        # State machine, retries, approval gates
│   ├── tools/                   # auditMath, creditRisk, unitTests, tool layer
│   ├── store/
│   │   └── db.ts                # IndexedDB (+ in-memory fallback)
│   ├── components/              # CommandPanel, LiveDagView, MetricsStrip,
│   │                            # TraceAndApprovalsPanel, SettingsModal, ...
│   └── utils/
│       └── sheetExport.ts       # Excel / CSV export
├── .env.example
└── package.json
```

---

## ⚠️ Scope & Limitations

- The tool layer runs on a **simulated backend** (IndexedDB), so it is not connected to a real ERP or payment gateway.
- The UPI QR is **pre-filled for collection** and does not verify that a payment was received.
- WhatsApp messages are **drafts in an outbox** and are never sent automatically.
- Voice input depends on browser support for the Web Speech API.

---

## 👤 Author

**Shahan Ahmed Qureshi**
GitHub: [@Shahanahmedqureshi](https://github.com/Shahanahmedqureshi)

---

<div align="center">

*Built with Google Gemma 4 for the small businesses that keep India running.* 🇮🇳

</div>
