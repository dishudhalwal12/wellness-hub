import AuthPageController from '@/components/AuthPageController';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthPageController>{children}</AuthPageController>
  );
}
