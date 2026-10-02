import React, { createContext, useEffect, useState } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithGoogle as firebaseGoogleLogin, 
  logoutFirebase,
  isFirebaseConfigured 
} from '../services/firebase';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedGuest = localStorage.getItem('edubot_guest_user');
      return savedGuest ? JSON.parse(savedGuest) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    // If guest user already found, not loading
    try {
      const savedGuest = localStorage.getItem('edubot_guest_user');
      if (savedGuest) return false;
    } catch {
      // ignore
    }
    return isFirebaseConfigured;
  });

  useEffect(() => {
    if (user?.isGuest) return;

    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      if (!isFirebaseConfigured) {
        throw new Error('Firebase credentials are not set up in .env yet.');
      }
      setLoading(true);
      const loggedUser = await firebaseGoogleLogin();
      setUser(loggedUser);
      toast.success(`Welcome back, ${loggedUser.displayName || 'Student'}!`);
      return loggedUser;
    } catch (err) {
      console.error('Login error:', err);
      // If Firebase auth error or domain unauthorized, display helpful message
      toast.error(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = (customName = 'College Student') => {
    const guestUser = {
      uid: 'guest_' + Math.random().toString(36).substring(2, 9),
      displayName: customName,
      email: 'student@college.edu',
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(customName)}`,
      isGuest: true,
    };
    localStorage.setItem('edubot_guest_user', JSON.stringify(guestUser));
    setUser(guestUser);
    toast.success(`Started guest session as ${customName}`);
  };

  const logout = async () => {
    try {
      if (user?.isGuest) {
        localStorage.removeItem('edubot_guest_user');
      } else if (isFirebaseConfigured) {
        await logoutFirebase();
      }
      setUser(null);
      toast.success('Signed out successfully');
    } catch (err) {
      console.error('Logout error:', err);
      toast.error('Failed to log out');
    }
  };

  const value = {
    user,
    loading,
    isFirebaseConfigured,
    loginWithGoogle,
    loginAsGuest,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
