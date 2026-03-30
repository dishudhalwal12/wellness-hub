import type { Medication } from '@/app/(protected)/medications/types';

type MockTimestamp = {
  toDate: () => Date;
};

const mockTimestamp = (value: string): MockTimestamp => ({
  toDate: () => new Date(value),
});

export type DemoPatient = {
  id: string;
  orgId: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  status: 'Active' | 'New' | 'Inactive';
  lastVisit: string;
  avatarId: string;
  createdAt: MockTimestamp;
  visitType: 'OPD' | 'Emergency';
  consultationFee: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  outstandingBalance: number;
  nextVisit: string;
};

export type DemoTask = {
  id: string;
  title: string;
  patientName: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  orgId: string;
  assignedBy: string;
  createdAt: string;
};

export type DemoAppointment = {
  id: string;
  patientName: string;
  clinician: string;
  time: string;
  status: 'Confirmed' | 'Checked In' | 'In Room' | 'Follow-up';
  type: 'Video' | 'In-person';
  room: string;
};

export type DemoQueueItem = {
  id: string;
  token: string;
  name: string;
  type: 'Appointment' | 'Walk-In';
  status: 'Waiting' | 'In Consult' | 'Finished';
  eta: string;
  checklist: {
    reportCollected: boolean;
    paymentCompleted: boolean;
    patientUpdated: boolean;
    investigationScheduled: boolean;
  };
};

export type DemoInvite = {
  id: string;
  code: string;
  roleAllowed: 'doctor' | 'staff';
  usesCount: number;
  maxUses: number;
  expiresAt: number | null;
};

export const demoPatients: DemoPatient[] = [
  {
    id: 'demo-patient-1',
    orgId: 'demo-org',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@example.com',
    phone: '+91 98765 43210',
    dob: '1988-06-14',
    status: 'Active',
    lastVisit: '2026-03-28T09:30:00.000Z',
    avatarId: 'user-1',
    createdAt: mockTimestamp('2026-01-11T09:30:00.000Z'),
    visitType: 'OPD',
    consultationFee: 1200,
    riskLevel: 'Medium',
    outstandingBalance: 0,
    nextVisit: '2026-04-15T11:30:00.000Z',
  },
  {
    id: 'demo-patient-2',
    orgId: 'demo-org',
    name: 'Nisha Kapoor',
    email: 'nisha.kapoor@example.com',
    phone: '+91 99876 51234',
    dob: '1979-11-03',
    status: 'Active',
    lastVisit: '2026-03-26T12:00:00.000Z',
    avatarId: 'user-2',
    createdAt: mockTimestamp('2026-02-03T12:00:00.000Z'),
    visitType: 'Emergency',
    consultationFee: 2500,
    riskLevel: 'High',
    outstandingBalance: 1800,
    nextVisit: '2026-04-02T10:00:00.000Z',
  },
  {
    id: 'demo-patient-3',
    orgId: 'demo-org',
    name: 'Rohan Sen',
    email: 'rohan.sen@example.com',
    phone: '+91 99123 45454',
    dob: '1992-02-19',
    status: 'New',
    lastVisit: '2026-03-22T14:45:00.000Z',
    avatarId: 'user-3',
    createdAt: mockTimestamp('2026-03-04T14:45:00.000Z'),
    visitType: 'OPD',
    consultationFee: 900,
    riskLevel: 'Low',
    outstandingBalance: 0,
    nextVisit: '2026-04-08T16:15:00.000Z',
  },
  {
    id: 'demo-patient-4',
    orgId: 'demo-org',
    name: 'Sara Thomas',
    email: 'sara.thomas@example.com',
    phone: '+91 98111 92345',
    dob: '1967-08-30',
    status: 'Active',
    lastVisit: '2026-03-29T08:45:00.000Z',
    avatarId: 'user-4',
    createdAt: mockTimestamp('2026-03-18T08:45:00.000Z'),
    visitType: 'Emergency',
    consultationFee: 3200,
    riskLevel: 'High',
    outstandingBalance: 950,
    nextVisit: '2026-04-01T09:00:00.000Z',
  },
  {
    id: 'demo-patient-5',
    orgId: 'demo-org',
    name: 'Kabir Malhotra',
    email: 'kabir.malhotra@example.com',
    phone: '+91 97654 33445',
    dob: '1984-04-08',
    status: 'Inactive',
    lastVisit: '2025-12-12T10:15:00.000Z',
    avatarId: 'user-5',
    createdAt: mockTimestamp('2025-09-20T10:15:00.000Z'),
    visitType: 'OPD',
    consultationFee: 850,
    riskLevel: 'Medium',
    outstandingBalance: 0,
    nextVisit: '2026-04-22T12:15:00.000Z',
  },
];

