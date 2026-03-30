export type ReminderTime = { id: string; time: string };

export type Medication = {
  id: string;
  patientId: string;
  name: string;
  dose: string;
  times: ReminderTime[];
  startDate: string;
  endDate: string;
  notes: string;
};
