
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateResults } from '../utils/interview/resultGeneration';

/**
 * Custom hook to manage interview results
 * @param {Object} user - The current user object
 * @returns {Object} Result state and handler functions
 */
const useInterviewResults = (user) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultsData, setResultsData] = useState(null);

  /**
   * Submit test answers and generate results
   * @param {Object} answers - User's answers to the questions
   * @param {Array} questions - The questions that were asked
   * @returns {Promise<Object>} Generated results
   */
  const submitTest = async (answers, questions) => {
    setIsSubmitting(true);
    
    try {
      // Generate results based on answers
      const results = await saveAndGenerateResults(answers, questions);
      setResultsData(results);
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return results;
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting your answers. Please try again.');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Save results to Supabase and generate feedback
   * @param {Object} answers - User's answers to the questions
   * @param {Array} questions - The questions that were asked
   * @returns {Promise<Array>} Generated feedback and results
   */
  const saveAndGenerateResults = async (answers, questions) => {
    const results = generateResults(answers, questions);
    
    // Calculate overall scores
    const overallInterviewScore = results.reduce((sum, item) => sum + (item.score || 0), 0) / results.length;
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
  };

  return {
    isSubmitting,
    resultsData,
    submitTest,
    setResultsData
  };
};

export default useInterviewResults;
