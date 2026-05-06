'use server';
// src/ai/ai-smart-billing.ts
import { getGenerativeModel } from '@/ai/google-genai';

export async function generateInvoice(input: {
  consultationNotes: string;
  patientName: string;
  patientId: string;
  dateOfService: string;
  clinicName: string;
  providerName: string;
  orgId?: string;
  apiKey?: string;
}) {
  const model = await getGenerativeModel({ orgId: input.orgId, apiKey: input.apiKey });

  const prompt = `You are a professional medical coding and billing AI. Your expertise is in converting clinical consultation notes into accurate billing statements with appropriate CPT/ICD-10 codes.

  Review the following consultation details and generate a structured invoice.
  
  Patient: ${input.patientName} (${input.patientId})
  Date of Service: ${input.dateOfService}
  Clinic: ${input.clinicName}
  Provider: ${input.providerName}
  
  Consultation Notes:
  ${input.consultationNotes}

  Generate a JSON response with these keys:
  - "invoiceNumber": (string) A unique, professional invoice ID.
  - "invoiceDate": (string) Today's date.
  - "services": (array) List of billed services. Each service must have:
    - "description": (string) Professional description of the service.
    - "code": (string) The relevant CPT or HCPCS code.
    - "price": (number) A realistic, industry-standard price for the service (in ₹).
  - "totalAmount": (number) The sum of all service prices.
  - "paymentDueDate": (string) 30 days from now.

  Return ONLY valid JSON.`;

  try {
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json",
        }
    });
    
    const response = await result.response;
    const text = response.text();
    const parsed = JSON.parse(text);
    
    return parsed;
  } catch (e) {
    console.error("AI billing generation failed:", e);
    throw new Error(`Failed to generate billing draft. ${e instanceof Error ? e.message : ''}`);
  }
}
