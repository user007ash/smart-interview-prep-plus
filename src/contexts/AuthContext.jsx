
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        // Handle specific auth events
        if (event === 'SIGNED_IN') {
          toast.success('Successfully signed in!');
          // Use setTimeout(0) to prevent deadlocks
          setTimeout(() => {
            navigate('/dashboard');
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          toast.info('You have been signed out');
          navigate('/');
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
      
      // Redirect to login if not authenticated and trying to access protected route
      const protectedRoutes = ['/dashboard', '/interview-test', '/resume-upload', '/live-interview'];
      const isProtectedRoute = protectedRoutes.some(route => location.pathname.startsWith(route));
      
      if (!currentSession && isProtectedRoute) {
        toast.error('Please sign in to access this page');
        navigate('/login');
      }
    };
    
    checkSession();

    return () => subscription.unsubscribe();
  }, [navigate, location]);

  // Auth methods
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

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Error signing out');
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
