
import React from 'react';
import { Button } from '@/components/ui/button';

const IntroStep = ({ onStartPreview }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-6">Practice Interview Test</h1>
      
      <div className="space-y-6">
        <div className="bg-interview-softBg p-4 rounded-lg">
          <h2 className="font-semibold text-lg mb-2">How it works</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>You'll answer interview questions based on your resume</li>
            <li>You have 1 minute to answer each question <strong>using your voice</strong></li>
            <li>Your voice will be automatically transcribed into text</li>
            <li>After completing all questions, you'll receive feedback and scores</li>
          </ul>
        </div>
        
        <div>
          <h2 className="font-semibold text-lg mb-3">Interview Format</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="text-interview-purple mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Timed Responses</h3>
              <p className="text-sm text-gray-600">60 seconds per question to simulate interview pressure</p>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="text-interview-purple mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">Mixed Questions</h3>
              <p className="text-sm text-gray-600">Technical, behavioral, and general questions</p>
            </div>
            
            <div className="bg-white p-4 border border-gray-200 rounded-lg">
              <div className="text-interview-purple mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-medium mb-1">AI Evaluation</h3>
              <p className="text-sm text-gray-600">Detailed feedback and scoring on your responses</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <h2 className="font-semibold text-yellow-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Microphone Required
          </h2>
          <p className="text-yellow-800 text-sm mb-2">
            This interview test uses speech recognition. Please ensure your browser has microphone permissions enabled.
          </p>
          <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
            <li>Speak clearly and at a normal pace</li>
            <li>Use the STAR method for behavioral questions</li>
            <li>Provide specific examples where possible</li>
            <li>Focus on your unique skills and experiences</li>
          </ul>
        </div>
        
        <div className="flex justify-center pt-4">
          <Button 
            className="bg-interview-purple hover:bg-interview-darkPurple px-8 py-2"
            onClick={onStartPreview}
          >
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IntroStep;
