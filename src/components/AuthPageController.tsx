'use client';

import { useUser } from '@/firebase-config';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

function getDefaultPath(role?: 'doctor' | 'admin' | 'staff') {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'staff':
      return '/staff-tasks';
    case 'doctor':
    default:
      return '/';
  }
}

export default function AuthPageController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user && profile) {
      router.replace(getDefaultPath(profile.role));
    }
  }, [isUserLoading, profile, router, user]);

  if (user && isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2 text-muted-foreground">Loading Wellness Hub...</p>
      </div>
    );
  }

  return <>{children}</>;
}
