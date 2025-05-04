
import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import IntroStep from '../components/interview/IntroStep';
import PreviewStep from '../components/interview/PreviewStep';
import QuestionStep from '../components/interview/QuestionStep';
import SubmittingStep from '../components/interview/SubmittingStep';
import ResultsStep from '../components/interview/ResultsStep';
import { getInterviewQuestions, generateResults, calculateOverallScore } from '../utils/interviewUtils';

const InterviewTest = () => {
  const [step, setStep] = useState('intro'); // intro, preview, question, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const timerRef = useRef(null);
  
  // Get the interview questions
  const questions = getInterviewQuestions();
  
  // Check if user is authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Start timer when question begins
  useEffect(() => {
    if (step === 'question') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleNextQuestion();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, currentQuestionIndex]);
  
  const handleStartPreview = () => {
    setStep('preview');
  };
  
  const handleStartTest = () => {
    setStep('question');
    setTimeLeft(60);
  };
  
  const handleNextQuestion = () => {
    try {
      // Save current answer
      if (currentAnswer.trim()) {
        setAnswers(prev => ({
          ...prev,
          [questions[currentQuestionIndex].id]: currentAnswer
        }));
      }
      
      // Clear current answer
      setCurrentAnswer('');
      
      // Move to next question or results
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(60);
      } else {
        setStep('submitting');
        handleSubmitTest();
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  
  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate results based on answers
      const results = generateResults(answers, questions);
      
      if (user) {
        try {
          // Save to Supabase
          const { error } = await supabase.from('test_results').insert({
            user_id: user.id,
            ats_score: calculateOverallScore(results),
            total_score: calculateOverallScore(results),
            feedback: JSON.stringify(results),
          });
          
          if (error) {
            console.error('Supabase save error:', error);
            toast.error('Error saving results to database. Your results will be available temporarily.');
            // Save to localStorage as backup
            localStorage.setItem('last_interview_results', JSON.stringify({
              timestamp: new Date().toISOString(),
              results
            }));
          } else {
            toast.success('Test results saved successfully!');
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
          toast.error('Error connecting to database. Results saved locally.');
          // Save to localStorage as backup
          localStorage.setItem('last_interview_results', JSON.stringify({
            timestamp: new Date().toISOString(),
            results
          }));
        }
      }
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('results');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting your answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle speech-to-text transcript update
  const handleTranscriptUpdate = (transcript) => {
    setCurrentAnswer(transcript);
  };
  
  const renderContent = () => {
    switch (step) {
      case 'intro':
        return <IntroStep onStartPreview={handleStartPreview} />;
        
      case 'preview':
        return <PreviewStep questions={questions} onStartTest={handleStartTest} />;
        
      case 'question':
        return (
          <QuestionStep 
            currentQuestionIndex={currentQuestionIndex}
            questions={questions}
            timeLeft={timeLeft}
            onNextQuestion={handleNextQuestion}
            isSubmitting={isSubmitting}
            currentAnswer={currentAnswer}
            onTranscriptUpdate={handleTranscriptUpdate}
          />
        );
        
      case 'submitting':
        return <SubmittingStep />;
        
      case 'results':
        const results = generateResults(answers, questions);
        return <ResultsStep results={results} />;
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-interview-purple"></div>
            </div>
          ) : (
            renderContent()
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

export default InterviewTest;
