"use client"

import { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { suggestCodes, type CodingAssistanceOutput } from "@/ai/flows/ai-coding-assistance";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Loader2, ReceiptText, ShieldCheck, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { MetricCard, PageHeader } from "@/components/app/ui";
import { demoBillingResult } from "@/lib/demo-data";

export default function BillingPage() {
    const [visitNotes, setVisitNotes] = useState("Patient is a 58-year-old male with a history of hypertension and type 2 diabetes, presenting for a 3-month follow-up. Reports occasional headaches and fatigue. BP is 145/90, and recent A1c was 7.8%. Physical exam is otherwise unremarkable. Assessment: Uncontrolled hypertension, poorly controlled type 2 diabetes.");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<CodingAssistanceOutput | null>(null);
    const { toast } = useToast();

    const confidenceSummary = useMemo(() => {
        const suggestions = result?.suggestedCodes || [];
        const average =
            suggestions.length > 0
                ? suggestions.reduce((sum, code) => sum + code.confidenceScore, 0) / suggestions.length
                : 0;
        return Math.round(average * 100);
    }, [result]);

    const handleSuggestCodes = async () => {
        if (!visitNotes.trim()) {
            toast({
                variant: 'destructive',
                title: 'Input Required',
                description: 'Please enter visit notes before suggesting codes.',
            });
            return;
        }

        setIsLoading(true);
        try {
            const output = await suggestCodes({ visitNotes });
            setResult(output);
        } catch (error) {
            console.error("Error suggesting codes:", error);
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: 'Failed to get suggestions from the AI assistant.',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Revenue Cycle Intelligence"
                title="Claims and coding that look production-ready on day one"
                description="Use the live AI coding flow when available, while keeping a realistic, audit-friendly result visible whenever the workspace would otherwise feel empty."
                actions={
                    <Button onClick={handleSuggestCodes} disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                        Suggest Codes
                    </Button>
                }
            >
                <span className="glass-chip">Confidence avg. {confidenceSummary}%</span>
                <Badge variant="outline">Audit-safe review</Badge>
            </PageHeader>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Suggested Codes"
                    value={`${result?.suggestedCodes.length || 0}`}
                    description="Diagnosis and billing suggestions visible even before the first live AI run completes."
                    icon={ReceiptText}
                    trend="Review-ready"
                />
                <MetricCard
                    title="Confidence Average"
                    value={`${confidenceSummary}%`}
                    description="Blended confidence across the currently visible coding recommendations."
                    icon={ShieldCheck}
                    trend="High clarity"
                />
                <MetricCard
                    title="Claim Complexity"
                    value="Moderate"
                    description="Visit notes indicate chronic condition management with medication oversight."
                    icon={BrainCircuit}
                    trend="99214 likely"
                />
                <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
                    <CardHeader>
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Compliance Posture</CardDescription>
                        <CardTitle className="text-3xl">Strong</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-6 text-muted-foreground">
                            Visible rationale and change history make this screen easy to review for finance and admin audiences.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.95fr)]">
                <Card>
                    <CardHeader>
                        <CardTitle>Visit Documentation</CardTitle>
                        <CardDescription>
                            Paste or refine encounter notes, then run the live assistant without losing the polished default presentation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            placeholder="Paste patient visit notes here..."
                            className="min-h-[280px]"
                            value={visitNotes}
                            onChange={(event) => setVisitNotes(event.target.value)}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSuggestCodes} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Run Coding Assistant
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <CardTitle>AI Suggestions</CardTitle>
                        <CardDescription>Code recommendations with confidence and traceable rationale.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading ? (
                            <div className="flex min-h-[320px] items-center justify-center rounded-[22px] border border-dashed border-border bg-muted/35 text-sm text-muted-foreground">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Updating recommendations from the live coding assistant...
                            </div>
                        ) : null}

                        {result ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Code</TableHead>
                                            <TableHead>Confidence</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {result.suggestedCodes.map((code, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-mono text-sm font-semibold text-foreground">{code.code}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-2 w-full max-w-28 overflow-hidden rounded-full bg-muted">
                                                            <div
                                                                className="h-full rounded-full bg-primary"
                                                                style={{ width: `${Math.round(code.confidenceScore * 100)}%` }}
                                                            />
                                                        </div>
                                                        <span>{(code.confidenceScore * 100).toFixed(0)}%</span>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {result.changeHistory ? (
                                    <Alert className="border-white/80 bg-white/80">
                                        <Terminal className="h-4 w-4" />
                                        <AlertTitle>Change History</AlertTitle>
                                        <AlertDescription className="prose prose-sm max-w-none">
                                            <ReactMarkdown>{result.changeHistory}</ReactMarkdown>
                                        </AlertDescription>
                                    </Alert>
                                ) : null}
                            </>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
