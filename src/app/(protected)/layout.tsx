import { FirebaseClientProvider } from '@/firebase';
import AppShellController from '@/components/AppShellController';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      <AppShellController>{children}</AppShellController>
    </FirebaseClientProvider>
  );
}
