'use client';

import { useState } from 'react';
import { Bot, FilePenLine, Loader2, RefreshCcw, Save, Sparkles } from 'lucide-react';
import { aiSmartNotesDrafting } from '@/ai/ai-smart-notes-drafting';
import { useDoc, useFirestore, useUser } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

import { PageHeader } from '@/components/app/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { demoNoteDraft } from '@/lib/demo-data';

export default function NotesPage() {
  const [subjective, setSubjective] = useState("Patient reports worsening headaches over the past 2 weeks, primarily in the frontal region. Describes it as a 'tight band' around the head. No aura, no nausea. Worse after long workdays. Improving slightly with better sleep quality but still persistent.");
  const [objective, setObjective] = useState("Vital signs stable. BP 120/80. Neuro exam intact. Cranial nerves II-XII grossly normal. Tenderness noted on palpation of pericranial muscles. No focal deficits.");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<{ assessmentSuggestion: string, planSuggestion: string } | null>(null);
  
  const { profile } = useUser();
  const firestore = useFirestore();
  const { data: orgData } = useDoc(profile?.orgId ? doc(firestore!, 'orgs', profile.orgId) : null);
  const orgApiKey = orgData?.googleApiKey;
  const { toast } = useToast();

  const handleGenerateSuggestions = async () => {
    if (!subjective.trim() && !objective.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please enter subjective or objective notes before generating suggestions.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const patientData = JSON.stringify({ subjective, objective });
      const result = await aiSmartNotesDrafting({ 
        patientData,
        orgId: profile?.orgId || '',
        apiKey: orgApiKey
      });
      setSuggestions(result);
      toast({
        title: 'Suggestions Generated',
        description: 'AI has analyzed your notes and generated suggestions.',
      });
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: 'Could not generate suggestions. Please check your API key.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleIncorporate = () => {
    if (suggestions) {
      setAssessment(suggestions.assessmentSuggestion);
      setPlan(suggestions.planSuggestion);
      setSuggestions(null);
      toast({
        title: 'Suggestions Incorporated',
        description: 'Assessment and Plan have been updated.',
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clinical Documentation"
        title="Smart notes that already feel complete"
        description="This workspace now opens with realistic patient context, a filled note draft, and AI suggestions so the recording never lands on empty text areas."
        actions={
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Note
          </Button>
        }
      >
        <span className="glass-chip">Patient: Not Selected</span>
        <Badge variant="outline">AI draft assist loaded</Badge>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FilePenLine className="h-5 w-5 text-primary" /> Progress Note</CardTitle>
              <CardDescription>Start documenting a new patient visit.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Subjective</h3>
                <Textarea value={subjective} onChange={(event) => setSubjective(event.target.value)} className="min-h-[120px]" />
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Objective</h3>
                <Textarea value={objective} onChange={(event) => setObjective(event.target.value)} className="min-h-[120px]" />
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Assessment</h3>
                <Textarea value={assessment} onChange={(event) => setAssessment(event.target.value)} className="min-h-[120px]" />
              </div>
              <div className="grid gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Plan</h3>
                <Textarea value={plan} onChange={(event) => setPlan(event.target.value)} className="min-h-[120px]" />
              </div>
            </CardContent>
            <CardFooter className="justify-between gap-3">
              <Button variant="outline">Save Draft</Button>
              <Button>Finalize Note</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
            <CardHeader>
              <CardTitle>Visit Snapshot</CardTitle>
              <CardDescription>Fast clinical context so the note screen never feels sparse.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
                <p className="font-semibold text-foreground">Chief Concern</p>
                <p className="mt-1">Recurring headaches during long workdays with improving sleep quality.</p>
              </div>
              <div className="rounded-[20px] border border-white/80 bg-white/80 p-4">
                <p className="font-semibold text-foreground">Today&apos;s Goals</p>
                <p className="mt-1">Confirm symptom trend, reinforce hydration, and finalize a conservative treatment plan.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Draft Assist</CardTitle>
              <CardDescription>Live-looking suggestions based on the current patient and note context.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Loader2 className="mb-4 h-12 w-12 animate-spin text-primary" />
                  <p>AI is analyzing your notes and drafting clinical suggestions...</p>
                </div>
              ) : suggestions ? (
                <div className="space-y-4">
                  <div className="rounded-[22px] border border-primary/20 bg-primary/5 p-4 text-sm">
                    <h4 className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="h-4 w-4" /> Assessment Suggestion</h4>
                    <div className="mt-2 prose prose-sm max-w-none text-muted-foreground">
                      <ReactMarkdown>{suggestions.assessmentSuggestion}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-primary/20 bg-primary/5 p-4 text-sm">
                    <h4 className="flex items-center gap-2 font-semibold text-primary"><Sparkles className="h-4 w-4" /> Plan Suggestion</h4>
                    <div className="mt-2 prose prose-sm max-w-none text-muted-foreground">
                      <ReactMarkdown>{suggestions.planSuggestion}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Bot className="mb-4 h-12 w-12 opacity-20" />
                  <p>AI suggestions will appear here as you begin documenting the patient visit.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
              <Button 
                variant="secondary" 
                disabled={!suggestions || isLoading}
                onClick={handleIncorporate}
              >
                Incorporate Suggestions
              </Button>
              <Button 
                variant="outline" 
                disabled={isLoading}
                onClick={handleGenerateSuggestions}
              >
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                {suggestions ? 'Regenerate' : 'Generate Suggestions'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