export const demoAppointments: DemoAppointment[] = [
  {
    id: 'appt-1',
    patientName: 'Aarav Mehta',
    clinician: 'Dr. Evelyn Reed',
    time: '09:15',
    status: 'Checked In',
    type: 'In-person',
    room: 'Room 2',
  },
  {
    id: 'appt-2',
    patientName: 'Nisha Kapoor',
    clinician: 'Dr. Marcus Chen',
    time: '10:00',
    status: 'In Room',
    type: 'Video',
    room: 'Virtual Suite A',
  },
  {
    id: 'appt-3',
    patientName: 'Rohan Sen',
    clinician: 'Dr. Evelyn Reed',
    time: '11:30',
    status: 'Confirmed',
    type: 'In-person',
    room: 'Room 1',
  },
  {
    id: 'appt-4',
    patientName: 'Sara Thomas',
    clinician: 'Dr. Evelyn Reed',
    time: '14:10',
    status: 'Follow-up',
    type: 'Video',
    room: 'Virtual Suite B',
  },
];

export const demoTasks: DemoTask[] = [
  {
    id: 'task-1',
    title: 'Review elevated lipid panel',
    patientName: 'Aarav Mehta',
    assignee: 'Alice Johnson',
    dueDate: '2026-03-31',
    priority: 'High',
    status: 'To Do',
    orgId: 'demo-org',
    assignedBy: 'Dr. Evelyn Reed',
    createdAt: '2026-03-29T10:00:00.000Z',
  },
  {
    id: 'task-2',
    title: 'Confirm fasting instructions',
    patientName: 'Nisha Kapoor',
    assignee: 'Priya Singh',
    dueDate: '2026-03-30',
    priority: 'Medium',
    status: 'In Progress',
    orgId: 'demo-org',
    assignedBy: 'Dr. Marcus Chen',
    createdAt: '2026-03-29T11:20:00.000Z',
  },
  {
    id: 'task-3',
    title: 'Schedule 2-week tele-follow-up',
    patientName: 'Rohan Sen',
    assignee: 'Alice Johnson',
    dueDate: '2026-04-01',
    priority: 'Low',
    status: 'Completed',
    orgId: 'demo-org',
    assignedBy: 'Dr. Evelyn Reed',
    createdAt: '2026-03-28T08:45:00.000Z',
  },
  {
    id: 'task-4',
    title: 'Collect prior imaging records',
    patientName: 'Sara Thomas',
    assignee: 'Nitin Rao',
    dueDate: '2026-03-31',
    priority: 'High',
    status: 'To Do',
    orgId: 'demo-org',
    assignedBy: 'Dr. Evelyn Reed',
    createdAt: '2026-03-29T09:45:00.000Z',
  },
  {
    id: 'task-5',
    title: 'Update insurance authorization',
    patientName: 'Kabir Malhotra',
    assignee: 'Priya Singh',
    dueDate: '2026-04-02',
    priority: 'Medium',
    status: 'In Progress',
    orgId: 'demo-org',
    assignedBy: 'Dr. Marcus Chen',
    createdAt: '2026-03-27T13:10:00.000Z',
  },
];

