# CasaChic WhatsApp AI Automation & Lead CRM - Technical Documentation

This document provides a comprehensive technical overview of the WhatsApp automation module and the unified Lead CRM built into the CasaChicInterior Next.js project. It covers the logic implementation, data flow, webhook triggers, database schemas, AI integration, and the **Business-Controlled Conversation Ownership** system.

---

## 📌 1. Overview
The WhatsApp automation engine serves as an AI-driven lead qualification and conversion tool. It intercepts messages from the Meta WhatsApp Cloud API, determines user intent, persists lead data, and generates intelligent contextual responses using **Nvidia's Llama-4 Maverick** model. 

It is deeply integrated with a **Unified Lead CRM Dashboard** that provides Admins with real-time lead tracking, scoring, pipeline management, and a robust **Conversation Ownership** system to seamlessly transition leads from AI automation to manual human takeover.

---

## 🏗️ 2. Architecture & Data Flow
The architecture is designed strictly around separation of concerns, decoupling Next.js API routes from heavy AI processing logic.

### **The Request Lifecycle:**
1. **User Sends Message**: The user sends a WhatsApp message to the business number.
2. **Meta Webhook POST**: Meta's servers POST a payload to the Next.js API route (`/api/whatsapp/webhook/route.ts`).
3. **Controller Interception**: `whatsapp.controller.ts` parses the payload, extracts the sender's phone number and message body.
4. **Immediate 200 OK**: The webhook returns a `200 OK` status immediately to Meta to prevent timeouts, moving processing to an asynchronous background task.
5. **Ownership & Rules Check (Gateway)**: `whatsappRule.shouldProcessAutomation` instantly checks the DB/lead state to see if the phone number is flagged as a `CLIENT`, `VIP`, `TEAM`, `RELATIVE`, or explicitly set to `MANUAL`. 
   - If `RELATIVE`, the process HALTS completely (No DB save, no AI). 
   - If `CLIENT/VIP/MANUAL`, DB updates are allowed but AI/Meta replies are skipped to prevent unwanted messaging costs.
6. **Intent & State Update**: If allowed by the rule engine, `whatsapp.service.ts` detects the intent of the message (via `whatsapp.intent.ts`), extracts variables (name, location, requirement), and syncs it with the MongoDB database using the CRM Service.
7. **Context & Memory Assembly**: Conversation history (`whatsapp.memory.ts`), business context (`whatsapp.context.ts`), and lead state are aggregated into a system prompt.
8. **AI Inference**: The prompt is sent to `Nvidia Llama-4`.
9. **Bot Reply**: The generated text is sanitized and pushed back to the user via the Meta Graph API.
10. **CRM Update**: The bot's response is appended to the lead's profile, and the `leadScore` and `lastActivityAt` timestamps are updated.

---

## 🔗 3. Webhook Trigger Logic
The webhook logic resides in `app/api/whatsapp/webhook/route.ts` and delegates to `modules/whatsapp/whatsapp.controller.ts`.

- **Webhook Verification (GET):**
  - Meta sends a `GET` request containing `hub.mode`, `hub.verify_token`, and `hub.challenge`.
  - The controller compares the `verify_token` against the `.env` variable `WHATSAPP_VERIFY_TOKEN`. If matched, it responds with the `challenge` string.
- **Payload Handling (POST):**
  - Expected object: `whatsapp_business_account`.
  - Parses down the JSON tree to capture the `from` number and `text.body`.
  - Dispatches `whatsappService.processIncomingMessage(...)` **without awaiting it**, ensuring Meta receives a timely response.

---

## 🧠 4. Logic Implementation & Automation Engine

The heavy lifting is orchestrated by `whatsapp.service.ts` acting as the brain.

### **A. Business-Controlled Conversation Ownership (`whatsapp.rule.ts` & `lead.service.ts`)**
Acts as a security and cost-saving gateway to prevent AI from responding to sensitive contacts or converted clients. 
- **Auto-Conversion**: When a lead's status reaches `QUALIFIED`, `SITE_VISIT`, `QUOTE_SENT`, `NEGOTIATION`, or `CONVERTED`, the `lead.service.ts` automatically updates their `label` to `CLIENT` and switches their `conversationOwner` to `MANUAL`.
- **Dynamic Blocking**: The rule engine instantly blocks AI replies for `CLIENT`, `VIP`, `TEAM`, and `RELATIVE` labels.
- **Legacy Fallback**: Falls back to the legacy `contactRuleService` for backward compatibility.

