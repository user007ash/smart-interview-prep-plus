
import { useState, useEffect } from 'react';
import { 
  getInterviewQuestions, 
  fetchResumeBasedQuestions,
  getPreviouslyUsedQuestions,
  filterQuestionsByLanguage
} from '../utils/interview/questionGeneration';

/**
 * Custom hook to manage interview questions
 * @param {Object} user - The current user object
 * @param {string} roleType - The role type for the interview
 * @param {string} programmingLanguage - The selected programming language
 * @returns {Object} Question state and loading status
 */
const useInterviewQuestions = (user, roleType, programmingLanguage) => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [previouslyUsedQuestions, setPreviouslyUsedQuestions] = useState([]);

  // Load questions with resume-awareness and track previously used questions
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        let previousQuestions = [];
        
        // Get previously used questions to avoid repetition if user is logged in
        if (user) {
          previousQuestions = await getPreviouslyUsedQuestions(user.id);
          setPreviouslyUsedQuestions(previousQuestions);
        }
        
        // Try to fetch resume-based questions
        if (user) {
          const resumeQuestions = await fetchResumeBasedQuestions(user.id);
          
          if (resumeQuestions && resumeQuestions.length > 0) {
            console.log('Using resume-based questions:', resumeQuestions);
            let allQuestions = getInterviewQuestions(resumeQuestions, roleType, previousQuestions);
            
            // Filter by programming language if specified
            if (programmingLanguage && programmingLanguage !== 'none') {
              allQuestions = filterQuestionsByLanguage(allQuestions, programmingLanguage);
              // Ensure we still have enough questions
              if (allQuestions.length < 5) {
                // If not enough language-specific questions, add general questions
                const generalQuestions = getInterviewQuestions(resumeQuestions, roleType, previousQuestions);
                allQuestions = [...allQuestions, ...generalQuestions.slice(0, 10 - allQuestions.length)];
              }
            }
            
            setQuestions(allQuestions);
          } else {
            // Fallback to default questions
            console.log('Using default questions');
            let defaultQuestions = getInterviewQuestions(null, roleType, previousQuestions);
            
            // Filter by programming language if specified
            if (programmingLanguage && programmingLanguage !== 'none') {
              defaultQuestions = filterQuestionsByLanguage(defaultQuestions, programmingLanguage);
              // Ensure we still have enough questions
              if (defaultQuestions.length < 5) {
                const generalQuestions = getInterviewQuestions(null, roleType, previousQuestions);
                defaultQuestions = [...defaultQuestions, ...generalQuestions.slice(0, 10 - defaultQuestions.length)];
              }
            }
            
            setQuestions(defaultQuestions);
          }
        } else {
          // Fallback to default questions if no user
          let defaultQuestions = getInterviewQuestions(null, roleType, previousQuestions);
          
          // Filter by programming language if specified
          if (programmingLanguage && programmingLanguage !== 'none') {
            defaultQuestions = filterQuestionsByLanguage(defaultQuestions, programmingLanguage);
            // Ensure we still have enough questions
            if (defaultQuestions.length < 5) {
              const generalQuestions = getInterviewQuestions(null, roleType, previousQuestions);
              defaultQuestions = [...defaultQuestions, ...generalQuestions.slice(0, 10 - defaultQuestions.length)];
            }
          }
          
          setQuestions(defaultQuestions);
        }
      } catch (error) {
        console.error('Error loading questions:', error);
        // Fallback to default questions on error
        setQuestions(getInterviewQuestions());
      } finally {
        setIsLoadingQuestions(false);
      }
    };
    
    loadQuestions();
  }, [user, roleType, programmingLanguage]);

  return {
    questions,
    isLoadingQuestions,
    previouslyUsedQuestions
  };
};

export default useInterviewQuestions;
