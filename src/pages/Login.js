
import React from 'react';
import Navbar from '../components/Navbar';
import AuthForm from '../components/AuthForm';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="hidden lg:flex flex-col justify-center">
              <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
              <p className="text-gray-600 mb-6">
                Sign in to your account to continue your interview preparation journey.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Resume Analysis</h3>
                    <p className="text-gray-600 text-sm">Get expert insights on improving your resume to pass ATS systems</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Practice Interviews</h3>
                    <p className="text-gray-600 text-sm">Prepare with personalized questions based on your experience</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Performance Analytics</h3>
                    <p className="text-gray-600 text-sm">Track your progress and get suggestions for improvement</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <p className="text-gray-600">
                  Don't have an account yet?{' '}
                  <Link to="/signup" className="text-interview-purple font-medium hover:underline">
                    Create one here
                  </Link>
                </p>
              </div>
            </div>
            
            <div>
              <AuthForm />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Login;
