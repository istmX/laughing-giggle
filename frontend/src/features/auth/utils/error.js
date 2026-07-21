export const formatAuthError = (error) => {
  if (!error) return '';
  const message = typeof error === 'string' ? error : error.message || '';
  const lowercaseMessage = message.toLowerCase();

  // Firebase Popup / Cancellation
  if (lowercaseMessage.includes('auth/popup-closed-by-user') || lowercaseMessage.includes('popup closed')) {
    return 'The sign-in window was closed before completion. Please try signing in again.';
  }
  if (lowercaseMessage.includes('auth/cancelled-popup-request') || lowercaseMessage.includes('popup request cancelled')) {
    return 'The sign-in request was cancelled. Please try again.';
  }

  // Account Status / Disabled
  if (lowercaseMessage.includes('auth/user-disabled')) {
    return 'This Zenix account has been disabled. Please contact system support.';
  }

  // Credentials / Bad Password / User Not Found
  if (
    lowercaseMessage.includes('auth/wrong-password') || 
    lowercaseMessage.includes('auth/user-not-found') || 
    lowercaseMessage.includes('auth/invalid-credential') || 
    lowercaseMessage.includes('invalid credentials') ||
    lowercaseMessage.includes('wrong password')
  ) {
    return 'Invalid email or password. Please verify your credentials and try again.';
  }

  // Invalid Email Formats
  if (lowercaseMessage.includes('auth/invalid-email') || lowercaseMessage.includes('invalid email')) {
    return 'Please enter a valid email address (e.g. name@example.com).';
  }

  // Email Already Taken
  if (
    lowercaseMessage.includes('auth/email-already-in-use') || 
    lowercaseMessage.includes('email already in use') || 
    lowercaseMessage.includes('email already registered') ||
    lowercaseMessage.includes('email taken')
  ) {
    return 'This email address is already registered. Please sign in instead.';
  }

  // Username Checks
  if (
    lowercaseMessage.includes('username-taken') || 
    lowercaseMessage.includes('username already taken') || 
    lowercaseMessage.includes('username is already in use') || 
    lowercaseMessage.includes('username taken')
  ) {
    return 'This username is already taken. Please choose a different username.';
  }
  if (
    lowercaseMessage.includes('invalid-username') || 
    lowercaseMessage.includes('invalid username') || 
    lowercaseMessage.includes('username must be')
  ) {
    return 'Username must be at least 3 characters and contain only letters, numbers, or underscores.';
  }

  // Weak Password
  if (lowercaseMessage.includes('auth/weak-password') || lowercaseMessage.includes('weak password')) {
    return 'Password is too weak. Please use a stronger password with at least 6 characters.';
  }

  // Missing Fields
  if (lowercaseMessage.includes('password is required') || lowercaseMessage.includes('missing-password')) {
    return 'Password is required. Please enter your password.';
  }
  if (lowercaseMessage.includes('email is required') || lowercaseMessage.includes('missing-email')) {
    return 'Email is required. Please enter your email address.';
  }
  if (lowercaseMessage.includes('username is required') || lowercaseMessage.includes('missing-username')) {
    return 'Username is required. Please choose a username.';
  }
  if (lowercaseMessage.includes('name is required') || lowercaseMessage.includes('missing-name')) {
    return 'Name is required. Please enter your name.';
  }

  // Network Failure
  if (lowercaseMessage.includes('auth/network-request-failed') || lowercaseMessage.includes('network-request-failed')) {
    return 'Network connection error. Please verify your internet and try again.';
  }

  // Fallback to cleaner message
  return message.replace(/^Firebase:\s*Error\s*\((.*?)\)\.?/, '$1').replace(/^Firebase:\s*/, '');
};
