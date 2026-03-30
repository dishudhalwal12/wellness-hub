'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Pill, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Medication, ReminderTime } from './types';

export default function AddMedicationDialog({
  open,
  onOpenChange,
  onMedicationAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMedicationAdd: (med: Omit<Medication, 'id' | 'patientId'>) => void;
}) {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [times, setTimes] = useState<ReminderTime[]>([{ id: crypto.randomUUID(), time: '09:00' }]);
  const { toast } = useToast();

  const handleAddTime = () => {
    if (times.length < 5) {
      setTimes([...times, { id: crypto.randomUUID(), time: '' }]);
    }
  };

  const handleRemoveTime = (id: string) => {
    if (times.length > 1) {
      setTimes(times.filter((t) => t.id !== id));
    }
  };

  const handleTimeChange = (id: string, newTime: string) => {
    setTimes(times.map((t) => (t.id === id ? { ...t, time: newTime } : t)));
  };

  const handleSave = () => {
    if (!name || !dose || !startDate) {
      toast({
        variant: 'destructive',
        title: 'Missing Fields',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    onMedicationAdd({ name, dose, times, startDate, endDate, notes });
    toast({
      title: 'Medication Added',
      description: `${name} has been added to the schedule.`,
    });
    setName('');
    setDose('');
    setNotes('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setTimes([{ id: crypto.randomUUID(), time: '09:00' }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Pill /> Add New Medication</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Paracetamol" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dose">Dose</Label>
            <Input id="dose" value={dose} onChange={(e) => setDose(e.target.value)} placeholder="e.g., 500mg" />
          </div>
          <div className="grid gap-2">
            <Label>Times</Label>
            <div className="space-y-2">
              {times.map((t, index) => (
                <div key={t.id} className="flex items-center gap-2">
                  <Input type="time" value={t.time} onChange={(e) => handleTimeChange(t.id, e.target.value)} />
                  {index > 0 ? (
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTime(t.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddTime}>Add Time</Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Take with food"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Medication</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
