# ⚡ Voice2Vault OS (VyaparVault ERP v2.4)
> **India’s First Zero-Typing Autonomous Field Khata, Forensic Math Auditor & Live Cloud Excel Sync Engine — Powered by Google Gemma 4 (`gemma-4-26b-a4b-it`).**

[![Engine](https://img.shields.io/badge/AI_Engine-Gemma_4_26B_A4B_MoE-107C41?style=for-the-badge)](https://ai.google.dev/gemma)
[![Latency](https://img.shields.io/badge/Inference_Latency-~0.32s-059669?style=for-the-badge)]()
[![Privacy](https://img.shields.io/badge/Data_Privacy-100%25_Open_Weight-111827?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)]()

---

## 🚨 The Problem
Every day, millions of Indian wholesale distributors, Medical Representatives (MRs), and FMCG field agents visit 30–40 retail shops. Standing in crowded markets, nobody wants to spend 15 minutes manually typing item SKUs, quantities, and partial payments into complex ERPs like Tally or manual ledger apps. Instead, they rely on verbal notes or handwritten **Kachha Bills (slips)**.

**The result:**
1. **Unrecorded Credit (Udhaar) Leakage:** Billions of rupees in B2B credit go untracked or disputed.
2. **Arithmetic & Ledger Discrepancies:** Hurried mental math leads to costly calculation errors between total bill value, instant cash/UPI realization, and remaining balance.
3. **Delayed Collections:** Lack of instant digital receipts, UPI payment links, and automated follow-up schedules slows down working capital cycles.

---

## 💡 The Solution: Voice2Vault OS
**Voice2Vault OS** transforms chaotic field inputs (**Hinglish voice notes** and **handwritten Kachha Bill photos**) into forensically audited accounting vouchers in **~0.32 seconds** without manual typing.

### ✨ Key Features
* 🎙️ **Multimodal Hinglish Voice & Vision OCR:** Field agents simply speak naturally in Hinglish (e.g., *"Sharma Kirana pe 20 peti oil aur 10 katta shakkar utaara..."*) or snap a photo of a handwritten slip.
* 🧮 **Real-Time Forensic Math Audit:** Automatically cross-verifies `Total Bill - Paid Amount = Actual Pending Udhaar`. If a speaker or handwritten bill states ₹29,000 pending when `₹42,000 - ₹15,000 = ₹27,000`, the engine intercepts and blocks the **₹2,000 overstatement error** before it hits the ledger.
* 📊 **Autonomous Credit Risk Scoring:** Calculates real-time credit exposure ratios and triggers `🔴 HIGH CREDIT RISK — BLOCK FURTHER DISPATCH` directives when debt thresholds (>50% ratio or >₹3,000) are breached.
* 📱 **Instant Dynamic UPI QR Code Generator:** Generates a pre-filled, tamper-proof Dynamic UPI QR (`upi://pay?...`) for the exact audited balance so shopkeepers can scan and settle dues on the spot via PhonePe, GPay, or Paytm.
* 🟢 **1-Click WhatsApp Digital Parchi + Cloud Excel Link:** Dispatches an instant Hinglish digital receipt to the merchant's WhatsApp complete with itemized details, due dates, and a live viewable Cloud Excel Ledger link.
* 📈 **Two-Way Master Excel (`.xlsx` / `.csv`) Synchronization:** Auto-appends every audited voucher and warehouse inventory deduction (`SKU Delta`) into a live spreadsheet grid with built-in Excel formulas.

---

## 🏗️ System Architecture

```text
 [ 🎤 Hinglish Voice Note ]       [ 📸 Handwritten Kachha Bill Photo ]
             │                                     │
             └──────────────────┬──────────────────┘
                                ▼
             [ Zero-Clutter React + Tailwind Bento UI ]
                                │
                                ▼  (Base64 InlineData + Structured Prompt)
             [ Google GenAI SDK — Client-to-Model Direct ]
                                │
                                ▼
         🧠 [ Gemma-4-26B-A4B-IT (Mixture-of-Experts Engine) ]
            ├── 1. Entity & SKU Rate Reverse-Engineering
            ├── 2. Forensic Arithmetic Discrepancy Verification
            └── 3. Credit Exposure Ratio & Risk Classification
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
[ 📱 Dynamic UPI QR ]   [ 🟢 WhatsApp Parchi ]   [ 📊 Cloud Excel Sync ]
 (Instant Settlement)    (wa.me Deep-Link API)    (Master Khata + CSV)