export const demoStaffTasks = [
  {
    id: 'staff-task-1',
    title: 'Call patient with lab results',
    patient: 'Emily Davis',
    assignedBy: 'Dr. Evans',
    dueDate: '2026-03-30',
    priority: 'High' as const,
    status: 'To Do' as const,
    notes: 'Flag if LDL remains above 160 mg/dL.',
  },
  {
    id: 'staff-task-2',
    title: 'Review patient intake forms',
    patient: 'Jessica Brown',
    assignedBy: 'Dr. Evans',
    dueDate: '2026-03-30',
    priority: 'Medium' as const,
    status: 'In Progress' as const,
    notes: 'Verify allergy list before triage.',
  },
  {
    id: 'staff-task-3',
    title: 'Confirm tomorrow telehealth slot',
    patient: 'Marcus Lee',
    assignedBy: 'Dr. Evans',
    dueDate: '2026-03-31',
    priority: 'Low' as const,
    status: 'Completed' as const,
    notes: 'Patient requested SMS reminder and portal invite.',
  },
];

export const demoQueue: DemoQueueItem[] = [
  {
    id: 'queue-1',
    token: 'A-12',
    name: 'Aarav Mehta',
    type: 'Appointment',
    status: 'Waiting',
    eta: '6 min',
    checklist: {
      reportCollected: true,
      paymentCompleted: true,
      patientUpdated: false,
      investigationScheduled: false,
    },
  },
  {
    id: 'queue-2',
    token: 'W-03',
    name: 'Nisha Kapoor',
    type: 'Walk-In',
    status: 'In Consult',
    eta: 'Now',
    checklist: {
      reportCollected: true,
      paymentCompleted: false,
      patientUpdated: true,
      investigationScheduled: true,
    },
  },
  {
    id: 'queue-3',
    token: 'A-14',
    name: 'Rohan Sen',
    type: 'Appointment',
    status: 'Finished',
    eta: 'Done',
    checklist: {
      reportCollected: true,
      paymentCompleted: true,
      patientUpdated: true,
      investigationScheduled: false,
    },
  },
];

export const demoInviteCodes: DemoInvite[] = [
  {
    id: 'invite-1',
    code: 'DOC-84KQ2M',
    roleAllowed: 'doctor',
    usesCount: 1,
    maxUses: 3,
    expiresAt: new Date('2026-04-30T00:00:00.000Z').getTime(),
  },
  {
    id: 'invite-2',
    code: 'STAFF-7LPM9R',
    roleAllowed: 'staff',
    usesCount: 2,
    maxUses: 10,
    expiresAt: null,
  },
];

export const demoMembers = [
  { id: 'member-1', name: 'Dr. Evelyn Reed', role: 'doctor', status: 'Active' },
  { id: 'member-2', name: 'Dr. Marcus Chen', role: 'doctor', status: 'Active' },
  { id: 'member-3', name: 'Alice Johnson', role: 'staff', status: 'Active' },
  { id: 'member-4', name: 'Priya Singh', role: 'staff', status: 'Pending Invite' },
];

export const demoNoteDraft = {
  patient: 'Sarah Johnson',
  dob: '05/20/1988',
  subjective:
    'Patient reports improved daytime energy after switching to an earlier bedtime routine, but continues to experience intermittent tension headaches during long workdays. No chest pain, dyspnea, or recent illness.',
  objective:
    'BP 132/84, HR 76, Temp 98.4 F. Mild cervical paraspinal tenderness. No focal neurologic deficits. Mood calm, speech clear, hydration adequate.',
  assessment:
    '1. Tension-type headaches with work-related trigger pattern.\n2. Improving sleep hygiene.\n3. Mild dehydration risk on busy clinic days.',
  plan:
    '1. Continue sleep hygiene plan and add mid-day hydration reminder.\n2. Start magnesium glycinate 200 mg nightly.\n3. Stretching routine twice daily.\n4. Follow up in 4 weeks or sooner if headaches escalate.',
  suggestedAssessment:
    '- Episodic tension-type headache with musculoskeletal trigger pattern.\n- Sleep quality improving with behavioral intervention.\n- Low immediate red-flag concern based on current exam.',
  suggestedPlan:
    '- Add hydration target of 2.5L daily with app-based reminders.\n- Reinforce ergonomics and stretching between visits.\n- Offer PT referral if symptoms persist beyond 6 weeks.\n- Document symptom frequency at next follow-up.',
};