### **B. Intent Detection (`whatsapp.intent.ts`)**
Uses regex-based Natural Language Processing to detect the core purpose of a user's message.
- Matches words like `price, cost, kitna, kharcha` -> assigns intent **"pricing"**.
- Matches `work, sample, dikhao, portfolio` -> assigns intent **"portfolio"**.

### **C. Smart Data Extraction & Lead Scoring**
During message processing, the service attempts to parse the user's name, city, and core requirement dynamically based on regex patterns. The CRM dynamically calculates a `leadScore` based on the completeness of their profile (e.g., +20 points if name is known, +30 points if requirement is specified).

---

## 🤖 5. AI Integration (Nvidia Llama-4)
- **Model Used**: `meta/llama-4-maverick-17b-128e-instruct` via Nvidia's Inference API.
- **Prompt Engineering**: Managed by `whatsapp.prompt.ts`. The prompt includes:
  - Lead specifics (name, location, requirement).
  - Missing data fields the AI needs to figure out.
  - Detected User Language (Hinglish/English).
  - Business rules (e.g., keeping replies under 300 chars, acting as a Casa Chic interior expert).
- **Fallback safety**: If the AI request fails, it defaults to a safe hardcoded string.
- **Deterministic Overrides**: If the user asks for a portfolio or website, the backend forcibly appends the verified URL link to the AI response.

---

## 💾 6. Database Schemas (Mongoose)

### **A. CRM Lead Schema (`modules/leads/lead.model.ts`)**
| Field | Type | Description |
| :--- | :--- | :--- |
| `phone` | `String` | (Unique) Primary identifier for the WhatsApp user. |
| `name`, `location`, `requirement` | `String` | Extracted or requested user details. |
| `label` | `Enum` | Marks contact relationship (`UNKNOWN`, `LEAD`, `CLIENT`, `RELATIVE`, `VIP`, `TEAM`). |
| `conversationOwner` | `Enum` | Explicitly declares who owns the conversation (`AUTO` or `MANUAL`). |
| `status` | `Enum` | Lead pipeline state (`NEW`, `CONTACTED`, `QUALIFIED`, `SITE_VISIT`, `QUOTE_SENT`, `NEGOTIATION`, `CONVERTED`, `LOST`). |
| `leadScore` | `Number` | Dynamically calculated priority score. |
| `automationMode` | `Enum` | Legacy fallback for `AUTO` / `MANUAL` modes. |
| `convertedAt` / `automationStoppedAt` | `Date` | Analytics timestamps for when automation was halted. |
| `conversationState`| `Object` | Tracks what the AI has asked so far. |

### **B. Automation Rules Schema (`modules/contacts/contact-rule.model.ts`)**
*Note: Largely superceded by Lead Schema ownership logic, but kept for global standalone rules.*
| Field | Type | Description |
| :--- | :--- | :--- |
| `phone` | `String` | (Unique) Phone number with country code. |
| `mode` | `String` | `"AUTO"` (AI replies) or `"MANUAL"` (AI is skipped). |
| `label` | `String` | `"UNKNOWN"`, `"LEAD"`, `"CLIENT"`, `"RELATIVE"`, `"VIP"`. |
| `notes` | `String` | Optional context for the admin. |

---

## 🖥️ 7. Unified Admin Dashboard
The system provides a responsive dashboard inside the Next.js App Router for admins to monitor and takeover conversations seamlessly:

1. **Leads Management Dashboard**: A unified CRM view with top actionable KPI cards (e.g. `Clients`, `AI Bypassed`), search filters, and a responsive table featuring a `Label / Owner` visual column.
2. **Bulk Actions**: Admins can bulk select leads to explicitly Disable AI, Enable AI, or push them down the sales funnel.
3. **Lead Detail Drawer**: Deep-editing of Lead profiles, viewing chronological conversation history, timelines, and explicitly overriding the `Conversation Owner` or `Contact Label`.

---

## 📂 8. Module Folder Structure
```text
modules/
├── contacts/               # Standalone Routing & Control rules for incoming numbers
│   ├── contact-rule.model.ts
│   ├── contact-rule.service.ts
│   └── contact-rule.repository.ts
│
├── leads/                  # Centralized CRM, pipeline, & auto-conversion logic
│   ├── lead.model.ts
│   ├── lead.dto.ts
│   ├── lead.service.ts
│   ├── lead.server.ts
│   └── lead.repository.ts
│
└── whatsapp/               # Core WhatsApp integration, Rule Engine, & AI Orchestration
    ├── whatsapp.controller.ts  
    ├── whatsapp.service.ts     
    ├── whatsapp.rule.ts        
    ├── whatsapp.intent.ts      
    ├── whatsapp.prompt.ts      
    └── whatsapp.memory.ts      
```
