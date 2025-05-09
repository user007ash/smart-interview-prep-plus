
import { useState } from 'react';

/**
 * Custom hook to manage interview workflow state
 * @returns {Object} Workflow state and control functions
 */
const useInterviewWorkflow = () => {
  const [step, setStep] = useState('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');

  /**
   * Start the preview step of the interview
   */
  const handleStartPreview = () => {
    setStep('preview');
  };
  
  /**
   * Start the actual test/question phase
   */
  const handleStartTest = () => {
    setStep('question');
  };
  
  /**
   * Move to the next question or results page
   * @param {string} answer - The current answer
   * @param {Array} questions - The questions array
   * @param {Function} onSubmitTest - Function to call when submitting the test
   */
  const handleNextQuestion = (answer, questions, onSubmitTest) => {
    try {
      // Save current answer
      if (answer && answer.trim()) {
        setAnswers(prev => ({
          ...prev,
          [questions[currentQuestionIndex].id]: answer
        }));
      }
      
      // Clear current answer
      setCurrentAnswer('');
      
      // Move to next question or results
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setStep('submitting');
        // Include the latest answer in the submission
        const finalAnswers = {
          ...answers,
          [questions[currentQuestionIndex].id]: answer
        };
        onSubmitTest(finalAnswers, questions)
          .then(() => {
            setStep('results');
          })
          .catch(() => {
            setStep('question'); // Go back to question on error
          });
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
    }
  };

  /**
   * Handle transcript updates from speech recognition
   * @param {string} transcript - The updated transcript
   */
  const handleTranscriptUpdate = (transcript) => {
    setCurrentAnswer(transcript);
  };

  return {
    step,
    currentQuestionIndex,
    answers,
    currentAnswer,
    handleStartPreview,
    handleStartTest,
    handleNextQuestion,
    handleTranscriptUpdate,
    setStep
  };
};

export default useInterviewWorkflow;
