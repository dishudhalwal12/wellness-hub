'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { addDoc, collection, doc, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { CheckCircle2, CircleDashed, Loader2, PlusCircle, TimerReset } from 'lucide-react';

import { MetricCard, PageHeader } from '@/components/app/ui';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase-config';
import { demoTasks } from '@/lib/demo-data';
import { cn } from '@/lib/utils';

export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';

export type Task = {
  id: string;
  title: string;
  patientName: string;
  assignee: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  orgId: string;
  assignedBy: string;
  createdAt: any;
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
            <p className="mt-1 text-sm text-muted-foreground">{task.patientName}</p>
          </div>
          <Badge variant={task.priority === 'High' ? 'destructive' : task.priority === 'Medium' ? 'secondary' : 'outline'}>
            {task.priority}
          </Badge>
        </div>
        <div className="grid gap-2 text-sm text-muted-foreground">
          <p>Assignee: {task.assignee}</p>
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
  onAddTask,
}: {
  title: string;
  tasks: Task[];
  columnKey: TaskStatus;
  onDrop: (event: React.DragEvent<HTMLDivElement>, column: TaskStatus) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  isDraggingOver: boolean;
  onEditTask: (task: Task) => void;
  onAddTask: (status: TaskStatus) => void;
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
        <Button variant="outline" size="icon" onClick={() => onAddTask(columnKey)}>
          <PlusCircle className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex min-h-[260px] flex-col gap-4">
        {tasks.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-[22px] border border-dashed border-border bg-muted/35 px-4 py-8 text-center text-sm leading-6 text-muted-foreground">
            Drop a task here or create a new one to keep this workflow lane moving.
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />)
        )}
      </div>
    </div>
  );
}

