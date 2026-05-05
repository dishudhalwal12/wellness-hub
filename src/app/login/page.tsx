
'use client';

import * as React from 'react';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Loader2, Eye, EyeOff, Building, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser, type User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { processNewUser, type SignupFormData } from '@/firebase/user-actions';




const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const baseSignupSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  phoneNumber: z.string().min(10, 'Invalid phone number'),
});

const privateClinicSchema = baseSignupSchema.extend({
  onboardingType: z.literal('private'),
  orgName: z.string().min(1, 'Clinic name is required'),
  orgAddress: z.string().min(1, 'Address is required'),
});

const hospitalSchema = baseSignupSchema.extend({
    onboardingType: z.literal('hospital'),
    orgName: z.string().min(1, 'Hospital name is required'),
    orgAddress: z.string().min(1, 'Address is required'),
});

const inviteSchema = baseSignupSchema.extend({
  onboardingType: z.literal('invite'),
  inviteCode: z.string().min(6, 'Invite code is required'),
});

const signupSchema = z.discriminatedUnion("onboardingType", [privateClinicSchema, hospitalSchema, inviteSchema]);

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;


export default function LoginPage() {
  const [formType, setFormType] = useState<'login' | 'signup'>('login');
  const [onboardingType, setOnboardingType] = useState<'private' | 'hospital' | 'invite'>('private');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { user: authUser, profile: userProfile, isUserLoading } = useUser();
  
  const currentFormSchema = formType === 'login' ? loginSchema : signupSchema;

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<any>({
    resolver: zodResolver(currentFormSchema as z.ZodTypeAny),
    defaultValues: {
      onboardingType: 'private',
    }
  });

  const watchedOnboardingType = watch('onboardingType');

  // Handle existing auth state on mount/change
  React.useEffect(() => {
    if (isUserLoading) return;

    if (authUser && userProfile) {
      // User is already logged in and has a profile, go to dashboard
      const dashboardPath = userProfile.role === 'admin' ? '/admin' : userProfile.role === 'staff' ? '/staff-tasks' : '/';
      router.replace(dashboardPath);
    } else if (authUser && !userProfile) {
      // User is logged in but has no profile (e.g. refreshed during onboarding)
      // Set to signup mode to allow completing registration
      setFormType('signup');
      reset({
        fullName: authUser.displayName || '',
        email: authUser.email || '',
        phoneNumber: authUser.phoneNumber || '',
        onboardingType: 'private'
      });
      toast({
        title: "Complete Registration",
        description: "Please finish setting up your account to continue.",
      });
    }
  }, [authUser, userProfile, isUserLoading, router, reset, toast]);

  React.useEffect(() => {
    setOnboardingType(watchedOnboardingType);
    setValue('onboardingType', watchedOnboardingType);
  }, [watchedOnboardingType, setValue]);

  const handleAuthError = (error: any) => {
    let title = 'An Error Occurred';
    let description = 'Please check your credentials and try again.';

    switch (error.code) {
        case 'auth/popup-closed-by-user':
            // Don't show a toast for this, as it's user-initiated.
            return;
        case 'auth/operation-not-allowed':
            title = 'Sign-in Method Disabled';
            description = "This sign-in method is not enabled. Please enable it in your Firebase project's Authentication settings.";
            break;
        case 'auth/invalid-credential':
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            title = 'Invalid Credentials';
            description = 'Please check your email and password and try again.';
            break;
        case 'auth/email-already-in-use':
            title = 'Email Already in Use';
            description = 'This email is already registered. Please log in or use a different email.';
            break;
        default:
            if (error.message) {
                title = 'Registration Failed';
                description = error.message;
            }
            break;
    }
    
    toast({
        variant: 'destructive',
        title,
        description,
    });
  };

  const onSubmit: SubmitHandler<LoginFormData | SignupFormValues> = async (data) => {
    setIsLoading(true);
    toast({
        title: formType === 'login' ? "Signing In..." : "Creating Account...",
        description: "Please wait while we get things ready for you.",
    });
    try {
      if (formType === 'login') {
        const { email, password } = data as LoginFormData;
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const signupData = data as SignupFormValues;
        
        let user: User;

        if (!signupData.password) {
          throw new Error('Password is required to create an account.');
        }
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
          user = userCredential.user;
        } catch (signupError: any) {
          if (signupError?.code === 'auth/email-already-in-use') {
            const existingCredential = await signInWithEmailAndPassword(auth, signupData.email, signupData.password);
            user = existingCredential.user;
          } else {
            throw signupError;
          }
        }
        
        const { password: _password, ...signupPayload } = signupData;
        await processNewUser(firestore, auth, { ...signupPayload, userId: user.uid, email: user.email! });
      }
    } catch (error) {
      console.error("Authentication/Signup Error:", error);
      if (formType === 'signup' && auth.currentUser) {
        try {
          await deleteUser(auth.currentUser);
        } catch (cleanupError) {
          console.error("Signup cleanup error:", cleanupError);
          await signOut(auth);
        }
      }
      handleAuthError(error);
      setIsLoading(false); // Only reset loading on error
    } 
    // On success, the loading state persists and the AppShellController handles the redirect.
  };
  


  const currentTitle = formType === 'login' ? 'Sign in to PulseNet' : 'Create your PulseNet account';

  if (isUserLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2 text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-3">
      <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="flex justify-center text-primary">
              <Stethoscope className="h-10 w-10" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
              {currentTitle}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                  Or{' '}
                  <button
                    onClick={() => setFormType(formType === 'login' ? 'signup' : 'login')}
                    className="font-medium text-red-600 hover:text-red-700"
                    disabled={isLoading}
                  >
                    {formType === 'login' ? 'create an account' : 'sign in to your account'}
                  </button>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 rounded-md">
              {formType === 'signup' && (
                <>
                  <RadioGroup 
                    defaultValue="private" 
                    className="grid grid-cols-3 gap-4" 
                    onValueChange={(value: 'private' | 'hospital' | 'invite') => setValue('onboardingType', value)}
                  >
                    <Label className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", onboardingType === 'private' && "border-primary")}>
                      <RadioGroupItem value="private" className="sr-only" />
                      <Building className="mb-3 h-6 w-6" />
                      Private Clinic
                    </Label>
                    <Label className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", onboardingType === 'hospital' && "border-primary")}>
                      <RadioGroupItem value="hospital" className="sr-only" />
                      <Building className="mb-3 h-6 w-6" />
                      Hospital
                    </Label>
                    <Label className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", onboardingType === 'invite' && "border-primary")}>
                      <RadioGroupItem value="invite" className="sr-only" />
                      <UserPlus className="mb-3 h-6 w-6" />
                      Join by Invite
                    </Label>
                  </RadioGroup>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" {...register("fullName")} placeholder="Dr. John Doe" />
                        {errors.fullName && <p className="text-destructive text-xs">{`${errors.fullName.message}`}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <Input id="phoneNumber" {...register("phoneNumber")} type="tel" placeholder="9876543210" />
                         {errors.phoneNumber && <p className="text-destructive text-xs">{`${errors.phoneNumber.message}`}</p>}
                    </div>
                  </div>
                  {onboardingType === 'invite' ? (
                     <div className="space-y-2 !mt-4">
                        <Label htmlFor="inviteCode">Invite Code</Label>
                        <Input id="inviteCode" {...register("inviteCode")} placeholder="Enter code to join an organization" />
                        {errors.inviteCode && <p className="text-destructive text-xs">{`${errors.inviteCode.message}`}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="orgName">Clinic/Hospital Name</Label>
                        <Input id="orgName" {...register("orgName")} placeholder="Sunrise PulseNet Clinic" />
                        {errors.orgName && <p className="text-destructive text-xs">{`${errors.orgName.message}`}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="orgAddress">Clinic/Hospital Address</Label>
                        <Input id="orgAddress" {...register("orgAddress")} placeholder="123 Health St, Pulse City" />
                         {errors.orgAddress && <p className="text-destructive text-xs">{`${errors.orgAddress.message}`}</p>}
                      </div>
                       <div className="space-y-2">
                            <Label>Your Role</Label>
                            <p className="text-sm text-muted-foreground">
                                {onboardingType === 'hospital' 
                                    ? "As the creator of a hospital, you will be an Admin."
                                    : "As the creator of a private clinic, you will be a Doctor."
                                }
                            </p>
                        </div>
                    </>
                  )}
                </>
              )}
              {(formType === 'login' || formType === 'signup') && (
                <>
                <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" autoComplete="email" {...register("email")} placeholder="john.doe@example.com" />
                    {errors.email && <p className="text-destructive text-xs">{`${errors.email.message}`}</p>}
                </div>
                <div className="relative space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={formType === 'login' ? 'current-password' : 'new-password'}
                    {...register("password")}
                    placeholder="••••••••"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-muted-foreground"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    {errors.password && <p className="text-destructive text-xs">{`${errors.password.message}`}</p>}
                </div>
                </>
              )}
            </div>

            {formType === 'login' && (
                <div className="flex items-center justify-between">
                <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:text-primary/90">
                    Forgot your password?
                    </a>
                </div>
                </div>
            )}

            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {formType === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </div>

          </form>
        </div>
      </div>
      <div className="hidden bg-muted lg:col-span-2 lg:block">
        <video
          className="h-full w-full object-cover"
          src="/onboarding_video.mp4"
          autoPlay
          loop
          muted
          playsInline
          poster="/onboarding_poster.jpg"
        />
      </div>
    </div>
  );
}
