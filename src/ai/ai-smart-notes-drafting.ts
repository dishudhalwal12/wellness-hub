'use server';
// src/ai/ai-smart-notes-drafting.ts
import { getGenerativeModel } from '@/ai/google-genai';

export async function aiSmartNotesDrafting({ patientData }: { patientData: string }) {
    const model = await getGenerativeModel();

    const prompt = `You are an elite AI medical documentation specialist. Your goal is to draft high-precision progress notes (SOAP) for a physician.

    Patient Context & Data:
    ${patientData}

    Based on the provided patient data and the current clinical context, generate professional suggestions for the 'Assessment' and 'Plan' sections of a progress note. 
    - The Assessment should be a concise clinical synthesis of the findings.
    - The Plan should be actionable, specific, and follow current best practices.

    Respond ONLY in a JSON format with these exact keys:
    {
      "assessmentSuggestion": "A concise clinical synthesis...",
      "planSuggestion": "A bulleted list of specific, actionable steps..."
    }`;

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
            assessmentSuggestion: parsed.assessmentSuggestion,
            planSuggestion: parsed.planSuggestion,
            progress: 'AI-generated assessment and plan drafts ready for review.'
        };
    } catch (e) {
        console.error("AI smart notes generation failed:", e);
        throw new Error(`Failed to generate smart notes. ${e instanceof Error ? e.message : ''}`);
    }
}
