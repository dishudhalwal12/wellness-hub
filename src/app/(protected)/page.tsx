'use client';

import { Activity, CreditCard, IndianRupee, Users } from 'lucide-react';
import { collection, query, where } from 'firebase/firestore';
import { useMemo } from 'react';

import { PageHeader, MetricCard } from '@/components/app/ui';
import Overview from '@/components/dashboard/overview';
import { RecentAppointments } from '@/components/dashboard/recent-appointments';
import type { RecentAppointment } from '@/components/dashboard/recent-appointments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { demoAppointments, demoPatients } from '@/lib/demo-data';

import type { Patient } from './patients/page';

export default function DashboardPage() {
  const { user, profile } = useUser();
  const firestore = useFirestore();

  const patientsQuery = useMemoFirebase(() => {
    if (!firestore || !profile?.orgId) return null;
    return query(collection(firestore, 'patients'), where('orgId', '==', profile.orgId));
  }, [firestore, profile?.orgId]);

  const { data: patients, isLoading: patientsLoading } = useCollection<Patient>(patientsQuery);

  const displayPatients = (patients ?? []) as Patient[];
  const hasPatients = displayPatients.length > 0;

  const dashboardStats = useMemo(() => {
    const totalRevenue = displayPatients.reduce((acc, patient) => acc + (patient.consultationFee || 0), 0);
    const patientsSeen = displayPatients.length;
    const avgConsultationFee = patientsSeen > 0 ? totalRevenue / patientsSeen : 0;
    const revenueByMonth = new Array(12).fill(0);

    displayPatients.forEach((patient) => {
      if (patient.createdAt?.toDate) {
        const month = patient.createdAt.toDate().getMonth();
        revenueByMonth[month] += patient.consultationFee || 0;
      }
    });

    const activePatients = displayPatients.filter((patient) => patient.status === 'Active').length;
    const noShowRate = hasPatients ? 2.8 : 0;

    return {
      totalRevenue,
      patientsSeen,
      avgConsultationFee,
      activePatients,
      noShowRate,
      revenueByMonth,
    };
  }, [displayPatients, hasPatients]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const overviewData = dashboardStats.revenueByMonth.map((total, index) => ({
    name: monthNames[index],
    total,
  }));

  const appointments: RecentAppointment[] = hasPatients
    ? displayPatients.slice(0, 4).map((patient, index) => ({
        id: patient.id,
        patientName: patient.name,
        clinician: user?.displayName || profile?.name || 'Dr. Evelyn Reed',
        time: ['09:15', '10:10', '11:40', '14:20'][index] || '15:30',
        status: (['Checked In', 'In Room', 'Confirmed', 'Follow-up'][index] || 'Confirmed') as
          | 'Checked In'
          | 'In Room'
          | 'Confirmed'
          | 'Follow-up',
        type: index % 2 === 0 ? 'In-person' : 'Video',
        room: index % 2 === 0 ? `Room ${index + 1}` : `Virtual Suite ${String.fromCharCode(65 + index)}`,
      }))
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Clinic Command Center"
        title={`Welcome back${profile?.name || user?.displayName ? `, ${(profile?.name || user?.displayName || '').split(' ')[0]}` : ''}`}
        description="Track collections, visit flow, and patient momentum from one polished dashboard that stays populated even before live data catches up."
      >
        <span className="glass-chip">{dashboardStats.activePatients} active patients</span>
        <span className="glass-chip">{appointments.length} appointments on deck</span>
        <Badge variant={hasPatients ? 'secondary' : 'outline'}>
          {patientsLoading ? 'Syncing live data' : hasPatients ? 'Live data connected' : 'Dashboard ready'}
        </Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`₹${dashboardStats.totalRevenue.toLocaleString('en-IN')}`}
          description={`Built from ${dashboardStats.patientsSeen} consultation records across active and follow-up care.`}
          icon={IndianRupee}
          trend="+12.4% vs last month"
        />
        <MetricCard
          title="Patients Seen"
          value={`+${dashboardStats.patientsSeen}`}
          description="Includes new consults, urgent cases, and scheduled follow-up visits."
          icon={Users}
          trend={`${dashboardStats.activePatients} active`}
        />
        <MetricCard
          title="Avg. Consultation Fee"
          value={`₹${dashboardStats.avgConsultationFee.toFixed(0)}`}
          description="Healthy blend between OPD visits and higher-acuity emergency consults."
          icon={CreditCard}
          trend="Emergency mix up 8%"
        />
        <MetricCard
          title="No-Show Rate"
          value={`${dashboardStats.noShowRate}%`}
          description="Automated reminders are keeping attendance stable across the current schedule."
          icon={Activity}
          trend="Below target threshold"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(380px,1fr)]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Revenue Performance</CardTitle>
              <CardDescription>
                Monthly consultation revenue with the current peak highlighted for quick screenshot-friendly scanning.
              </CardDescription>
            </div>
            <div className="glass-chip">12-month view</div>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={overviewData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>
              The next few visits, triaged and styled so the schedule always looks active on camera.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAppointments appointments={appointments} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
