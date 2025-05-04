
import React from 'react';

const SubmittingStep = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
      <div className="py-12">
        <svg className="animate-spin mx-auto h-12 w-12 text-interview-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        
        <h2 className="text-xl font-bold mt-6 mb-2">Analyzing Your Answers</h2>
        <p className="text-gray-600">
          Our AI is evaluating your responses against ideal answers and generating personalized feedback.
        </p>
      </div>
    </div>
  );
};

export default SubmittingStep;
