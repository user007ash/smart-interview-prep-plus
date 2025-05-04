
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import StepManager from '../components/interview/StepManager';
import useInterviewTimer from '../hooks/useInterviewTimer';
import { getInterviewQuestions, calculateOverallScore } from '../utils/interviewUtils';

const InterviewTest = () => {
  const [step, setStep] = useState('intro'); // intro, preview, question, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  
  // Get the interview questions
  const questions = getInterviewQuestions();
  
  // Use custom timer hook
  const { timeLeft } = useInterviewTimer(
    60, 
    step === 'question',
    handleNextQuestion
  );
  
  // Check if user is authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  function handleStartPreview() {
    setStep('preview');
  }
  
  function handleStartTest() {
    setStep('question');
  }
  
  function handleNextQuestion() {
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
      } else {
        setStep('submitting');
        handleSubmitTest();
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
      toast.error('An error occurred. Please try again.');
    }
  }
  
  async function handleSubmitTest() {
    setIsSubmitting(true);
    
    try {
      // Generate results based on answers
      const results = await saveAndGenerateResults();
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('results');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting your answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Function to save results to Supabase and generate feedback
  async function saveAndGenerateResults() {
    const results = Object.keys(answers).map(questionId => {
      const question = questions.find(q => q.id === questionId);
      // Generate score and feedback based on answer
      const score = Math.floor(Math.random() * 30) + 70; // Placeholder scoring logic
      return {
        question: question.text,
        answer: answers[questionId],
        score,
        feedback: `Your answer was ${score >= 80 ? 'strong' : 'good'}. ${score >= 80 ? 'Well articulated!' : 'Could use more specific examples.'}`,
        idealAnswer: `An ideal answer would include specific examples and demonstrate your experience with ${question.type.toLowerCase()} situations.`
      };
    });

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
    
    return results;
  }

  // Handle speech-to-text transcript update
  const handleTranscriptUpdate = (transcript) => {
    setCurrentAnswer(transcript);
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

export default InterviewTest;
