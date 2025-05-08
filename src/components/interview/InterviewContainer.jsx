
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../Navbar';
import Footer from '../Footer';
import StepManager from './StepManager';
import useInterviewTimer from '../../hooks/useInterviewTimer';
import useInterviewState from '../../hooks/useInterviewState';
import { useAuth } from '@/contexts/AuthContext';

const InterviewContainer = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const {
    step,
    currentQuestionIndex,
    answers,
    currentAnswer,
    isSubmitting,
    resultsData,
    questions,
    isLoadingQuestions,
    handleStartPreview,
    handleStartTest,
    handleNextQuestion,
    handleTranscriptUpdate
  } = useInterviewState(user);
  
  // Use custom timer hook with the currentQuestionIndex to reset on question change
  const { timeLeft } = useInterviewTimer(
    60, 
    step === 'question',
    handleNextQuestion,
    currentQuestionIndex // Add currentQuestionIndex to dependencies
  );
  
  // Check if user is authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {loading || isLoadingQuestions ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-interview-purple"></div>
            </div>
          ) : (
            <StepManager
              step={step}
              questions={questions}
              onStartPreview={handleStartPreview}
              onStartTest={handleStartTest}
              currentQuestionIndex={currentQuestionIndex}
              timeLeft={timeLeft}
              onNextQuestion={handleNextQuestion}
              isSubmitting={isSubmitting}
              currentAnswer={currentAnswer}
              onTranscriptUpdate={handleTranscriptUpdate}
              answers={answers}
              results={resultsData}
            />
          )}
        </div>
      </div>
      <Footer />
      
      <style jsx="true">{`
        .circular-chart {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        
        .circle-bg {
          stroke-width: 3;
          fill: none;
        }
        
        .circle {
          stroke-width: 3;
          stroke-linecap: round;
          transition: all 1s ease-out;
          fill: none;
        }
      `}</style>
    </>
  );
};

export default InterviewContainer;
