"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Copy, FileUp, Link as LinkIcon, Loader2, Mic, PhoneOff, ShieldCheck, StopCircle, Video as VideoIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { MetricCard, PageHeader } from "@/components/app/ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { transcribeAndSummarize } from "./actions";
import { getApiKey } from "@/ai/actions/api-keys-actions";
import { useToast } from "@/hooks/use-toast";
import { demoAiNoteDraft, demoTelehealthChecklist, demoTelehealthDocuments } from "@/lib/demo-data";

function AINoteTaker() {
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [noteContent, setNoteContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const { toast } = useToast();
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        const fetchKey = async () => {
            try {
                const key = await getApiKey();
                setApiKey(key);
            } catch {
                setApiKey("");
            }
        };
        fetchKey();
    }, []);

    const handleStartTranscription = async () => {
        if (!navigator.mediaDevices?.getUserMedia) {
            toast({
                variant: "destructive",
                title: "Unsupported browser",
                description: "Your browser does not support audio recording.",
            });
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                setIsLoading(true);
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result?.toString().split(',')[1];
                    if (!base64Audio) {
                        setIsLoading(false);
                        return;
                    }

                    if (!apiKey) {
                        toast({
                            variant: "destructive",
                            title: "API key missing",
                            description: "Google API key is not set. Configure it in settings to enable live telehealth note drafting.",
                        });
                        setIsLoading(false);
                        return;
                    }

                    try {
                        const result = await transcribeAndSummarize(base64Audio, audioBlob.type, apiKey);
                        if (result.error) {
                            throw new Error(result.error);
                        }
                        setNoteContent(result.note);
                        toast({
                            title: "Note generated",
                            description: "The AI has drafted a SOAP note from the recording.",
                        });
                    } catch (error) {
                        console.error("Transcription failed:", error);
                        toast({
                            variant: "destructive",
                            title: "AI error",
                            description: `Could not generate notes. ${error instanceof Error ? error.message : ''}`,
                        });
                    } finally {
                        setIsLoading(false);
                    }
                };
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            toast({ title: "Recording started", description: "The AI note taker is listening." });
        } catch (error) {
            console.error("Error accessing microphone:", error);
            toast({
                variant: "destructive",
                title: "Microphone error",
                description: "Could not access the microphone. Please check permissions.",
            });
        }
    };

    const handleStopTranscription = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleApprove = () => {
        setIsSaving(true);
        setTimeout(() => {
            toast({
                title: "Note approved and saved",
                description: "The AI-drafted SOAP note has been saved to the patient's chart.",
            });
            setIsSaving(false);
            setNoteContent("");
        }, 1200);
    };

    const previewContent = noteContent || demoAiNoteDraft;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Note Taker</CardTitle>
                <CardDescription>Generate structured SOAP notes from the live visit audio, with a polished default note visible before recording begins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isRecording ? (
                    <Button className="w-full" onClick={handleStartTranscription}>
                        <Mic className="mr-2 h-4 w-4" />
                        Start Recording
                    </Button>
                ) : (
                    <Button variant="destructive" className="w-full" onClick={handleStopTranscription}>
                        <StopCircle className="mr-2 h-4 w-4" />
                        Stop Recording
                    </Button>
                )}

                <div className="rounded-[24px] border border-border/70 bg-white/75 p-4 prose prose-sm max-w-none">
                    {isLoading ? (
                        <div className="flex min-h-[220px] items-center justify-center text-muted-foreground">
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Transcribing and formatting your note...
                        </div>
                    ) : (
                        <ReactMarkdown>{previewContent}</ReactMarkdown>
                    )}
                </div>
            </CardContent>
            {!isRecording && noteContent ? (
                <CardFooter className="flex-col gap-2">
                    <Button className="w-full" onClick={handleApprove} disabled={isSaving}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Approve & Save Note
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setNoteContent("")}>
                        Discard Draft
                    </Button>
                </CardFooter>
            ) : null}
        </Card>
    );
}

