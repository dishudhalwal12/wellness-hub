'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { CheckCircle2, CircleDashed, TimerReset } from 'lucide-react';

import { MetricCard, PageHeader } from '@/components/app/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { demoStaffTasks } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

type TaskPriority = 'High' | 'Medium' | 'Low';
type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

type Task = {
  id: string;
  title: string;
  patient: string;
  assignedBy: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  notes?: string;
};

function TaskCard({ task, onEdit }: { task: Task; onEdit: () => void }) {
  return (
    <Card
      className="hover-lift cursor-pointer border-white/80 bg-white/85"
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData('taskId', task.id);
        event.currentTarget.style.opacity = '0.6';
      }}
      onDragEnd={(event) => {
        event.currentTarget.style.opacity = '1';
      }}
      onClick={onEdit}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-semibold text-foreground">{task.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{task.patient}</p>
          </div>
          <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}>
            {task.priority}
          </Badge>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>Assigned by: {task.assignedBy}</p>
          <p>Due: {task.dueDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function TaskColumn({
  title,
  tasks,
  columnKey,
  onDrop,
  onDragOver,
  onDragLeave,
  isDraggingOver,
  onEditTask,
}: {
  title: string;
  tasks: Task[];
  columnKey: TaskStatus;
  onDrop: (event: React.DragEvent<HTMLDivElement>, column: TaskStatus) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  isDraggingOver: boolean;
  onEditTask: (task: Task) => void;
}) {
  return (
    <div
      className={cn(
        'rounded-[28px] border border-white/70 bg-white/75 p-4 shadow-sm shadow-slate-900/5 transition-all duration-300',
        isDraggingOver && 'border-primary/40 bg-primary/5 shadow-lg shadow-primary/10'
      )}
      onDrop={(event) => onDrop(event, columnKey)}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Badge variant="outline">{tasks.length} items</Badge>
        </div>
      </div>
      <div className="flex min-h-[260px] flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[22px] border border-dashed border-border bg-muted/35 px-4 py-8 text-center text-sm leading-6 text-muted-foreground">
            Drag a task here to update your progress and keep the board current.
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />)
        )}
      </div>
    </div>
  );
}

function ViewTaskDialog({
  task,
  open,
  onOpenChange,
  onStatusChange,
}: {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}) {
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    setNotes(task?.notes || '');
  }, [task]);

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <CardDescription>Patient: {task.patient}</CardDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-sm">
          <div className="grid gap-3 rounded-[22px] border border-border/70 bg-white/70 p-4">
            <p><span className="font-semibold text-foreground">Assigned By:</span> {task.assignedBy}</p>
            <p><span className="font-semibold text-foreground">Due Date:</span> {task.dueDate}</p>
            <p>
              <span className="font-semibold text-foreground">Priority:</span>{' '}
              <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}>
                {task.priority}
              </Badge>
            </p>
            <p>
              <span className="font-semibold text-foreground">Status:</span> <Badge variant="outline">{task.status}</Badge>
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Add task-specific notes, patient callback details, or handoff context."
            />
          </div>
        </div>
        <DialogFooter className="justify-between sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <div className="flex gap-2">
            {task.status !== 'In Progress' ? (
              <Button variant="secondary" onClick={() => onStatusChange(task.id, 'In Progress')}>
                Start Task
              </Button>
            ) : null}
            {task.status !== 'Completed' ? (
              <Button onClick={() => onStatusChange(task.id, 'Completed')}>Mark Completed</Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function StaffTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(demoStaffTasks as Task[]);
  const [draggingOver, setDraggingOver] = useState<TaskStatus | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const taskStats = useMemo(() => {
    const todo = tasks.filter((task) => task.status === 'To Do').length;
    const inProgress = tasks.filter((task) => task.status === 'In Progress').length;
    const completed = tasks.filter((task) => task.status === 'Completed').length;

    return { todo, inProgress, completed };
  }, [tasks]);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, toColumn: TaskStatus) => {
    event.preventDefault();
    setDraggingOver(null);
    const taskId = event.dataTransfer.getData('taskId');
    if (!taskId) return;
    handleStatusChange(taskId, toColumn);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsViewDialogOpen(true);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)));
    if (viewingTask?.id === taskId) {
      setViewingTask((current) => (current ? { ...current, status: newStatus } : null));
    }
  };

  const columns: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Personal Workflow"
        title="My assigned tasks"
        description="A polished personal task board for staff members with drag-and-drop flow, visible priority, and a complete working view from the first load."
      >
        <span className="glass-chip">{tasks.length} tasks in rotation</span>
        <Badge variant="outline">Interactive board</Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="To Do"
          value={taskStats.todo.toString()}
          description="Outstanding work that still needs an owner touchpoint."
          icon={CircleDashed}
          trend="Action queue"
        />
        <MetricCard
          title="In Progress"
          value={taskStats.inProgress.toString()}
          description="Tasks you are actively moving through triage or follow-up."
          icon={TimerReset}
          trend="Live workstream"
        />
        <MetricCard
          title="Completed"
          value={taskStats.completed.toString()}
          description="Closed tasks ready for review or archive."
          icon={CheckCircle2}
          trend="Strong closure"
        />
        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
          <CardHeader>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Shift Readiness</CardDescription>
            <CardTitle className="text-3xl">{Math.max(80, 100 - taskStats.todo * 5)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              A quick pulse on whether today&apos;s workload looks contained and manageable.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {columns.map((columnKey) => (
          <TaskColumn
            key={columnKey}
            title={columnKey}
            tasks={tasks.filter((task) => task.status === columnKey)}
            columnKey={columnKey}
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault();
              setDraggingOver(columnKey);
            }}
            onDragLeave={() => setDraggingOver(null)}
            isDraggingOver={draggingOver === columnKey}
            onEditTask={handleViewTask}
          />
        ))}
      </div>

      <ViewTaskDialog
        task={viewingTask}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
