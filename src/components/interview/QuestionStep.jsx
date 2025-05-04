
import React from 'react';
import { Button } from '@/components/ui/button';
import SpeechToText from '../SpeechToText';

const QuestionStep = ({ 
  currentQuestionIndex, 
  questions, 
  timeLeft, 
  onNextQuestion, 
  isSubmitting, 
  currentAnswer, 
  onTranscriptUpdate
}) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <h2 className="text-xl font-bold">{questions[currentQuestionIndex].type} Question</h2>
        </div>
        
        <div className={`flex items-center px-3 py-1 rounded-full ${
          timeLeft > 30 ? 'bg-green-100 text-green-800' : 
          timeLeft > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
        }`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{timeLeft}s</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="p-4 bg-interview-softBg rounded-lg mb-6">
          <p className="font-medium">{questions[currentQuestionIndex].text}</p>
        </div>
        
        <div className="flex flex-col items-center justify-center py-6">
          <SpeechToText 
            onTranscriptUpdate={onTranscriptUpdate}
            currentQuestion={questions[currentQuestionIndex].text}
          />
          
          <div className="w-full max-w-md mt-8">
            {currentAnswer && !isSubmitting && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Your Answer (Transcribed)</h3>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200 max-h-32 overflow-y-auto">
                  <p className="text-gray-700">{currentAnswer}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          className="bg-interview-purple hover:bg-interview-darkPurple"
          onClick={onNextQuestion}
          disabled={isSubmitting}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Interview'}
        </Button>
      </div>
    </div>
  );
};

export default QuestionStep;
