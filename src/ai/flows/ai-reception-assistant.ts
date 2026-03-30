'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const receptionFlowInputSchema = z.object({
  query: z.string(),
  currentQueue: z.any().describe('Current patient queue data.'),
  currentTasks: z.any().describe('Current staff task data.'),
});

const receptionFlowOutputSchema = z.object({
  response: z.string(),
  updatedQueue: z.any().optional(),
});

const receptionFlow = ai.defineFlow(
  {
    name: 'receptionFlow',
    inputSchema: receptionFlowInputSchema,
    outputSchema: receptionFlowOutputSchema,
  },
  async (input) => {
    const queueSummary = JSON.stringify(input.currentQueue ?? [], null, 2);
    const taskSummary = JSON.stringify(input.currentTasks ?? [], null, 2);

    const result = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview',
      prompt: `You are the Wellness Hub AI reception assistant for a medical clinic.

Use the current queue and task context to answer front-desk questions, summarize the state of the clinic, and suggest the next action when helpful.

Current patient queue:
${queueSummary}

Current staff tasks:
${taskSummary}

User query:
${input.query}

Respond in plain language suitable for a receptionist. If the user asks for queue changes, explain the recommended change instead of claiming you modified backend data.`,
    });

    return {
      response: result.text,
    };
  }
);

export async function aiReceptionAssistant(
  input: z.infer<typeof receptionFlowInputSchema>
) {
  return receptionFlow(input);
}
