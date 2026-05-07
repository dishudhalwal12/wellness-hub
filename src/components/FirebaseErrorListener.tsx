'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It logs permission errors so they do not hard-crash the app.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: any) => {
      // Suppress annoying permission errors for diagnoses as we have a fallback
      if (error?.request?.path?.includes('/diagnoses')) {
        return;
      }
      console.error('Firebase permission error:', error);
    };

    errorEmitter.on('permission-error', handleError);

    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  return null;
}
