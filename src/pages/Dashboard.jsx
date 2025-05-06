
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import useDashboardData from '../hooks/useDashboardData';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import OverviewTab from '../components/dashboard/OverviewTab';
import ProfileTab from '../components/dashboard/ProfileTab';
import SettingsTab from '../components/dashboard/SettingsTab';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: null,
    createdAt: null,
  });
  
  const { user, isAuthenticated, loading } = useAuth();
  const { 
    testResults,
    resumes,
    loading: dataLoading,
    error,
    metrics,
    refreshData
  } = useDashboardData(user?.id);

  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error('Error fetching profile:', profileError);
          toast.error('Failed to load profile data');
        }
        
        // Get user metadata for created_at date if available
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Error fetching user data:', authError);
        }
        
        // Process and set user data
        setUserData({
          name: profileData?.full_name || user.user_metadata?.full_name || 'User',
          email: user.email || '',
          profileImage: profileData?.avatar_url || null,
          createdAt: authData?.user?.created_at || null,
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Error loading user profile');
      }
    };
    
    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // Check if user is authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Format member since date
  const memberSince = userData.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    : 'N/A';
  
  // Render loading state
  if (loading || dataLoading) {
    return (
      <DashboardLayout
        // Pass empty userData object to avoid undefined errors
        userData={{
          name: 'Loading...',
          email: '',
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        memberSince="Loading..."
        refreshData={refreshData}
      >
        <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-interview-purple"></div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Render dashboard content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            userData={userData}
            testResults={testResults}
            resumes={resumes}
            dataLoading={dataLoading}
            metrics={metrics}
          />
        );
      
      case 'profile':
        return <ProfileTab userData={userData} />;
      
      case 'settings':
        return <SettingsTab />;
      
      default:
        return null;
    }
  };
  
  return (
    <DashboardLayout
      userData={userData}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      memberSince={memberSince}
      error={error}
      refreshData={refreshData}
    >
      {renderTabContent()}
    </DashboardLayout>
  );
};

export default Dashboard;