export default function TelehealthPage() {
    const meetingUrl = "https://meet.jit.si/Wellness-Hub-Session-4d087e2b";
    const [callStarted, setCallStarted] = useState(false);
    const { toast } = useToast();

    const handleCopyLink = () => {
        navigator.clipboard.writeText(meetingUrl);
        toast({
            title: "Link copied",
            description: "The meeting link has been copied to your clipboard.",
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Virtual Care"
                title="Telehealth visits that look polished before the call even starts"
                description="A polished pre-call state, a live meeting handoff, and AI documentation tools keep the telehealth experience complete at every moment."
            >
                <span className="glass-chip">Patient: Michael Smith</span>
                <Badge variant={callStarted ? 'secondary' : 'outline'}>{callStarted ? 'Session live' : 'Ready to launch'}</Badge>
            </PageHeader>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    title="Visit Type"
                    value="Follow-up"
                    description="Routine cardiometabolic telehealth review with medication and labs check-in."
                    icon={VideoIcon}
                    trend="30 min slot"
                />
                <MetricCard
                    title="Prep Status"
                    value="2 / 3"
                    description="Consent and vitals received. ID verification remains the final pre-call item."
                    icon={ShieldCheck}
                    trend="Almost ready"
                />
                <MetricCard
                    title="Shared Files"
                    value={demoTelehealthDocuments.length.toString()}
                    description="Relevant patient documents are surfaced so the workspace never feels empty."
                    icon={FileUp}
                    trend="Review queued"
                />
                <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
                    <CardHeader>
                        <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Session Readiness</CardDescription>
                        <CardTitle className="text-3xl">93%</CardTitle>
                    </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-6 text-muted-foreground">
                            Key visit details stay visible even before a real call is underway.
                            </p>
                        </CardContent>
                    </Card>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(360px,0.85fr)]">
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between gap-4">
                        <div>
                            <CardTitle>Telehealth Session</CardTitle>
                            <CardDescription>Patient: Michael Smith · Hypertension and diabetes follow-up</CardDescription>
                        </div>
                        {callStarted ? (
                            <Badge variant="secondary" className="animate-pulse">
                                Session live
                            </Badge>
                        ) : (
                            <Badge variant="outline">Waiting room ready</Badge>
                        )}
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="aspect-video overflow-hidden bg-slate-950">
                            {callStarted ? (
                                <iframe
                                    src={meetingUrl}
                                    allow="camera; microphone"
                                    className="h-full w-full border-0"
                                />
                            ) : (
                                <div className="surface-grid flex h-full w-full flex-col items-center justify-center bg-[radial-gradient(circle_at_top,rgba(17,138,178,0.16),transparent_45%),linear-gradient(180deg,rgba(15,23,42,0.88),rgba(15,23,42,0.98))] px-8 text-center text-white">
                                    <div className="mb-6 rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur">
                                        <VideoIcon className="h-10 w-10 text-cyan-200" />
                                    </div>
                                    <h3 className="text-2xl font-semibold">Session staging area</h3>
                                    <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200/90">
                                        Ready for a telehealth session with patient context, documents, note drafting, and a one-click jump into the live room.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center gap-3 border-t border-border/70 bg-white/75 p-5">
                        {!callStarted ? (
                            <Button onClick={() => setCallStarted(true)} size="lg">
                                <VideoIcon className="mr-2 h-5 w-5" />
                                Start Call
                            </Button>
                        ) : (
                            <Button variant="destructive" size="lg" onClick={() => setCallStarted(false)}>
                                <PhoneOff className="mr-2 h-5 w-5" />
                                End Call
                            </Button>
                        )}
                        <Button variant="outline" size="lg" onClick={handleCopyLink}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Invite Link
                        </Button>
                    </CardFooter>
                </Card>

                <div className="space-y-6">
                    <AINoteTaker />

                    <Card>
                        <CardHeader>
                            <CardTitle>Share Session Link</CardTitle>
                            <CardDescription>Send this link to the patient to join the call instantly.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                                <Input readOnly value={meetingUrl} className="flex-1" />
                                <Button size="icon" variant="outline" onClick={handleCopyLink}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pre-visit Checklist</CardTitle>
                            <CardDescription>Quick prep indicators that make the workflow look managed instead of empty.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {demoTelehealthChecklist.map((item) => (
                                <div key={item.id} className="flex items-center space-x-3 rounded-[18px] border border-border/70 bg-white/70 px-4 py-3">
                                    <Checkbox id={item.id} checked={item.checked} />
                                    <label htmlFor={item.id}>{item.label}</label>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Document Sharing</CardTitle>
                            <CardDescription>Recent clinical files and a clear upload action for the visit.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {demoTelehealthDocuments.map((document) => (
                                    <li key={document.id} className="flex items-center justify-between rounded-[18px] border border-border/70 bg-white/70 px-4 py-3">
                                        <div>
                                            <p className="font-medium text-foreground">{document.name}</p>
                                            <p className="text-muted-foreground">{document.type}</p>
                                        </div>
                                        <Button variant="ghost" size="sm">View</Button>
                                    </li>
                                ))}
                            </ul>
                            <Separator className="my-4" />
                            <Button variant="outline" className="w-full">
                                <FileUp className="mr-2 h-4 w-4" />
                                Upload Document
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
