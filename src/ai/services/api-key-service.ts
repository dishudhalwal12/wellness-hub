'use server';

const AI_ENV_FILE = ".env.local";

export async function getServerApiKey(): Promise<string> {
  return process.env.GOOGLE_API_KEY?.trim() || '';
}

export async function getAiConfigurationStatus(): Promise<{
  configured: boolean;
  envFile: string;
}> {
  return {
    configured: Boolean(process.env.GOOGLE_API_KEY?.trim()),
    envFile: AI_ENV_FILE,
  };
}
