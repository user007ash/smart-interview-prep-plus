import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  getInterviewQuestions, 
  fetchResumeBasedQuestions,
  getPreviouslyUsedQuestions,
  filterQuestionsByLanguage
} from '../utils/interview/questionGeneration';
import { calculateOverallScore } from '../utils/interview/scoring';
import { generateResults } from '../utils/interview/resultGeneration';

/**
 * Custom hook to manage interview state and logic
 * @param {Object} user - The current user object
 * @returns {Object} Interview state and handler functions
 */
const useInterviewState = (user) => {
  const [step, setStep] = useState('intro'); // intro, preview, question, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [roleType, setRoleType] = useState(null);
  const [programmingLanguage, setProgrammingLanguage] = useState(null);
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
            if (programmingLanguage) {
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
            if (programmingLanguage) {
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
          if (programmingLanguage) {
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
      setResultsData(results);
      
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
    const results = generateResults(answers, questions);
    
    // Calculate overall scores
    const overallInterviewScore = calculateOverallScore(results);
    const overallATSScore = results.reduce((sum, item) => sum + (item.ats_score || 0), 0) / results.length;

    if (user) {
      try {
        // Save to Supabase
        const { error } = await supabase.from('test_results').insert({
          user_id: user.id,
          ats_score: Math.round(overallATSScore),
          total_score: overallInterviewScore,
          feedback: JSON.stringify(results),
          type: questions[0].type === 'Resume-Based' ? 'Resume-Based' : 'Practice'
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
          
          // Also save individual answers with ATS scores
          const answerPromises = Object.keys(answers).map(async (questionId) => {
            const question = questions.find(q => q.id === questionId);
            const answer = answers[questionId];
            const resultItem = results.find(r => r.question === question.text);
            
            return supabase.from('user_answers').insert({
              user_id: user.id,
              question: question.text,
              transcript: answer,
              ats_score: resultItem.ats_score || 0,
              ats_feedback: resultItem.ats_feedback || ''
            });
          });
          
          try {
            await Promise.all(answerPromises);
          } catch (answerError) {
            console.error('Error saving individual answers:', answerError);
          }
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
    handleNextQuestion,
    handleTranscriptUpdate,
    setInterviewRoleType,
    setInterviewLanguage
  };
};

export default useInterviewState;
