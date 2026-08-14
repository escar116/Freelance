import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getUser } from "@work4abit/dataconnect";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  useEffect(() => {
    checkAppState();
    
    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch extra user data from PostgreSQL via Data Connect
          const response = await getUser({ id: currentUser.uid });
          if (!response.data.user) {
            // User does not exist in our Postgres DB yet!
            // We shouldn't let them stay logged in as a ghost.
            await signOut(auth);
            setUser(null);
            setIsAuthenticated(false);
            setAuthError("Incomplete registration");
          } else {
            const extraData = response.data.user;
            setUser({
              ...currentUser,
              id: currentUser.uid,
              full_name: extraData.fullName || currentUser.displayName || currentUser.email.split('@')[0],
              preferred_role: extraData.preferredRole || "Student",
              verification_status: extraData.verificationStatus || "unverified",
              ...extraData,
            });
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error("Failed to fetch user doc:", err);
          setAuthError("Failed to fetch user profile");
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }, (error) => {
      console.error("Auth state error:", error);
      setAuthError(error.message);
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const checkAppState = async () => {
    setIsLoadingPublicSettings(true);
    // Maintain mock public settings to prevent app crashes
    setAppPublicSettings({ id: 'mock', public_settings: {} });
    setIsLoadingPublicSettings(false);
  };

  const checkUserAuth = async () => {
    // No-op: onAuthStateChanged handles this automatically, but function kept for API compat
  };

  const logout = async (shouldRedirect = true) => {
    try {
      await signOut(auth);
      if (shouldRedirect) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const navigateToLogin = () => {
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      authChecked,
      logout,
      navigateToLogin,
      checkUserAuth,
      checkAppState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
