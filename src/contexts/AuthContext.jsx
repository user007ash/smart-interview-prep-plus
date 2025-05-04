
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Authentication context for user session management
 */
const AuthContext = createContext(null);

/**
 * Hook to use the auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * Provider component for authentication state
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST to avoid missing auth events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!');
          // Use setTimeout(0) to prevent deadlocks with Supabase auth
          setTimeout(() => {
            navigate('/dashboard');
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
          navigate('/');
        } else if (event === 'TOKEN_REFRESHED') {
          // Session refreshed, no need for user-facing message
          console.log('Auth token refreshed');
        } else if (event === 'USER_UPDATED') {
          toast.info('Your account has been updated');
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setLoading(false);
          return;
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Handle protected route access
        const protectedRoutes = ['/dashboard', '/interview-test', '/resume-upload', '/live-interview'];
        const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
        
        if (!currentSession && isProtectedRoute) {
          toast.error('Please sign in to access this page');
          // Store the attempted URL to redirect back after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          navigate('/login');
        }

        // If user was redirected to login and now has a session, redirect back
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (currentSession && redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          // Use setTimeout to prevent navigation deadlocks
          setTimeout(() => {
            navigate(redirectPath);
          }, 0);
        }
      } catch (error) {
        console.error('Unexpected error checking session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, [navigate, location]);

  /**
   * Register a new user
   */
  const signUp = async ({ email, password, name }) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          }
        }
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error(error.message || 'Error creating account');
      return { success: false, error };
    }
  };

  /**
   * Sign in an existing user
   */
  const signIn = async ({ email, password }) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error(error.message || 'Invalid login credentials');
      return { success: false, error };
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
      return { success: false, error };
    }
  };

  /**
   * Request a password reset email
   */
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      toast.success('Password reset email sent. Check your inbox.');
      return { success: true };
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error(error.message || 'Failed to send password reset email');
      return { success: false, error };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