export const demoBillingResult = {
  suggestedCodes: [
    { code: 'I10', confidenceScore: 0.94 },
    { code: 'E11.65', confidenceScore: 0.91 },
    { code: '99214', confidenceScore: 0.88 },
  ],
  changeHistory:
    '- **Primary diagnosis mapped to I10** based on repeated elevated blood pressure readings.\n- **Diabetes updated to E11.65** because the note documents poor glycemic control and A1c above target.\n- **Visit level suggested as 99214** due to chronic condition management, medication adjustment, and moderate complexity follow-up.',
};

export const demoPracticeReport = `### Executive Summary

The clinic finished the week with strong follow-through on follow-up visits, a stable consultation mix, and better-than-target task completion across front-desk operations.

### Patient Trends

- **14 new patients** were onboarded this week, with the largest concentration in preventive cardiometabolic visits.
- **Emergency visits accounted for 28%** of consults, which is above the usual baseline and worth watching for staffing balance.
- **Follow-up adherence improved** after automated reminder outreach, especially for hypertension and diabetes patients.

### Revenue Signals

- **Average consultation value** remained healthy with emergency cases driving a higher blended rate.
- **Outstanding balances** are concentrated in a small set of repeat patients, suggesting a focused collections workflow would have outsized impact.
- **Telehealth utilization** increased and is now contributing consistent mid-day appointment capacity.

### Task & Team Performance

- Staff closed **83% of operational tasks within target windows**.
- Queue handoff times improved after front-desk checklist completion became more consistent.
- The main bottleneck remains post-consult document collection for imaging-heavy cases.

### Recommended Actions

1. Add one more same-day triage buffer during the late morning rush.
2. Prioritize balance follow-up for the top five outstanding accounts.
3. Extend automated reminders to imaging document requests to reduce manual follow-up work.`;

export const demoTelehealthChecklist = [
  { id: 'consent', label: 'Consent form signed', checked: true },
  { id: 'vitals', label: 'Vitals submitted by patient', checked: true },
  { id: 'id', label: 'ID verification pending', checked: false },
];

export const demoTelehealthDocuments = [
  { id: 'doc-1', name: 'Lab_Results_Q1_2026.pdf', type: 'Labs' },
  { id: 'doc-2', name: 'Medication_Reconciliation.docx', type: 'Medication' },
  { id: 'doc-3', name: 'Cardiology_Followup_Summary.pdf', type: 'Consult' },
];

export const demoAiNoteDraft = `### S (Subjective)
- Patient reports improved home glucose readings over the past two weeks with only mild late-evening fatigue.
- Denies chest pain, fever, or shortness of breath.

### O (Objective)
- Home BP trends remain mildly elevated in the evenings.
- Medication adherence appears consistent and no adverse effects were reported.

### A (Assessment)
- Type 2 diabetes with improving self-management.
- Hypertension requiring continued monitoring.

### P (Plan)
- Continue current medications and reinforce evening BP checks.
- Repeat A1c in 8 weeks.
- Schedule virtual follow-up after lab review.`;

export const demoPatientReportContent = `Comprehensive Metabolic Panel
Patient: Nisha Kapoor
Collected: 2026-03-24

HbA1c: 8.1% (High)
Fasting Glucose: 164 mg/dL (High)
LDL Cholesterol: 151 mg/dL (High)
Triglycerides: 232 mg/dL (High)
Creatinine: 0.9 mg/dL (Normal)
eGFR: >90 mL/min/1.73m2 (Normal)
CRP: 8.2 mg/L (Mildly Elevated)

Clinical note:
Patient reports increased fatigue over the past month with occasional blurred vision during late afternoons. Medication adherence inconsistent during travel weeks.`;

