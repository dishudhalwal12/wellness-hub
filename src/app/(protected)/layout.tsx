import AppShellController from '@/components/AppShellController';

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppShellController>{children}</AppShellController>
  );
}
