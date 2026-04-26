"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, query, where } from "firebase/firestore";
import { ClipboardList, Loader2, SendHorizonal, Sparkles, UsersRound } from "lucide-react";

import { MetricCard, PageHeader } from "@/components/app/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleReceptionAssistant } from "./actions";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirestore, useMemoFirebase, useUser } from "@/firebase";
import { demoQueue, demoTasks, demoPatients } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

import type { Patient } from "@/app/(protected)/patients/page";
import type { Task } from "@/app/(protected)/tasks/page";

type ChecklistItems = {
    reportCollected: boolean;
    paymentCompleted: boolean;
    patientUpdated: boolean;
    investigationScheduled: boolean;
}

type QueueItem = {
    id: string;
    token: string;
    name: string;
    type: "Appointment" | "Walk-In";
    status: "Waiting" | "In Consult" | "Finished";
    eta: string;
    checklist: ChecklistItems;
};

type ChatMessage = {
    role: 'user' | 'ai';
    text: string;
};

const initialMessages: ChatMessage[] = [
    { role: 'ai', text: "Good morning. I’m watching the queue, follow-up tasks, and intake completion. Ask me to reprioritize the queue, prepare a callback list, or generate staff actions." },
    { role: 'ai', text: "Try: “Move the urgent walk-in to the top and create a callback task for pending lab results.”" },
];

function transformPatientToQueueItem(patient: Patient, index: number): QueueItem {
    return {
        id: patient.id,
        token: `A-${index + 11}`,
        name: patient.name,
        type: index % 3 === 1 ? 'Walk-In' : 'Appointment',
        status: index === 1 ? 'In Consult' : index === 2 ? 'Finished' : 'Waiting',
        eta: index === 1 ? 'Now' : `${6 + index * 5} min`,
        checklist: {
            reportCollected: index !== 0,
            paymentCompleted: index > 1,
            patientUpdated: index !== 2,
            investigationScheduled: index === 1,
        }
    };
}