export const demoPatientDiagnosis = {
  summary:
    'The lab profile suggests **suboptimally controlled type 2 diabetes with concurrent dyslipidemia** and mild inflammatory stress. Kidney function is preserved, which supports intensifying outpatient management while focusing on adherence, lipid control, and short-interval reassessment.',
  keyAbnormalities: [
    {
      parameter: 'HbA1c',
      value: '8.1%',
      normalRange: '< 5.7%',
      interpretation:
        'This is consistent with chronic hyperglycemia and indicates diabetes management is not yet at goal.',
    },
    {
      parameter: 'LDL Cholesterol',
      value: '151 mg/dL',
      normalRange: '< 100 mg/dL',
      interpretation:
        'Elevated LDL increases long-term cardiovascular risk and should be addressed alongside glucose control.',
    },
    {
      parameter: 'Triglycerides',
      value: '232 mg/dL',
      normalRange: '< 150 mg/dL',
      interpretation:
        'Hypertriglyceridemia may reflect insulin resistance, dietary factors, or inconsistent medication adherence.',
    },
  ],
  potentialDiagnoses: [
    {
      diagnosis: 'Poorly controlled type 2 diabetes mellitus',
      confidenceScore: 0.93,
      reasoning:
        'Elevated HbA1c, high fasting glucose, and symptom history together strongly support active glycemic dysregulation.',
    },
    {
      diagnosis: 'Mixed dyslipidemia with cardiometabolic risk',
      confidenceScore: 0.87,
      reasoning:
        'Concurrent LDL and triglyceride elevation raises concern for ongoing cardiometabolic burden.',
    },
  ],
  recommendedFollowUps: [
    { recommendation: 'Repeat HbA1c and fasting lipid profile in 8 to 10 weeks.', priority: 'High' as const },
    { recommendation: 'Review medication adherence barriers and travel routine.', priority: 'High' as const },
    { recommendation: 'Consider nutrition counseling and statin optimization.', priority: 'Medium' as const },
    { recommendation: 'Add home BP and glucose log review at next visit.', priority: 'Medium' as const },
  ],
  differentialDiagnosis: [
    {
      diagnosis: 'Medication non-adherence as primary driver of lab drift',
      reasoning:
        'The pattern and travel history suggest inconsistent dosing may be amplifying otherwise manageable disease activity.',
    },
    {
      diagnosis: 'Diet-related metabolic exacerbation',
      reasoning:
        'Triglyceride elevation and fatigue could also reflect nutrition and routine changes rather than disease progression alone.',
    },
  ],
  pathophysiologyInsights:
    'Insulin resistance, episodic non-adherence, and elevated lipid burden are likely acting together to drive both glycemic and vascular risk. The preserved renal profile is reassuring and creates a strong window for outpatient optimization.',
};

export const demoPrescription = `### Draft Prescription

- **Metformin XR 1000 mg** orally twice daily with meals.
- **Rosuvastatin 10 mg** orally at bedtime.
- **Omega-3 supplement** once daily after dinner.

### Monitoring

- Check fasting blood glucose 4 times weekly.
- Maintain a symptom and meal log for 14 days.

### Follow-up

- Tele-follow-up in 2 weeks for adherence review.
- Repeat labs in 8 weeks.`;

export function getSeedMedications(userId: string): Medication[] {
  return [
    {
      id: 'demo-med-1',
      patientId: userId,
      name: 'Metformin XR',
      dose: '1000 mg',
      times: [
        { id: 'demo-time-1', time: '08:00' },
        { id: 'demo-time-2', time: '20:00' },
      ],
      startDate: '2026-03-01',
      endDate: '',
      notes: 'Take after meals and log fasting glucose.',
    },
    {
      id: 'demo-med-2',
      patientId: userId,
      name: 'Rosuvastatin',
      dose: '10 mg',
      times: [{ id: 'demo-time-3', time: '21:00' }],
      startDate: '2026-03-12',
      endDate: '',
      notes: 'Bedtime dose. Monitor for muscle aches.',
    },
    {
      id: 'demo-med-3',
      patientId: userId,
      name: 'Vitamin D3',
      dose: '2000 IU',
      times: [{ id: 'demo-time-4', time: '09:30' }],
      startDate: '2026-02-20',
      endDate: '2026-05-20',
      notes: 'Take with breakfast.',
    },
  ];
}

export function getFallbackPatient(patientId: string) {
  return demoPatients.find((patient) => patient.id === patientId) ?? demoPatients[1];
}
