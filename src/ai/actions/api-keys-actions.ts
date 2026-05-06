'use server';

import { getAiConfigurationStatus, getServerApiKey } from "@/ai/services/api-key-service";
import { getFirestore } from "firebase-admin/firestore";
import { initializeApp, getApps, cert } from "firebase-admin/app";

// Helper to get Admin Firestore (server-side only)
function getAdminFirestore() {
  if (getApps().length === 0) {
    // If we have a service account key, use it. Otherwise, assume local/default credentials.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        initializeApp({
            credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
        });
    } else {
        initializeApp({
            projectId: 'krishna-e9c59'
        });
    }
  }
  return getFirestore();
}

export async function getApiKey(orgId?: string): Promise<string> {
  const envKey = await getServerApiKey();
  if (envKey) {
    console.info("Using GOOGLE_API_KEY from server environment.");
    return envKey;
  }

  console.info(`No environment API key found. Checking Firestore for orgId: ${orgId || 'None provided'}`);

  if (orgId) {
    try {
      const db = getAdminFirestore();
      const orgDoc = await db.collection('orgs').doc(orgId).get();
      if (orgDoc.exists && orgDoc.data()?.googleApiKey) {
        console.info("Successfully retrieved API key from Firestore organization document.");
        return orgDoc.data()?.googleApiKey;
      } else {
        console.warn(`Organization document ${orgId} exists: ${orgDoc.exists}, has googleApiKey: ${Boolean(orgDoc.data()?.googleApiKey)}`);
      }
    } catch (error) {
      console.error("Error fetching org API key from Firestore:", error);
    }
  }

  return '';
}

export async function getAiConfigStatus(): Promise<{
  configured: boolean;
  envFile: string;
}> {
  return getAiConfigurationStatus();
}
