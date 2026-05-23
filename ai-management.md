# AI Management & Integration Architecture

This document details how the AI models (like Nvidia Llama-4) are loaded, managed, secured, and monitored within the CasaChicInterior Next.js project.

The entire system resides within the `modules/ai-management` directory, ensuring that the application does not rely on hardcoded `.env` API keys for AI providers. Instead, keys are managed dynamically via the Admin UI.

---

## 🏗️ 1. Dynamic Provider Resolution
Instead of importing a static API key, the application uses an asynchronous factory function `aiService.providerResolver()` whenever it needs to communicate with an LLM.

### Flow:
1. **Global Pause Check**: It first checks if the AI has been globally paused via `aiRepository.getSettings()`. If paused, it throws `AI_GLOBALLY_PAUSED`.
2. **Fetch Active Provider**: It queries the database for the currently "Active" AI provider (e.g., Nvidia, OpenRouter).
3. **Decryption**: It decrypts the provider's API key securely (see Security section).
4. **Endpoint Resolution**: It maps the provider to the correct `baseURL` (e.g., `https://integrate.api.nvidia.com/v1` for Nvidia).
5. **OpenAI Client Instantiation**: It initializes and returns an standard `OpenAI` client instance using the decrypted key and mapped baseURL.

*Code Reference: `ai.service.ts -> providerResolver()`*

---

## 🔒 2. Security & Encryption
Storing API keys directly in a database as plain text is a critical security risk. The AI Management module implements a robust encryption layer (`ai.crypto.ts`).

- **Algorithm**: `AES-256-CBC`
- **Master Key**: Relies on a single, highly secure environment variable `MASTER_ENCRYPTION_KEY` loaded from `.env`.
- **Process**: 
  - When an Admin adds an API key from the UI, the backend generates a random `Initialization Vector (IV)`, encrypts the key, and stores it in the database as `iv:encryptedData`.
  - When the system needs to generate a response, it pulls the encrypted string, splits the IV, and decrypts it in-memory right before passing it to the OpenAI client.
  - The raw API key never persists in memory longer than necessary.

---

## 🚦 3. Quotas, Limits, and Guardrails
Before the system makes a costly AI call, it passes through `aiService.checkLimits()`. This ensures budget safety.

The system verifies:
1. **Expiration Date**: Blocks the call if the API key has expired.
2. **Daily Limits**: Checks if the tokens consumed today exceed the `dailyLimit` set by the admin.
3. **Monthly Limits**: Checks if the tokens consumed this month exceed the `monthlyLimit`.

If any limit is breached, the call is blocked, and a Limit Event is logged to the database for the Admin to review.

---

## 📊 4. Usage & Cost Tracking
After every successful or failed AI call, the system asynchronously logs the usage via `aiService.logUsage()`.

- **Token Logging**: It tracks `providerReportedTokens` or estimates them if the provider didn't return usage stats.
- **Cost Estimation**: The module contains a static mapping of model costs (e.g., Llama-4 Maverick 17B = $0.50 per 1M tokens). It calculates the `estimatedCost` per transaction instantly.
- **Latency Tracking**: It records how long the provider took to respond, which is useful for monitoring provider health in the Dashboard.

*Code Reference: `ai.service.ts -> logUsage()`*

---

## 📂 5. Module Structure (`modules/ai-management`)
```text
ai-management/
├── ai.crypto.ts           # AES-256 encryption/decryption logic
├── ai.service.ts          # Orchestrator for loading models, checking limits, logging
├── ai.repository.ts       # Mongoose queries (fetch active keys, log usage)
├── ai-provider.model.ts   # Schema for API Keys and limits
├── ai-usage.model.ts      # Schema for transaction-level token/cost tracking
├── ai-limit.model.ts      # Schema for threshold breach logs
└── ai-settings.model.ts   # Global toggle settings (e.g., kill-switch)
```
