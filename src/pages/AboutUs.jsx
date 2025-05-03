
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold mb-6 text-center">About InterviewPro</h1>
            
            <div className="mb-12">
              <div className="w-24 h-1 bg-interview-purple mx-auto mb-12"></div>
              
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-700 mb-6">
                At InterviewPro, we believe that everyone deserves the opportunity to showcase their true potential in job interviews. 
                Our mission is to democratize interview preparation by leveraging the power of AI to provide personalized, 
                effective training that builds confidence and improves outcomes for job seekers around the world.
              </p>
              
              <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
              <p className="text-gray-700 mb-6">
                We've built a comprehensive interview preparation platform that combines cutting-edge AI technology with proven 
                interview strategies. Our tools analyze your resume, generate personalized interview questions, provide real-time 
                feedback on your responses, and help you refine your interview skills through targeted practice.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-interview-softBg p-6 rounded-lg">
                  <div className="w-12 h-12 bg-interview-purple rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Resume Analysis</h3>
                  <p className="text-gray-600">
                    Our AI analyzes your resume to understand your experience and skills, generating targeted questions.
                  </p>
                </div>
                
                <div className="bg-interview-softBg p-6 rounded-lg">
                  <div className="w-12 h-12 bg-interview-purple rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Practice Interviews</h3>
                  <p className="text-gray-600">
                    Realistic simulations with AI feedback help you practice and improve your interview responses.
                  </p>
                </div>
                
                <div className="bg-interview-softBg p-6 rounded-lg">
                  <div className="w-12 h-12 bg-interview-purple rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Performance Analytics</h3>
                  <p className="text-gray-600">
                    Detailed analytics help you track progress and identify areas for improvement in your interview skills.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-gray-700 mb-12">
                InterviewPro was founded by a team of HR professionals, career coaches, and AI engineers who recognized 
                the need for more effective interview preparation tools. Our diverse team brings together expertise in 
                recruiting, natural language processing, and user experience design to create an innovative platform 
                that truly helps job seekers succeed.
              </p>
              
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-100 mb-8">
                <h2 className="text-xl font-semibold mb-4 text-center">Why Choose InterviewPro?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Personalized Experience</h3>
                      <p className="text-sm text-gray-600">
                        Questions and feedback tailored to your resume and career goals
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">AI-Powered Insights</h3>
                      <p className="text-sm text-gray-600">
                        Advanced analysis of your responses to provide actionable feedback
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Industry-Specific Training</h3>
                      <p className="text-sm text-gray-600">
                        Preparation modules designed for different roles and industries
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-interview-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Progress Tracking</h3>
                      <p className="text-sm text-gray-600">
                        Monitor your improvement over time with detailed analytics
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Link to="/resume-upload">
                <button className="bg-interview-purple text-white px-6 py-3 rounded-md hover:bg-interview-darkPurple transition-colors">
                  Start Your Interview Prep Today
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
