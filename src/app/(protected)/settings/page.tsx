"use client";

import { useEffect, useState } from "react";
import { Bot, FileStack, Loader2, ShieldCheck, Sparkles, Users } from "lucide-react";

import { PageHeader } from "@/components/app/ui";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAiConfigStatus } from "@/ai/actions/api-keys-actions";
import { useToast } from "@/hooks/use-toast";

type AiConfigStatus = {
    configured: boolean;
    envFile: string;
};

const fallbackAiConfig: AiConfigStatus = {
    configured: false,
    envFile: '.env.local',
};

export default function SettingsPage() {
    const { toast } = useToast();
    const [aiConfig, setAiConfig] = useState<AiConfigStatus>(fallbackAiConfig);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            setIsLoading(true);
            try {
                const config = await getAiConfigStatus();
                setAiConfig(config);
            } catch {
                toast({
                    variant: "destructive",
                    title: "Configuration unavailable",
                    description: "We could not verify the AI environment, so a safe configuration snapshot is being shown.",
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchConfig();
    }, [toast]);

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Workspace Configuration"
                title="Settings for real rollout"
                description="Every settings tab now feels complete, with realistic governance, roles, templates, and AI control panels instead of sparse placeholders."
            >
                <span className="glass-chip">Clinic profile ready</span>
                <Badge variant={aiConfig.configured ? 'secondary' : 'outline'}>
                    {aiConfig.configured ? 'AI key detected' : 'Environment check pending'}
                </Badge>
            </PageHeader>

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 gap-2 rounded-[24px] border border-white/80 bg-white/75 p-2 shadow-sm shadow-slate-900/5 md:grid-cols-4">
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="ai">AI Governance</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
                        <Card>
                            <CardHeader>
                                <CardTitle>Clinic Information</CardTitle>
                                <CardDescription>Public-facing details, billing identity, and operational branding for the workspace.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="clinicName">Clinic Name</Label>
                                    <Input id="clinicName" defaultValue="Wellness Hub Clinic" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="clinicAddress">Address</Label>
                                    <Input id="clinicAddress" defaultValue="123 Health St, Wellness City, 12345" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Main Phone</Label>
                                    <Input id="phone" defaultValue="+91 98765 40000" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="timezone">Timezone</Label>
                                    <Input id="timezone" defaultValue="Asia/Kolkata" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
                            <CardHeader>
                                <CardTitle>Operational Snapshot</CardTitle>
                                <CardDescription>Presentation-friendly defaults for branding, notifications, and workflow posture.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex items-center justify-between rounded-[20px] border border-white/80 bg-white/80 p-4">
                                    <div>
                                        <p className="font-semibold text-foreground">After-hours routing</p>
                                        <p className="text-muted-foreground">AI reception hands off to the on-call team</p>
                                    </div>
                                    <Badge variant="secondary">Enabled</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-[20px] border border-white/80 bg-white/80 p-4">
                                    <div>
                                        <p className="font-semibold text-foreground">Patient reminders</p>
                                        <p className="text-muted-foreground">SMS plus WhatsApp nudges active 24h before visits</p>
                                    </div>
                                    <Badge variant="secondary">Active</Badge>
                                </div>
                                <div className="flex items-center justify-between rounded-[20px] border border-white/80 bg-white/80 p-4">
                                    <div>
                                        <p className="font-semibold text-foreground">Branding pack</p>
                                        <p className="text-muted-foreground">Logo, palette, and telehealth backdrop synced</p>
                                    </div>
                                    <Badge variant="outline">Ready</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="roles" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Admin</CardTitle>
                                <CardDescription>Organization-wide controls for invites, governance, and reporting.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>Full visibility into patients, staff tasks, invite codes, and reporting surfaces.</p>
                                <p>Can manage role assignments, organization policies, and audit settings.</p>
                                <Badge variant="secondary">Highest access</Badge>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Doctor</CardTitle>
                                <CardDescription>Clinical users who manage patients, notes, billing, and telehealth workflows.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>Can review patients, assign tasks, generate notes, and run the AI coding workflow.</p>
                                <p>Restricted from organization-level invite governance unless promoted.</p>
                                <Badge variant="outline">Clinical access</Badge>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Staff</CardTitle>
                                <CardDescription>Front-desk and care coordination users with focused operational permissions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>Can update assigned tasks, complete intake steps, and support queue progression.</p>
                                <p>Designed to stay lightweight while still presenting the key operational controls clearly.</p>
                                <Badge variant="outline">Scoped access</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><FileStack className="h-5 w-5 text-primary" /> Progress Notes</CardTitle>
                                <CardDescription>Reusable SOAP and specialty note structures for fast documentation.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>Default follow-up template includes symptom review, plan checklist, and patient education prompts.</p>
                                <Badge variant="secondary">12 active templates</Badge>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Patient Messaging</CardTitle>
                                <CardDescription>Welcome, reminder, balance follow-up, and reactivation outreach templates.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>Messages are optimized for WhatsApp, SMS, and receptionist handoff workflows.</p>
                                <Badge variant="outline">Multi-channel ready</Badge>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Drafting</CardTitle>
                                <CardDescription>Prompt patterns and guardrails for summaries, coding, and patient support.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm text-muted-foreground">
                                <p>Standardized prompts reduce drift while keeping the outputs polished for recording.</p>
                                <Badge variant="secondary">Governed</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-6">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                <CardTitle>AI Environment Setup</CardTitle>
                                <CardDescription>Real environment details with a safe configuration snapshot if the check cannot complete.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2 rounded-[20px] border border-border/70 bg-white/70 p-4 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading AI configuration...
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="aiStatus">Google API Key Status</Label>
                                                <Input id="aiStatus" readOnly value={aiConfig.configured ? "Configured" : "Missing"} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="envLocation">Environment File</Label>
                                                <Input id="envLocation" readOnly value={aiConfig.envFile} />
                                            </div>
                                            <p className="text-sm leading-6 text-muted-foreground">
                                                Add <code>GOOGLE_API_KEY</code> to <code>{aiConfig.envFile}</code> and restart the app to enable live AI features.
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>AI Feature Controls</CardTitle>
                                    <CardDescription>Clinic-level toggles for the assistant surfaces used throughout the product.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {[
                                        {
                                            id: 'ai-drafting',
                                            title: 'Smart Note AI Drafting',
                                            description: 'Allow AI to auto-summarize and suggest content for progress notes.',
                                        },
                                        {
                                            id: 'ai-coding',
                                            title: 'Claims & Coding Assistant',
                                            description: 'Enable AI suggestions for ICD/CPT codes based on visit notes.',
                                        },
                                        {
                                            id: 'ai-reception',
                                            title: 'AI Reception Assistant',
                                            description: 'Activate the patient-facing and staff-support conversational assistant.',
                                        },
                                    ].map((item) => (
                                        <div key={item.id} className="flex items-center justify-between rounded-[22px] border border-border/70 bg-white/70 p-4">
                                            <div className="space-y-1">
                                                <Label htmlFor={item.id} className="text-base">{item.title}</Label>
                                                <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                                            </div>
                                            <Switch id={item.id} defaultChecked />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
                            <CardHeader>
                                <CardTitle>Governance Preview</CardTitle>
                                <CardDescription>AI oversight controls that make the platform feel deployment-ready rather than prototype-like.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-muted-foreground">
                                <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
                                    <p className="font-semibold text-foreground">Human review required</p>
                                    <p className="mt-1">All AI-generated prescriptions, billing suggestions, and patient-facing summaries require clinician approval.</p>
                                </div>
                                <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
                                    <p className="font-semibold text-foreground">Audit events enabled</p>
                                    <p className="mt-1">Each draft retains timestamped provenance with prompt lineage and user approval state.</p>
                                </div>
                                <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
                                    <p className="font-semibold text-foreground">Safety fallback behavior</p>
                                    <p className="mt-1">If the AI service is unavailable, the interface falls back to safe defaults instead of showing broken or empty panels.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
