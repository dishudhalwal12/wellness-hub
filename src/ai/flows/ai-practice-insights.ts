'use server';

import { getGenerativeModel } from '@/ai/google-genai';

type ReportInput = {
    timePeriod: 'daily' | 'weekly',
    clinicName: string,
    patients: any[],
    tasks: any[],
}

export async function generatePracticeInsightsReport(input: ReportInput & { orgId?: string; apiKey?: string }) {
    const model = await getGenerativeModel({ orgId: input.orgId, apiKey: input.apiKey });

    const prompt = `You are a world-class Medical Practice Consultant and Data Scientist. Your task is to analyze clinic data and generate a high-impact Practice Insights Report that feels like it was written by a top-tier management consultancy.

    Data for Analysis:
    - Period: ${input.timePeriod}
    - Clinic: ${input.clinicName}
    - Patients: ${JSON.stringify(input.patients)}
    - Tasks: ${JSON.stringify(input.tasks)}
    
    Current System Time: ${new Date().toISOString()}

    Your report must be in sophisticated Markdown and include:
    1.  **🚀 Executive Strategic Overview:** A high-level synthesis of operational health and growth trajectory.
    2.  **💰 Financial & Revenue Intelligence:**
        *   Deep dive into revenue streams (consultation fees).
        *   Patient acquisition metrics (new vs. returning).
        *   Visit type distribution (OPD vs. Emergency) and its impact on margins.
    3.  **🏃 Operational Velocity & Staff Performance:**
        *   Throughput analysis (completed vs. pending tasks).
        *   Bottleneck identification (overdue tasks and assignee load).
    4.  **🎯 Actionable Strategic Recommendations:** 2-3 high-leverage moves to optimize the clinic's performance immediately.

    Use professional, data-driven language. Use bolding, tables, or lists where they enhance readability.`;
    
    try {
        console.info("Using model:", model.model);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return { report: text };
    } catch(e) {
        console.error("AI practice insights generation failed:", e);
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
        throw new Error(`Failed to generate practice insights from AI. Reason: ${errorMessage}`);
    }
}
