
import { useState } from 'react';
import useInterviewQuestions from './useInterviewQuestions';
import useInterviewResults from './useInterviewResults';
import useInterviewWorkflow from './useInterviewWorkflow';

/**
 * Custom hook to manage interview state and logic
 * @param {Object} user - The current user object
 * @returns {Object} Interview state and handler functions
 */
const useInterviewState = (user) => {
  const [roleType, setRoleType] = useState(null);
  const [programmingLanguage, setProgrammingLanguage] = useState(null);
  
  // Use specialized hooks
  const { 
    questions, 
    isLoadingQuestions 
  } = useInterviewQuestions(user, roleType, programmingLanguage);
  
  const { 
    isSubmitting, 
    resultsData, 
    submitTest, 
    setResultsData 
  } = useInterviewResults(user);
  
  const {
    step,
    currentQuestionIndex,
    answers,
    currentAnswer,
    handleStartPreview,
    handleStartTest,
    handleNextQuestion,
    handleTranscriptUpdate,
    setStep
  } = useInterviewWorkflow();

  // Handle the next question with the current context
  const processNextQuestion = () => {
    handleNextQuestion(
      currentAnswer,
      questions,
      submitTest
    );
  };
  
  // Update interview role type
  const setInterviewRoleType = (type) => {
    setRoleType(type);
  };
  
  // Update interview programming language
  const setInterviewLanguage = (language) => {
    setProgrammingLanguage(language);
  };

  return {
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
    handleNextQuestion: processNextQuestion,
    handleTranscriptUpdate,
    setInterviewRoleType,
    setInterviewLanguage
  };
};

export default useInterviewState;
