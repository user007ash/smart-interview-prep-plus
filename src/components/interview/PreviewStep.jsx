
import React from 'react';
import { Button } from '@/components/ui/button';

const PreviewStep = ({ questions, onStartTest }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6">Interview Questions Overview</h1>
      
      <div className="mb-6">
        <p className="text-gray-600 mb-4">
          You'll be answering the following {questions.length} questions. You'll have 60 seconds to answer each question.
        </p>
        
        <div className="space-y-3 mb-8">
          {questions.map((question, index) => (
            <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex justify-between">
                <span className="font-medium">Question {index + 1}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  question.type === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                  question.type === 'Behavioral' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                }`}>{question.type}</span>
              </div>
              <p className="text-gray-700 mt-2">{question.text}</p>
            </div>
          ))}
        </div>
        
        <div className="bg-interview-softBg p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Remember</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
            <li>Answer as if you were speaking in a real interview</li>
            <li>If you run out of time, your answer will be submitted automatically</li>
            <li>You cannot go back to previous questions</li>
          </ul>
        </div>
        
        <div className="flex justify-center">
          <Button 
            className="bg-interview-purple hover:bg-interview-darkPurple px-8 py-2"
            onClick={onStartTest}
          >
            Begin Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;
