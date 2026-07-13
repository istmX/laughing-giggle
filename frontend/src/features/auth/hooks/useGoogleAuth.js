import { useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '@/lib/firebase';

const useGoogleAuth = ({ onCredential }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await onCredential(idToken);
    } catch (err) {
      const message = err.message || 'Failed to sign in with Google';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return {
    ready: true,
    loading,
    error,
    signInWithGoogle,
  };
};

export { useGoogleAuth };