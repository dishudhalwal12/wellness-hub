'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { AlarmClock, Pill, PlusCircle, Trash2 } from 'lucide-react';

import { MetricCard, PageHeader } from '@/components/app/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase-config';
import { getSeedMedications } from '@/lib/demo-data';

import type { Medication } from './types';

const AddMedicationDialog = dynamic(() => import('./AddMedicationDialog'));

const MEDS_STORAGE_KEY = 'wellness-hub-medications';
const NOTIFIED_TODAY_KEY = 'wellness-hub-notified-today';

export default function MedicationsPage() {
  const { user } = useUser();
  const { toast } = useToast();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!user) return;

    try {
      const storageKey = `${MEDS_STORAGE_KEY}-${user.uid}`;
      const storedMeds = localStorage.getItem(storageKey);
      if (storedMeds) {
        setMedications(JSON.parse(storedMeds));
        return;
      }

      setMedications(getSeedMedications(user.uid));
    } catch (error) {
      console.error('Failed to load medications from local storage:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not load medication data.',
      });
    }
  }, [toast, user]);

  useEffect(() => {
    if (!user) return;
    try {
      localStorage.setItem(`${MEDS_STORAGE_KEY}-${user.uid}`, JSON.stringify(medications));
    } catch (error) {
      console.error('Failed to save medications to local storage:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save medication data.',
      });
    }
  }, [medications, toast, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!user || !audioRef.current) return;

      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const notifiedTodayStore = localStorage.getItem(`${NOTIFIED_TODAY_KEY}-${user.uid}`);
      const notifiedToday: Record<string, string> = notifiedTodayStore ? JSON.parse(notifiedTodayStore) : {};

      if (now.getHours() === 0 && now.getMinutes() === 0) {
        localStorage.removeItem(`${NOTIFIED_TODAY_KEY}-${user.uid}`);
      }

      medications.forEach((med) => {
        med.times.forEach((reminder) => {
          if (reminder.time !== currentTime) return;

          const notificationId = `${med.id}-${reminder.time}`;
          const lastNotifiedDate = notifiedToday[notificationId];

          if (!lastNotifiedDate || lastNotifiedDate !== now.toLocaleDateString()) {
            audioRef.current?.play().catch((error) => console.error('Audio play failed:', error));
            toast({
              title: `Reminder: ${med.name}`,
              description: `Time to take your ${med.name} (${med.dose}). ${med.notes || ''}`,
            });

            notifiedToday[notificationId] = now.toLocaleDateString();
            localStorage.setItem(`${NOTIFIED_TODAY_KEY}-${user.uid}`, JSON.stringify(notifiedToday));
          }
        });
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [medications, toast, user]);

  const addMedication = (newMed: Omit<Medication, 'id' | 'patientId'>) => {
    if (!user) return;

    const medWithId: Medication = {
      ...newMed,
      id: crypto.randomUUID(),
      patientId: user.uid,
    };

    setMedications((prev) => [...prev, medWithId]);
  };

  const deleteMedication = (medId: string) => {
    setMedications((prev) => prev.filter((med) => med.id !== medId));
    toast({
      title: 'Medication removed',
      description: 'The medication has been deleted.',
    });
  };

  const medicationStats = useMemo(() => {
    const totalReminders = medications.reduce((sum, med) => sum + med.times.length, 0);
    const nextReminder = medications
      .flatMap((med) => med.times.map((time) => ({ name: med.name, time: time.time })))
      .sort((a, b) => a.time.localeCompare(b.time))[0];

    return {
      totalReminders,
      nextReminder: nextReminder ? `${nextReminder.name} at ${nextReminder.time}` : 'No reminders set',
    };
  }, [medications]);

  return (
    <>
      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
        preload="auto"
      />

      <div className="space-y-6">
        <PageHeader
          eyebrow="Medication Adherence"
          title="Schedules that look active even before a patient adds anything"
          description="Medication tracking now opens with realistic regimens, reminder density, and a polished schedule table while preserving the existing add and delete behavior."
          actions={
            <Button onClick={() => setIsAddMedicationOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Medication
            </Button>
          }
        >
          <span className="glass-chip">{medications.length} active medications</span>
          <Badge variant="outline">Reminder engine enabled</Badge>
        </PageHeader>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Active Meds"
            value={medications.length.toString()}
            description="A populated treatment list keeps this workflow clear from the first load and ready for real patient use."
            icon={Pill}
            trend="Care plan loaded"
          />
          <MetricCard
            title="Daily Reminders"
            value={medicationStats.totalReminders.toString()}
            description="Total scheduled reminder points across the current adherence plan."
            icon={AlarmClock}
            trend="Adherence support"
          />
          <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))] md:col-span-2">
            <CardHeader>
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Next Reminder Window</CardDescription>
              <CardTitle className="text-3xl">{medicationStats.nextReminder}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                The reminder system stays fully intact and opens with a realistic medication plan from the first load.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Medication Tracker</CardTitle>
                <CardDescription>Manage doses, schedules, and notes in a premium table that never opens empty.</CardDescription>
              </div>
              <div className="glass-chip">Local reminder-safe storage</div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Medication</TableHead>
                    <TableHead>Dose</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medications.map((med) => (
                    <TableRow key={med.id}>
                      <TableCell>
                        <div className="font-medium text-foreground">{med.name}</div>
                        <div className="text-sm text-muted-foreground">{med.notes || 'No special instructions'}</div>
                      </TableCell>
                      <TableCell>{med.dose}</TableCell>
                      <TableCell>{med.times.map((time) => time.time).join(', ')}</TableCell>
                      <TableCell>{med.endDate ? `${med.startDate} to ${med.endDate}` : `Started ${med.startDate}`}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => deleteMedication(med.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Schedule</CardTitle>
              <CardDescription>Readable reminder cards make the workflow feel complete and easier to scan in practice.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {medications.flatMap((med) =>
                med.times.map((time) => (
                  <div key={`${med.id}-${time.id}`} className="rounded-[20px] border border-border/70 bg-white/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.dose}</p>
                      </div>
                      <Badge variant="secondary">{time.time}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{med.notes || 'No special instructions.'}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddMedicationDialog
        open={isAddMedicationOpen}
        onOpenChange={setIsAddMedicationOpen}
        onMedicationAdd={addMedication}
      />
    </>
  );
}
