'use client';

import React, { DependencyList, createContext, useContext, ReactNode, useMemo, useState, useEffect } from 'react';
import { FirebaseApp } from 'firebase/app';
import { Firestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { Auth, User, onAuthStateChanged } from 'firebase/auth';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface UserProfile {
    role?: 'doctor' | 'admin' | 'staff';
    orgId?: string;
    orgName?: string;
    [key: string]: any; // Allow other properties
}

interface UserAuthState {
  user: User | null;
  isUserLoading: boolean;
  userError: Error | null;
  profile: UserProfile | null;
}

// Combined state for the Firebase context
export interface FirebaseContextState {
  areServicesAvailable: boolean; // True if core services (app, firestore, auth instance) are provided
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null; // The Auth service instance
  // User authentication state
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean; // True during initial auth check
  userError: Error | null; // Error from auth listener
}

// Return type for useFirebase()
export interface FirebaseServicesAndUser {
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// Return type for useUser() - specific to user auth state
export interface UserHookResult {
  user: User | null;
  profile: UserProfile | null;
  isUserLoading: boolean;
  userError: Error | null;
}

// React Context
export const FirebaseContext = createContext<FirebaseContextState | undefined>(undefined);

interface FirebaseProviderProps {
  children: ReactNode;
  firebaseApp: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
}

const PROFILE_CACHE_PREFIX = 'wellness-hub-profile:';

function omitUndefinedFields<T extends Record<string, any>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined)
  ) as Partial<T>;
}

function getCachedProfile(uid: string): UserProfile | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const cached = window.sessionStorage.getItem(`${PROFILE_CACHE_PREFIX}${uid}`);
    return cached ? JSON.parse(cached) as UserProfile : null;
  } catch {
    return null;
  }
}

function cacheProfile(uid: string, profile: UserProfile | null) {
  if (typeof window === 'undefined') {
    return;
  }

  const key = `${PROFILE_CACHE_PREFIX}${uid}`;

  if (!profile) {
    window.sessionStorage.removeItem(key);
    return;
  }

  window.sessionStorage.setItem(key, JSON.stringify(profile));
}


/**
 * FirebaseProvider manages and provides Firebase services and user authentication state.
 */
