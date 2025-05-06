
import React from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

const DashboardLayout = ({ 
  userData, 
  activeTab, 
  setActiveTab, 
  memberSince, 
  error, 
  refreshData, 
  children 
}) => {
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
              {children}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardLayout;
