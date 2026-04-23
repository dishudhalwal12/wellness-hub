'use client';

import { firebaseConfig, hasFirebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

function initializeWithLocalConfig() {
  if (!hasFirebaseConfig) {
    throw new Error(
      'Firebase is not configured. Add the NEXT_PUBLIC_FIREBASE_* variables to .env.local and restart the app.'
    );
  }

  return initializeApp(firebaseConfig);
}

export function initializeFirebase() {
  if (!getApps().length) {
    if (hasFirebaseConfig) {
      return getSdks(initializeWithLocalConfig());
    }

    if (process.env.NODE_ENV === 'production') {
      try {
        return getSdks(initializeApp());
      } catch (error) {
        console.warn(
          'Automatic Firebase initialization failed. Falling back to NEXT_PUBLIC_FIREBASE_* env vars.',
          error
        );
      }
    }

    return getSdks(initializeWithLocalConfig());
  }

  return getSdks(getApp());
}

let sdks: { firebaseApp: FirebaseApp; auth: Auth; firestore: Firestore } | null = null;
export function getSdks(firebaseApp?: FirebaseApp) {
  if (!sdks) {
    if (!firebaseApp) {
      firebaseApp = getApps().length ? getApp() : initializeWithLocalConfig();
    }
    sdks = {
      firebaseApp,
      auth: getAuth(firebaseApp),
      firestore: getFirestore(firebaseApp),
    };
  }
  return sdks;
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './errors';
export * from './error-emitter';
