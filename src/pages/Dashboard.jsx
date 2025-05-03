import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Settings } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    profileImage: null,
  });
  const [testResults, setTestResults] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isAuthenticated, loading } = useAuth();

  // Check if user is authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Load user data and test results
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
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
        
        // Get test results
        const { data: testResultsData, error: testResultsError } = await supabase
          .from('test_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (testResultsError) {
          console.error('Error fetching test results:', testResultsError);
          toast.error('Failed to load test history');
        }
        
        // Check localStorage for recent results that might not be in the database yet
        const localResults = localStorage.getItem('last_interview_results');
        
        // Process and set user data
        setUserData({
          name: profileData?.full_name || user.user_metadata?.full_name || 'User',
          email: user.email || '',
          profileImage: profileData?.avatar_url || null,
        });
        
        // Process test results
        const processedResults = (testResultsData || []).map(result => {
          try {
            // Parse feedback JSON if it exists
            const feedback = result.feedback ? JSON.parse(result.feedback) : [];
            return {
              id: result.id,
              date: new Date(result.created_at).toLocaleDateString(),
              questions: feedback.length || 0,
              score: result.total_score || 0,
              type: getInterviewTypeFromFeedback(feedback) || 'General',
              feedback
            };
          } catch (e) {
            console.error('Error parsing result:', e);
            return {
              id: result.id,
              date: new Date(result.created_at).toLocaleDateString(),
              questions: 0,
              score: result.total_score || 0,
              type: 'General',
              feedback: []
            };
          }
        });
        
        setTestResults(processedResults);
        
        // Process resumes (mock data for now)
        setResumes([
          {
            id: 1,
            name: 'Software_Engineer_Resume.pdf',
            uploadDate: '2023-05-15',
            atsScore: 85,
          },
          {
            id: 2,
            name: 'Product_Manager_Resume.pdf',
            uploadDate: '2023-06-02',
            atsScore: 72,
          }
        ]);
      } catch (error) {
        console.error('Dashboard data loading error:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [user]);
  
  // Helper function to determine interview type from feedback
  const getInterviewTypeFromFeedback = (feedback) => {
    if (!feedback || feedback.length === 0) return 'General';
    
    // Count question types
    const typeCounts = feedback.reduce((counts, item) => {
      if (item.question && item.question.toLowerCase().includes('technical')) {
        counts.technical = (counts.technical || 0) + 1;
      } else if (item.question && item.question.toLowerCase().includes('behavior')) {
        counts.behavioral = (counts.behavioral || 0) + 1;
      } else {
        counts.general = (counts.general || 0) + 1;
      }
      return counts;
    }, {});
    
    // Determine dominant type
    const max = Math.max(
      typeCounts.technical || 0, 
      typeCounts.behavioral || 0, 
      typeCounts.general || 0
    );
    
    if (max === typeCounts.technical) return 'Technical';
    if (max === typeCounts.behavioral) return 'Behavioral';
    return 'General';
  };
  
  // Calculate average score
  const calculateAverageScore = () => {
    if (testResults.length === 0) return 0;
    const sum = testResults.reduce((total, result) => total + result.score, 0);
    return Math.round(sum / testResults.length);
  };
  
  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Uploaded Resumes</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{resumes.length}</span>
                  <Link to="/resume-upload" className="text-interview-purple text-sm hover:underline">Upload New</Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Completed Interviews</h3>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold">{testResults.length}</span>
                  <Link to="/interview-test" className="text-interview-purple text-sm hover:underline">Start New</Link>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-gray-500 text-sm font-medium mb-2">Average Score</h3>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{calculateAverageScore()}%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Resumes</h2>
                  <Link to="/resume-upload" className="text-interview-purple text-sm hover:underline">View All</Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ATS Score
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {resumes.length > 0 ? (
                          resumes.map((resume) => (
                            <tr key={resume.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {resume.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {resume.uploadDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-900 mr-2">{resume.atsScore}%</span>
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        resume.atsScore >= 80 ? 'bg-green-500' : 
                                        resume.atsScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${resume.atsScore}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-interview-purple hover:underline">View</button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                              No resumes uploaded yet. 
                              <Link to="/resume-upload" className="text-interview-purple hover:underline ml-1">
                                Upload your first resume
                              </Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Recent Interview Tests</h2>
                  <Link to="/interview-history" className="text-interview-purple text-sm hover:underline">View All</Link>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Questions
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Score
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {testResults.length > 0 ? (
                          testResults.slice(0, 4).map((result) => (
                            <tr key={result.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {result.date}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {result.questions}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-900 mr-2">{result.score}%</span>
                                  <div className="w-16 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        result.score >= 80 ? 'bg-green-500' : 
                                        result.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${result.score}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  result.type === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                                  result.type === 'Behavioral' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                                }`}>
                                  {result.type}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                              No interview tests completed yet. 
                              <Link to="/interview-test" className="text-interview-purple hover:underline ml-1">
                                Take your first test
                              </Link>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-interview-softBg rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Suggested Next Steps</h2>
                <button className="text-interview-purple text-sm hover:underline">Refresh</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Try a Live Interview</h3>
                  <p className="text-gray-600 text-sm mb-3">Practice with our webcam-based interview simulation.</p>
                  <Link to="/live-interview">
                    <Button className="w-full bg-interview-purple hover:bg-interview-darkPurple">Start Now</Button>
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Behavioral Questions</h3>
                  <p className="text-gray-600 text-sm mb-3">Your technical skills are strong, but try practicing leadership questions.</p>
                  <Link to="/interview-test">
                    <Button className="w-full bg-interview-purple hover:bg-interview-darkPurple">Practice</Button>
                  </Link>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold mb-2">Optimize Resume</h3>
                  <p className="text-gray-600 text-sm mb-3">Your current ATS score could be improved with some adjustments.</p>
                  <Link to="/resume-upload">
                    <Button className="w-full bg-interview-purple hover:bg-interview-darkPurple">Upload New</Button>
                  </Link>
                </div>
              </div>
            </div>
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
  
  if (loading || isLoading) {
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
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 lg:w-72 shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-interview-softBg rounded-full flex items-center justify-center text-lg text-interview-purple font-semibold">
                    {userData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="font-semibold">{userData.name}</h2>
                    <p className="text-sm text-gray-600">{userData.email}</p>
                  </div>
                </div>
                
                <nav className="space-y-1">
                  <button
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
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
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
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
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${
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
              </div>
            </div>
            
            <div className="flex-1">
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
