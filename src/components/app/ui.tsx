'use client';

import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight } from 'lucide-react';
import * as React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow = 'Wellness Hub',
  title,
  description,
  actions,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('rounded-lg border bg-card p-6', className)}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{eyebrow}</span>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
          </div>
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
      {children ? <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div> : null}
    </section>
  );
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="relative">
        <div className="absolute right-6 top-6 rounded-md bg-muted p-2 text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="pr-16 text-3xl font-semibold">{value}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        {trend ? (
          <div className="whitespace-nowrap rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {trend}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  className,
  action,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card px-6 py-10 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-lg bg-secondary p-4 text-secondary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function TableSkeleton({ columns = 4, rows = 4 }: { columns?: number; rows?: number }) {
  return (
    <div className="space-y-3 rounded-lg border bg-card p-4">
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`head-${index}`} className="h-4 w-2/3" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={`row-${rowIndex}`}
          className="grid gap-3 rounded-md border bg-muted/20 p-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, columnIndex) => (
            <Skeleton key={`cell-${rowIndex}-${columnIndex}`} className="h-5 w-full" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function MetricGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-36" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