function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onSave,
  user,
  profile,
}: {
  task: Partial<Task> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedTask: Partial<Task>) => void;
  user: any;
  profile: any;
}) {
  const [editedTask, setEditedTask] = useState<Partial<Task> | null>(task);

  React.useEffect(() => {
    setEditedTask(task);
  }, [task]);

  if (!editedTask) return null;

  const handleChange = (field: keyof Task, value: string) => {
    setEditedTask((current) => (current ? { ...current, [field]: value } : current));
  };

  const handleSaveChanges = () => {
    if (!editedTask || !user || !profile) return;
    onSave({
      ...editedTask,
      orgId: profile.orgId || 'demo-org',
      assignedBy: user.uid || 'demo-user',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>{editedTask.id ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Task Title</Label>
            <Input id="title" value={editedTask.title || ''} onChange={(event) => handleChange('title', event.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="patient">Patient</Label>
            <Input id="patient" value={editedTask.patientName || ''} onChange={(event) => handleChange('patientName', event.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Input
                id="assignee"
                value={editedTask.assignee || ''}
                onChange={(event) => handleChange('assignee', event.target.value)}
                placeholder="Staff member name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={editedTask.dueDate || ''}
                onChange={(event) => handleChange('dueDate', event.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Priority</Label>
              <Select
                onValueChange={(value: TaskPriority) => handleChange('priority', value)}
                defaultValue={editedTask.priority}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value: TaskStatus) => handleChange('status', value)}
                defaultValue={editedTask.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSaveChanges}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TasksPage() {
  const { user, profile } = useUser();
  const firestore = useFirestore();
  const [demoBoardTasks, setDemoBoardTasks] = useState<Task[]>(demoTasks as Task[]);
  const [draggingOver, setDraggingOver] = useState<TaskStatus | null>(null);
  const [editingTask, setEditingTask] = useState<Partial<Task> | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const tasksQuery = useMemoFirebase(() => {
    if (!firestore || !profile?.orgId) return null;
    return query(collection(firestore, 'tasks'), where('orgId', '==', profile.orgId));
  }, [firestore, profile?.orgId]);

  const { data: tasks, isLoading: tasksLoading } = useCollection<Task>(tasksQuery);
  const hasLiveTasks = (tasks?.length ?? 0) > 0;
  const boardTasks = hasLiveTasks ? tasks || [] : demoBoardTasks;

  const taskStats = useMemo(() => {
    const todo = boardTasks.filter((task) => task.status === 'To Do').length;
    const inProgress = boardTasks.filter((task) => task.status === 'In Progress').length;
    const completed = boardTasks.filter((task) => task.status === 'Completed').length;

    return { todo, inProgress, completed, total: boardTasks.length };
  }, [boardTasks]);

  const persistTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!hasLiveTasks) {
      setDemoBoardTasks((current) => current.map((task) => (task.id === taskId ? { ...task, status } : task)));
      return;
    }

    if (!firestore) return;
    const taskRef = doc(firestore, 'tasks', taskId);
    await updateDoc(taskRef, { status });
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>, toColumn: TaskStatus) => {
    event.preventDefault();
    setDraggingOver(null);
    const taskId = event.dataTransfer.getData('taskId');
    if (!taskId) return;

    const task = boardTasks.find((item) => item.id === taskId);
    if (!task || task.status === toColumn) return;

    await persistTaskStatus(taskId, toColumn);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditDialogOpen(true);
  };

  const handleAddTask = (status: TaskStatus) => {
    setEditingTask({
      status,
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      patientName: '',
      assignee: '',
      title: '',
    });
    setIsEditDialogOpen(true);
  };

  const handleSaveTask = async (updatedTask: Partial<Task>) => {
    if (!updatedTask.title || !updatedTask.patientName || !updatedTask.assignee || !updatedTask.status || !updatedTask.priority) {
      return;
    }

    if (!hasLiveTasks) {
      if (updatedTask.id) {
        setDemoBoardTasks((current) =>
          current.map((task) => (task.id === updatedTask.id ? { ...task, ...(updatedTask as Task) } : task))
        );
      } else {
        setDemoBoardTasks((current) => [
          ...current,
          {
            ...(updatedTask as Task),
            id: crypto.randomUUID(),
            orgId: 'demo-org',
            assignedBy: user?.uid || 'demo-user',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return;
    }

    if (!firestore) return;

    if (updatedTask.id) {
      const taskRef = doc(firestore, 'tasks', updatedTask.id);
      await updateDoc(taskRef, updatedTask);
      return;
    }

    const tasksCol = collection(firestore, 'tasks');
    await addDoc(tasksCol, {
      ...updatedTask,
      createdAt: serverTimestamp(),
    });
  };

  const columns: TaskStatus[] = ['To Do', 'In Progress', 'Completed'];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workflow Board"
        title="Task assignment for care coordination"
        description="Drag tasks across the care workflow, keep work clearly organized, and preserve your live Firestore updates the moment real tasks exist."
        actions={
          <Button onClick={() => handleAddTask('To Do')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Task
          </Button>
        }
      >
        <span className="glass-chip">{taskStats.total} active tasks</span>
        <Badge variant={hasLiveTasks ? 'secondary' : 'outline'}>
          {tasksLoading && !hasLiveTasks ? 'Syncing live tasks' : hasLiveTasks ? 'Live board connected' : 'Board loaded'}
        </Badge>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="To Do"
          value={taskStats.todo.toString()}
          description="Tasks waiting for staff action or outbound follow-up."
          icon={CircleDashed}
          trend="Front-desk ready"
        />
        <MetricCard
          title="In Progress"
          value={taskStats.inProgress.toString()}
          description="Work currently moving through the queue with active ownership."
          icon={TimerReset}
          trend="Live handoffs"
        />
        <MetricCard
          title="Completed"
          value={taskStats.completed.toString()}
          description="Closed-loop work that no longer needs operational attention."
          icon={CheckCircle2}
          trend="Closure improving"
        />
        <Card className="overflow-hidden bg-[linear-gradient(135deg,rgba(17,138,178,0.08),rgba(255,255,255,0.92))]">
          <CardHeader>
            <CardDescription className="text-xs font-semibold uppercase tracking-[0.18em]">Board Health</CardDescription>
            <CardTitle className="text-3xl">{Math.max(76, 100 - taskStats.todo * 4)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">
              Balanced lane counts and visible ownership make this board easy to scan during daily operations.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {columns.map((columnKey) => (
          <TaskColumn
            key={columnKey}
            title={columnKey}
            tasks={boardTasks.filter((task) => task.status === columnKey)}
            columnKey={columnKey}
            onDrop={handleDrop}
            onDragOver={(event) => {
              event.preventDefault();
              setDraggingOver(columnKey);
            }}
            onDragLeave={() => setDraggingOver(null)}
            isDraggingOver={draggingOver === columnKey}
            onEditTask={handleEditTask}
            onAddTask={handleAddTask}
          />
        ))}
      </div>

      <EditTaskDialog
        task={editingTask}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTask}
        user={user}
        profile={profile}
      />
    </div>
  );
}
