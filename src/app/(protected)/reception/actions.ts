'use server';

import { aiReceptionAssistant } from '@/ai/flows/ai-reception-assistant';

export async function handleReceptionAssistant(input: {
  query: string;
  currentQueue: unknown;
  currentTasks: unknown;
}) {
  return aiReceptionAssistant(input);
}
