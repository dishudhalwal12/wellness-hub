"use client";

import { useMemo, useState } from "react";
import { collection, query, where } from "firebase/firestore";
import { BarChart3, ClipboardCheck, Loader2, Users } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { MetricCard, PageHeader } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generatePracticeInsightsReport } from "@/ai/flows/ai-practice-insights";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { demoPatients, demoPracticeReport, demoTasks } from "@/lib/demo-data";

import type { Patient } from "../patients/page";
import type { Task } from "../tasks/page";

type TimePeriod = 'daily' | 'weekly';

export default function ReportsPage() {
    const [timePeriod, setTimePeriod] = useState<TimePeriod>('weekly');
    const [report, setReport] = useState<string>(demoPracticeReport);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { profile } = useUser();
    const firestore = useFirestore();

    const patientsQuery = useMemoFirebase(() => {
        if (!firestore || !profile?.orgId) return null;
        return query(collection(firestore, 'patients'), where('orgId', '==', profile.orgId));
    }, [firestore, profile?.orgId]);
    const { data: patients, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);

    const tasksQuery = useMemoFirebase(() => {
        if (!firestore || !profile?.orgId) return null;
        return query(collection(firestore, 'tasks'), where('orgId', '==', profile.orgId));
    }, [firestore, profile?.orgId]);
    const { data: tasks, isLoading: tasksLoading } = useCollection<Task>(tasksQuery);

    const displayPatients = (patients?.length ? patients : demoPatients) as Patient[];
    const displayTasks = (tasks?.length ? tasks : demoTasks) as Task[];
    const hasLiveData = (patients?.length ?? 0) > 0 || (tasks?.length ?? 0) > 0;

    const stats = useMemo(() => {
        const totalRevenue = displayPatients.reduce((sum, patient) => sum + (patient.consultationFee || 0), 0);
        const completedTasks = displayTasks.filter((task) => task.status === 'Completed').length;
        const completionRate = displayTasks.length ? Math.round((completedTasks / displayTasks.length) * 100) : 0;

        return {
            patientCount: displayPatients.length,
            taskCount: displayTasks.length,
            completedTasks,
            completionRate,
            totalRevenue,
        };
    }, [displayPatients, displayTasks]);

    const handleGenerateReport = async () => {
        setIsLoading(true);
        try {
            const result = await generatePracticeInsightsReport({
                timePeriod,
                clinicName: profile?.orgName || 'Your Clinic',
                patients: patients || [],
                tasks: tasks || []
            });
            setReport(result.report);
        } catch (error) {
            console.error("Failed to generate report:", error);
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: 'The AI assistant failed to generate the report.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Executive Reporting"
                title="Practice insights and operational trends"
                description="Generate live AI reports when the backend is ready, while keeping this screen populated with an executive-style narrative and KPI context before fresh data lands."
                actions={
                    <div className="flex flex-wrap items-center gap-3">
                        <Select onValueChange={(value: TimePeriod) => setTimePeriod(value)} value={timePeriod}>
                            <SelectTrigger className="w-[220px]">
                                <SelectValue placeholder="Select time period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="daily">Daily Report</SelectItem>
                                <SelectItem value="weekly">Weekly Report</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleGenerateReport} disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BarChart3 className="mr-2 h-4 w-4" />}
                            Generate Report
                        </Button>
                    </div>
                }
            >
                <span className="glass-chip">{timePeriod === 'weekly' ? 'Weekly lens' : 'Daily lens'}</span>
                <Badge variant={hasLiveData ? 'secondary' : 'outline'}>
                    {patientsLoading || tasksLoading ? 'Syncing clinic data' : hasLiveData ? 'Live operational data' : 'Insights loaded'}
                </Badge>
            </PageHeader>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Patients Analyzed"
                    value={stats.patientCount.toString()}
                    description="The report context includes the visible patient roster and recent demand signals."
                    icon={Users}
                    trend="Trend-ready"
                />
                <MetricCard
                    title="Tasks Reviewed"
                    value={stats.taskCount.toString()}
                    description="Operational throughput and staff task flow contribute to the narrative recommendations."
                    icon={ClipboardCheck}
                    trend={`${stats.completionRate}% completed`}
                />
                <MetricCard
                    title="Revenue Context"
                    value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
                    description="Consultation value available to the reporting engine for revenue commentary."
                    icon={BarChart3}
                    trend="High-signal snapshot"
                />
                <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
                    <CardHeader>
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Completion Rate</CardDescription>
                        <CardTitle className="text-3xl">{stats.completionRate}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-6 text-muted-foreground">
                            The current task closeout rate gives the report enough operational texture to feel grounded and current.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>AI Practice Insights</CardTitle>
                    <CardDescription>
                        Narrative report with trends, revenue context, and recommendations tuned for polished stakeholder reviews.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-[24px] border border-border/70 bg-white/75 p-6 prose prose-sm max-w-none prose-headings:font-semibold prose-p:leading-7 prose-ul:leading-7">
                        {isLoading ? (
                            <div className="flex min-h-[320px] items-center justify-center text-center text-muted-foreground">
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Generating your latest AI report...
                            </div>
                        ) : (
                            <ReactMarkdown>{report}</ReactMarkdown>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <p className="text-sm text-muted-foreground">
                        Use the selector above to rerun the report with live patient and task context whenever fresh data is available.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