export const FirebaseProvider: React.FC<FirebaseProviderProps> = ({
  children,
  firebaseApp,
  firestore,
  auth,
}) => {
  const initialUser = auth?.currentUser || null;
  const initialProfile = initialUser ? getCachedProfile(initialUser.uid) : null;
  const [userAuthState, setUserAuthState] = useState<UserAuthState>({
    user: initialUser,
    isUserLoading: !initialProfile, // Skip the initial spinner when we have cached profile data
    userError: null,
    profile: initialProfile,
  });

  // Effect to subscribe to Firebase auth state changes and fetch profile
  useEffect(() => {
    if (!auth) { 
      setUserAuthState({ user: null, isUserLoading: false, userError: new Error("Auth service not provided."), profile: null });
      return;
    }

    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => { 
        if (firebaseUser) {
           setUserAuthState({
             user: firebaseUser,
             isUserLoading: true,
             userError: null,
             profile: null,
           });

           try {
                const cachedProfile = getCachedProfile(firebaseUser.uid);
                const userDocRef = doc(firestore, 'users', firebaseUser.uid);
                const userDoc = await getDoc(userDocRef);
                let profileData = userDoc.exists() ? userDoc.data() as UserProfile : null;

                if (!profileData) {
                const fallbackProfile: UserProfile = cachedProfile ?? {};
                const profilePayload = omitUndefinedFields({
                        ...fallbackProfile,
                        name: fallbackProfile.name || firebaseUser.displayName || firebaseUser.email || 'User',
                        email: fallbackProfile.email || firebaseUser.email || '',
                        role: fallbackProfile.role || 'doctor',
                        orgId: fallbackProfile.orgId,
                        orgName: fallbackProfile.orgName,
                });

                profileData = profilePayload as UserProfile;

                await setDoc(userDocRef, profilePayload, { merge: true });
                }
                
        // Also fetch org name if orgId exists. This lookup is best-effort:
        // if Firestore rules deny it, keep the user signed in with the
        // base profile instead of blanking the session.
                if (profileData?.orgId) {
          try {
            const orgDocRef = doc(firestore, 'orgs', profileData.orgId);
            const orgDoc = await getDoc(orgDocRef);
            if (orgDoc.exists()) {
              profileData.orgName = orgDoc.data().name;
            }
          } catch (orgError) {
            console.warn('FirebaseProvider: Unable to load org details:', orgError);
                    }
                }

                cacheProfile(firebaseUser.uid, profileData);
                
                setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: null, profile: profileData });
           } catch (error) {
                console.error("FirebaseProvider: Error fetching user profile:", error);
                setUserAuthState({ user: firebaseUser, isUserLoading: false, userError: error instanceof Error ? error : new Error("Failed to fetch profile"), profile: null });
           }
        } else {
             if (typeof window !== 'undefined') {
               Object.keys(window.sessionStorage)
                 .filter((key) => key.startsWith(PROFILE_CACHE_PREFIX))
                 .forEach((key) => window.sessionStorage.removeItem(key));
             }
             setUserAuthState({ user: null, isUserLoading: false, userError: null, profile: null });
        }
      },
      (error) => { // Auth listener error
        console.error("FirebaseProvider: onAuthStateChanged error:", error);
        setUserAuthState({ user: null, isUserLoading: false, userError: error, profile: null });
      }
    );
    return () => unsubscribe(); // Cleanup
  }, [auth, firestore]);

  // Memoize the context value
  const contextValue = useMemo((): FirebaseContextState => {
    const servicesAvailable = !!(firebaseApp && firestore && auth);
    return {
      areServicesAvailable: servicesAvailable,
      firebaseApp: servicesAvailable ? firebaseApp : null,
      firestore: servicesAvailable ? firestore : null,
      auth: servicesAvailable ? auth : null,
      ...userAuthState
    };
  }, [firebaseApp, firestore, auth, userAuthState]);

  return (
    <FirebaseContext.Provider value={contextValue}>
      <FirebaseErrorListener />
      {children}
    </FirebaseContext.Provider>
  );
};

/**
 * Hook to access core Firebase services and user authentication state.
 * Throws error if core services are not available or used outside provider.
 */
export const useFirebase = (): FirebaseServicesAndUser => {
  const context = useContext(FirebaseContext);

  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider.');
  }

  if (!context.areServicesAvailable || !context.firebaseApp || !context.firestore || !context.auth) {
    throw new Error('Firebase core services not available. Check FirebaseProvider props.');
  }

  return {
    firebaseApp: context.firebaseApp,
    firestore: context.firestore,
    auth: context.auth,
    user: context.user,
    profile: context.profile,
    isUserLoading: context.isUserLoading,
    userError: context.userError,
  };
};

/** Hook to access Firebase Auth instance. */
export const useAuth = (): Auth => {
  const { auth } = useFirebase();
  return auth;
};

/** Hook to access Firestore instance. */
export const useFirestore = (): Firestore => {
  const { firestore } = useFirebase();
  return firestore;
};

/** Hook to access Firebase App instance. */
export const useFirebaseApp = (): FirebaseApp => {
  const { firebaseApp } = useFirebase();
  return firebaseApp;
};

type MemoFirebase <T> = T & {__memo?: boolean};

export function useMemoFirebase<T>(factory: () => T, deps: DependencyList): T | (MemoFirebase<T>) {
  const memoized = useMemo(factory, deps);
  
  if(typeof memoized !== 'object' || memoized === null) return memoized;
  (memoized as MemoFirebase<T>).__memo = true;
  
  return memoized;
}

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, profile, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const { user, profile, isUserLoading, userError } = useFirebase(); // Leverages the main hook
  return { user, profile, isUserLoading, userError };
};