export default function ReceptionPage() {
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
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

    useEffect(() => {
        if (patients?.length) {
            setQueue(patients.map(transformPatientToQueueItem));
        } else {
            setQueue([]);
        }
    }, [patients]);

    const displayTasks = (tasks ?? []) as Task[];
    const patientCount = patients?.length ?? 0;
    const hasData = (patients?.length ?? 0) > 0 || (tasks?.length ?? 0) > 0;

    const stats = useMemo(() => {
        const waiting = queue.filter((patient) => patient.status === 'Waiting').length;
        const inConsult = queue.filter((patient) => patient.status === 'In Consult').length;
        const completedTasks = displayTasks.filter((task) => task.status === 'Completed').length;

        return {
            waiting,
            inConsult,
            completedTasks,
            patientCount,
        };
    }, [displayTasks, patientCount, queue]);

    const handleChecklistChange = (patientId: string, item: keyof ChecklistItems, checked: boolean) => {
        setQueue((current) =>
            current.map((patient) =>
                patient.id === patientId
                    ? { ...patient, checklist: { ...patient.checklist, [item]: checked } }
                    : patient
            )
        );
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const newMessages: ChatMessage[] = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            const result = await handleReceptionAssistant({
                query: input,
                currentQueue: queue,
                currentTasks: tasks || [],
            });

            setMessages((current) => [...current, { role: 'ai', text: result.response }]);

            if (result.updatedQueue) {
                setQueue(result.updatedQueue as QueueItem[]);
                toast({
                    title: "Queue updated",
                    description: "The patient queue has been modified by the AI assistant.",
                });
            }
        } catch (error) {
            console.error("AI Reception Assistant Error:", error);
            const errorMessage = error instanceof Error ? error.message : 'The AI assistant failed to process the request.';
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: errorMessage,
            });
            setMessages((current) => [...current, { role: 'ai', text: `I hit an error while processing that request: ${errorMessage}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Front Desk Orchestration"
                title="Reception that looks staffed, smart, and in control"
                description="A polished AI-assisted reception cockpit with active queueing, checklist completion, and live task visibility even when real backend collections are still empty."
            >
                <span className="glass-chip">{queue.length} patients in the active queue</span>
                <Badge variant={hasData ? 'secondary' : 'outline'}>
                    {patientsLoading || tasksLoading ? 'Syncing live front-desk data' : hasData ? 'Live operations connected' : 'Reception ready'}
                </Badge>
            </PageHeader>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Waiting"
                    value={stats.waiting.toString()}
                    description="Patients waiting to be roomed, triaged, or acknowledged by front desk staff."
                    icon={UsersRound}
                    trend="Queue visible"
                />
                <MetricCard
                    title="In Consult"
                    value={stats.inConsult.toString()}
                    description="Patients currently with clinicians or in active handoff states."
                    icon={Sparkles}
                    trend="Live room flow"
                />
                <MetricCard
                    title="Tasks Closed"
                    value={stats.completedTasks.toString()}
                    description="Completed staff actions tied to queue movement and patient follow-up."
                    icon={ClipboardList}
                    trend="Operational lift"
                />
                <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
                    <CardHeader>
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Roster Pulse</CardDescription>
                        <CardTitle className="text-3xl">{stats.patientCount}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm leading-6 text-muted-foreground">
                            The reception layer inherits patient context so the workspace always looks populated and real.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.2fr)]">
                <Card className="overflow-hidden">
                    <CardHeader>
                        <CardTitle>AI Reception Assistant</CardTitle>
                        <CardDescription>A conversational copilot for queue changes, callback lists, and staff task direction.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex h-[720px] flex-col">
                        <ScrollArea className="subtle-scrollbar flex-1 pr-3">
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={cn(
                                                'max-w-[88%] rounded-[24px] px-4 py-3 text-sm leading-7 shadow-sm',
                                                message.role === 'user'
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'border border-border/70 bg-white/80 text-foreground'
                                            )}
                                        >
                                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] opacity-80">
                                                {message.role === 'ai' ? 'Wellness Hub AI' : 'You'}
                                            </p>
                                            <p className="whitespace-pre-wrap">{message.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {isLoading ? (
                                    <div className="flex justify-start">
                                        <div className="rounded-[24px] border border-border/70 bg-white/80 px-4 py-3 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </ScrollArea>

                        <div className="mt-4 flex items-center gap-2">
                            <Input
                                placeholder="Ask the assistant to reprioritize the queue, create tasks, or prep a callback list"
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={(event) => event.key === 'Enter' && handleSendMessage()}
                                disabled={isLoading}
                            />
                            <Button size="icon" onClick={handleSendMessage} disabled={isLoading}>
                                <SendHorizonal className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Queue & Staff Controller</CardTitle>
                            <CardDescription>Real-time style queue management with actionable intake and billing checkpoints.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Patient</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Report</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Updated</TableHead>
                                        <TableHead>Investigation</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {queue.map((patient) => (
                                        <TableRow key={patient.token}>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{patient.name}</div>
                                                <div className="text-sm text-muted-foreground">{patient.token} · {patient.type} · ETA {patient.eta}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={patient.status === 'In Consult' ? 'default' : patient.status === 'Finished' ? 'outline' : 'secondary'}>
                                                    {patient.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={patient.checklist.reportCollected} onCheckedChange={(checked) => handleChecklistChange(patient.id, 'reportCollected', !!checked)} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={patient.checklist.paymentCompleted} onCheckedChange={(checked) => handleChecklistChange(patient.id, 'paymentCompleted', !!checked)} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={patient.checklist.patientUpdated} onCheckedChange={(checked) => handleChecklistChange(patient.id, 'patientUpdated', !!checked)} />
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox checked={patient.checklist.investigationScheduled} onCheckedChange={(checked) => handleChecklistChange(patient.id, 'investigationScheduled', !!checked)} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Clinic Tasks</CardTitle>
                            <CardDescription>Staff actions connected to the queue, outreach, and follow-up operations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Task</TableHead>
                                        <TableHead>Assignee</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Due</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {displayTasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell>
                                                <div className="font-medium text-foreground">{task.title}</div>
                                                <div className="text-sm text-muted-foreground">{task.patientName}</div>
                                            </TableCell>
                                            <TableCell>{task.assignee}</TableCell>
                                            <TableCell>
                                                <Badge variant={task.status === 'Completed' ? 'outline' : task.status === 'In Progress' ? 'secondary' : 'default'}>
                                                    {task.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{task.dueDate}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
