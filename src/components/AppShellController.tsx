
'use client';

import { useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AppShell from './AppShell';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define route accessibility for each role
const DOCTOR_ROUTES = ['/', '/medications', '/notes', '/tasks', '/patients', '/billing', '/telehealth', '/reception', '/reports', '/settings'];
const ADMIN_ROUTES = ['/admin', '/reports', '/tasks', '/patients', '/settings'];
const STAFF_ROUTES = ['/staff-tasks', '/settings'];

function isRouteAuthorized(pathname: string, route: string) {
  if (route === '/') {
    return pathname === '/';
  }

  return pathname.startsWith(route);
}

export default function AppShellController({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  
  useEffect(() => {
    if (isUserLoading) {
      return;
    }

    if (user && profile) {
      let authorizedRoute = false;
      let defaultPath = '/';

      switch (profile.role) {
        case 'doctor':
          authorizedRoute = DOCTOR_ROUTES.some((route) => isRouteAuthorized(pathname, route));
          defaultPath = '/';
          break;
        case 'admin':
          authorizedRoute = ADMIN_ROUTES.some((route) => isRouteAuthorized(pathname, route));
          defaultPath = '/admin';
          break;
        case 'staff':
          authorizedRoute = STAFF_ROUTES.some((route) => isRouteAuthorized(pathname, route));
          defaultPath = '/staff-tasks';
          break;
      }

      if (!authorizedRoute) {
         toast({
            variant: "destructive",
            title: "Access Denied",
            description: "You don’t have permission for this page. Redirecting you.",
        });
        router.replace(defaultPath);
        return;
      }
    } else if (!user) {
      router.replace('/login');
      return;
    }
  }, [user, profile, isUserLoading, pathname, router, toast]);


  if (isUserLoading || (user && !profile)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2 text-muted-foreground">Loading Wellness Hub...</p>
      </div>
    );
  }

  if (user && profile) {
    return <AppShell>{children}</AppShell>;
  }

  return <>{children}</>;
}
