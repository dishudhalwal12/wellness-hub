'use server';
// src/ai/flows/ai-reception-assistant.ts
import { getGenerativeModel } from "../google-genai";

export async function aiReceptionAssistant(input: {
  query: string;
  currentQueue: any;
  currentTasks: any;
  orgId: string;
  apiKey?: string;
}) {
  const model = await getGenerativeModel({ orgId: input.orgId, apiKey: input.apiKey });

  const queueSummary = JSON.stringify(input.currentQueue ?? [], null, 2);
  const taskSummary = JSON.stringify(input.currentTasks ?? [], null, 2);

  const prompt = `You are the WellnessHub AI reception assistant for a medical clinic.
You are smart, efficient, and proactive.

Current patient queue:
${queueSummary}

Current staff tasks:
${taskSummary}

User query:
${input.query}

Respond in a JSON format with two keys:
1. "response": (string) Your verbal response to the receptionist.
2. "updatedQueue": (array of objects, optional) If the user query implies a change to the queue (e.g., "move urgent patient to top", "patient checked in"), return the full updated queue array here. If no change is needed, omit this key.

Guidelines for queue updates:
- If you move a patient, update their ETA accordingly.
- If a patient status changes, update the "status" field.
- Ensure the structure of "updatedQueue" exactly matches the input "currentQueue".

Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json",
        }
    });
    
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    
    return {
      response: parsed.response,
      updatedQueue: parsed.updatedQueue,
    };
  } catch (e) {
    console.error("AI reception assistant failed:", e);
    return {
      response: "I'm sorry, I'm having trouble processing that right now. Please try again or manage the queue manually.",
    };
  }
}
