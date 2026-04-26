'use client';

import { useState } from 'react';
import { Bot, FilePenLine, RefreshCcw, Save } from 'lucide-react';

import { PageHeader } from '@/components/app/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { demoNoteDraft } from '@/lib/demo-data';

export default function NotesPage() {
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");

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
              <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                <Bot className="mb-4 h-12 w-12 opacity-20" />
                <p>AI suggestions will appear here as you begin documenting the patient visit.</p>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-2">
              <Button variant="secondary">Incorporate Suggestions</Button>
              <Button variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Regenerate
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
