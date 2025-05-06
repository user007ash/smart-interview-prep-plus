import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

// Import Dashboard Components
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MetricsCard from '../components/dashboard/MetricsCard';
import InterviewResultsSection from '../components/dashboard/InterviewResultsSection';
import ResumeSection from '../components/dashboard/ResumeSection';
import WelcomeSection from '../components/dashboard/WelcomeSection';
import useDashboardData from '../hooks/useDashboardData';

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
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-interview-purple"></div>
        </div>
        <Footer />
      </>
    );
  }
  
  // Render dashboard tabs content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="animate-fade-in">
            {/* Welcome Message for new users or users with no data */}
            {(testResults.length === 0 || resumes.length === 0) && (
              <WelcomeSection userName={userData.name.split(' ')[0]} />
            )}
            
            {/* Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <MetricsCard
                title="Average Interview Score"
                value={`${metrics.averageInterviewScore}%`}
                loading={dataLoading}
                trend={metrics.interviewScoreTrend}
                tooltip="Your average score across all interview tests. This measures factors like content, clarity, and depth of your answers."
              />
              
              <MetricsCard
                title="Average ATS Score"
                value={`${metrics.averageATSScore}%`}
                loading={dataLoading}
                trend={metrics.atsScoreTrend}
                tooltip="Average score from Applicant Tracking System analysis, measuring how well your resume matches job descriptions."
              />
              
              <MetricsCard
                title="Tests Completed"
                value={metrics.testsCompleted}
                loading={dataLoading}
                subtitle={metrics.testsCompleted > 0 ? `${resumes.length} Resumes` : "No tests yet"}
              />
            </div>
            
            {/* Main Content Tabs */}
            <Tabs defaultValue="interviews" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="interviews" className="px-6">Interview Results</TabsTrigger>
                <TabsTrigger value="resumes" className="px-6">Resumes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="interviews" className="animate-fade-in">
                <InterviewResultsSection results={testResults} loading={dataLoading} />
              </TabsContent>
              
              <TabsContent value="resumes" className="animate-fade-in">
                <ResumeSection resumes={resumes} loading={dataLoading} />
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-interview-softBg rounded-full mb-4 flex items-center justify-center text-4xl text-interview-purple font-semibold">
                  {userData.name.charAt(0)}
                </div>
                <button className="text-interview-purple hover:underline text-sm">Change Photo</button>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        defaultValue={userData.name}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={userData.email}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                        readOnly
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        defaultValue="Senior Developer"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select 
                        id="industry"
                        name="industry"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple bg-white"
                        defaultValue="tech"
                      >
                        <option value="tech">Technology</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="retail">Retail</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      defaultValue="Full-stack developer with 5+ years of experience building web applications with React, Node.js, and MongoDB."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-3">Skills (Used for interview question matching)</h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'].map((skill, index) => (
                        <span key={index} className="bg-interview-softBg text-interview-purple px-3 py-1 rounded-full text-sm flex items-center">
                          {skill}
                          <button className="ml-2 text-interview-purple hover:text-interview-darkPurple">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </span>
                      ))}
                      <button className="border border-dashed border-gray-300 px-3 py-1 rounded-full text-sm text-gray-500 hover:border-interview-purple hover:text-interview-purple">
                        + Add Skill
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Password</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                    />
                  </div>
                  
                  <div>
                    <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                      Update Password
                    </Button>
                  </div>
                </form>
              </div>
              
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium mb-4">Email Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Interview Reminders</p>
                      <p className="text-sm text-gray-500">Get notified about scheduled interview sessions</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-interview-purple"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly Progress Report</p>
                      <p className="text-sm text-gray-500">Receive weekly summary of your interview performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-interview-purple"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Product Updates</p>
                      <p className="text-sm text-gray-500">Stay updated with new features and improvements</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-interview-purple"></div>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                  Delete My Account
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24 transition-shadow duration-300 hover:shadow-md">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-interview-softBg rounded-full flex items-center justify-center text-lg text-interview-purple font-semibold">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold">{userData.name}</h2>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
                
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Account Type</div>
                  <div className="font-medium">User</div>
                </div>
                
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">Member Since</div>
                  <div className="font-medium">{memberSince}</div>
                </div>
                
                <nav className="space-y-1">
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-interview-softBg text-interview-purple font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                  </button>
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-interview-softBg text-interview-purple font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                  
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === 'settings'
                        ? 'bg-interview-softBg text-interview-purple font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    onClick={() => setActiveTab('settings')}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </button>
                </nav>
                
                <div className="mt-8">
                  <Button 
                    onClick={refreshData} 
                    variant="outline" 
                    className="w-full border-interview-purple text-interview-purple hover:bg-interview-softBg"
                  >
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                  <h3 className="font-medium">Error Loading Data</h3>
                  <p>{error}</p>
                  <Button 
                    onClick={refreshData} 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
                  >
                    Retry
                  </Button>
                </div>
              )}
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
