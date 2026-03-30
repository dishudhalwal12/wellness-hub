import { Badge } from '@/components/ui/badge';

export type RecentAppointment = {
  id: string;
  patientName: string;
  clinician: string;
  time: string;
  status: 'Confirmed' | 'Checked In' | 'In Room' | 'Follow-up';
  type: 'Video' | 'In-person';
  room: string;
};

const statusVariantMap = {
  Confirmed: 'outline',
  'Checked In': 'secondary',
  'In Room': 'default',
  'Follow-up': 'secondary',
} as const;

export function RecentAppointments({ appointments }: { appointments: RecentAppointment[] }) {
  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="flex items-center justify-between gap-4 rounded-[22px] border border-border/70 bg-white/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
        >
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{appointment.patientName}</p>
            <p className="text-sm text-muted-foreground">
              {appointment.clinician} · {appointment.type} · {appointment.room}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">{appointment.time}</p>
            <Badge variant={statusVariantMap[appointment.status]} className="mt-2">
              {appointment.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
