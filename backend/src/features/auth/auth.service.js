import admin from '../../config/firebase.js';

/**
 * Verifies a Firebase ID token and returns a normalized user payload.
 * Replaces the previous google-auth-library verifyGoogleToken.
 */
export const verifyFirebaseToken = async (idToken) => {
  const decoded = await admin.auth().verifyIdToken(idToken);
  return {
    googleId: decoded.uid,
    email: decoded.email,
    name: decoded.name || decoded.email.split('@')[0],
    picture: decoded.picture || null,
  };
};