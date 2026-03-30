import { FirebaseClientProvider } from '@/firebase';
import AuthPageController from '@/components/AuthPageController';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FirebaseClientProvider>
      <AuthPageController>{children}</AuthPageController>
    </FirebaseClientProvider>
  );
}
