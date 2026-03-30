'use server';

import { getAiConfigurationStatus, getServerApiKey } from "@/ai/services/api-key-service";

export async function getApiKey(): Promise<string> {
  return getServerApiKey();
}

export async function getAiConfigStatus(): Promise<{
  configured: boolean;
  envFile: string;
}> {
  return getAiConfigurationStatus();
}
