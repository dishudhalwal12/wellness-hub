# 🩺 PulseNet: The Agency Handbook

Welcome to the **PulseNet** project! If you're reading this, you've likely just inherited or are about to deploy one of the most polished AI-powered clinical platforms in our agency's portfolio. 

PulseNet isn't just a "student project"—it's a vision for the future of private practice. We build this for B.Tech 3rd-year students who want to see what a "production-ready" SaaS looks like. It’s sleek, it’s smart, and it actually works.

---

## 🏗 The Core Context
**What is PulseNet?**  
It’s an **AI Clinical Copilot**. Think of it as the ultimate assistant for a doctor running a private clinic. It handles the boring stuff (billing, notes, queue management) so the doctor can focus on the patient.

**The Agency Vibe:**  
We don't like "empty states." If a user logs in and sees a blank screen, we've failed. That's why PulseNet is pre-loaded with high-fidelity **Demo Data**. Even if the database is empty, the app looks like a busy, thriving clinic.

---

## 🛠 The Tech Stack
We kept it modern, fast, and scalable:
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS + Shadcn UI.
- **Backend:** Firebase (Authentication, Firestore, Storage).
- **AI Engine:** Google Gemini (via `@google/generative-ai` SDK).
- **Icons & UI:** Lucide React + Recharts for the fancy graphs.
- **Telehealth:** Integrated Jitsi Meet for one-click virtual consults.

---

## 📂 Folder Tour: Where’s the Magic?

| Path | What's inside? |
| :--- | :--- |
| `src/app` | The Next.js heart. We use `(protected)` groups for the main app logic and `login` for the entry gate. |
| `src/ai` | The AI brain. This is where we handle prompting, logic for diagnosis, and billing suggestions. |
| `src/firebase` | The glue. Custom hooks (`useUser`, `useCollection`) that make talking to Firestore feel like magic. |
| `src/components` | The Lego bricks. Shared UI components built on Shadcn but styled for a premium medical feel. |
| `src/lib` | Utilities and that critical `demo-data.ts` that keeps the app looking "alive." |

---

## 🚀 Feature Breakdown (What actually works?)

### 1. 🤖 AI Diagnostic Copilot (`/patients`)
Upload a patient lab report (PDF/Text), and the AI will:
- Summarize the results.
- Highlight abnormalities.
- Suggest potential diagnoses and follow-ups.
- *Status: Fully functional with GOOGLE_API_KEY.*

### 2. 💬 AI Reception Assistant (`/reception`)
A conversational chat interface for the front desk.
- "Move the urgent walk-in to the top."
- "Create a callback task for pending lab results."
- *Status: Fully functional; actually updates the Firestore queue!*

### 3. 📝 AI Smart Notes (`/notes`)
Drafting SOAP notes is a pain. This feature:
- Takes subjective/objective input.
- AI drafts the Assessment and Plan.
- One-click "Incorporate" to finalize.
- *Status: Fully functional.*

### 4. 💸 AI Smart Billing (`/billing`)
Revenue cycle intelligence.
- Analyzes visit notes.
- Suggests ICD-10 and CPT codes with confidence scores.
- Provides a "Rationale" so the doctor can audit the AI.
- *Status: Fully functional.*

### 5. 📹 Telehealth & AI Note Taker (`/telehealth`)
The crown jewel.
- Integrated video calls.
- **Live Recording:** The AI listens to the call, transcribes it, and drafts a SOAP note *automatically*.
- *Status: Live transcription requires microphone permissions and API key.*

### 6. ⏰ Medication Adherence (`/medications`)
- Local storage-based reminder engine.
- Plays an alarm and shows a toast when it's time for a dose.
- Pre-loaded with a realistic regimen.
- *Status: Works locally (browser-based).*

---

## 🔑 The "Secret Sauce" (Setup)

To make PulseNet "Smart," you need to feed it an API Key.
1. Create a `.env.local` in the root.
2. Add your `GOOGLE_API_KEY`.
3. Set `GENAI_MODEL=gemini-2.0-flash`.

**Pro-Tip:** If the AI is slow, it's usually because the prompt is huge. We've optimized the prompts in `src/ai/flows`, but feel free to tweak them for better "medical personality."

---

## 💡 A Note on Tone
PulseNet should feel **Premium**. 
- Use **Glassmorphism** (check `globals.css` for `.glass-card`).
- Use **Subtle Animations** (we use `framer-motion` and `tailwindcss-animate`).
- Keep the language **Professional yet Human**. No "Error 404," use "We couldn't find that patient record."

Happy Coding! Let's build the future of healthcare. 🩺✨
