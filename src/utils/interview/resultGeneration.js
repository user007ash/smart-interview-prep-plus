
// Functions for generating interview results
import { analyzeATS, evaluateAnswer } from './analyzeAnswers';

/**
 * Generates results for each question based on the provided answers.
 * @param {Object} answers - An object containing the answers to the questions.
 * @param {Array<Object>} questions - An array of question objects.
 * @returns {Array<Object>} An array of result objects, each containing feedback and score.
 */
export const generateResults = (answers, questions) => {
  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    console.error('Invalid questions provided to generateResults');
    return [];
  }
  
  return questions.map(question => {
    // Safety check for question validity
    if (!question || !question.id || !question.text) {
      console.warn('Skipping invalid question in generateResults');
      return null;
    }
    
    // Get answer (if exists) or empty string
    const answer = (answers && answers[question.id]) || '';
    
    // Use our comprehensive evaluation function
    const evaluation = evaluateAnswer(answer, question.text, question.type);
    
    // Generate ATS analysis
    const atsAnalysis = analyzeATS(answer, question.type);
    
    // Build the result object with improved structure
    return {
      question: question.text,
      question_type: question.type,
      answer: answer,
      score: evaluation.score,
      feedback: evaluation.feedbacks.join(' '),
      suggestions: evaluation.suggestions,
      ats_score: atsAnalysis.score,
      ats_feedback: atsAnalysis.feedback,
      evaluation_details: evaluation.details // Add detailed evaluation metrics
    };
  }).filter(Boolean); // Filter out any null results from invalid questions
};
