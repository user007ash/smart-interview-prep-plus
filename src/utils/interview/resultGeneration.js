
// Functions for generating interview results
import { analyzeATS, evaluateAnswer } from './analyzeAnswers';
import { generateFeedback, generateSuggestions } from './feedbackGeneration';

/**
 * Generates results for each question based on the provided answers.
 * @param {Object} answers - An object containing the answers to the questions.
 * @param {Array<Object>} questions - An array of question objects.
 * @returns {Array<Object>} An array of result objects, each containing feedback and score.
 */
export const generateResults = (answers, questions) => {
  return questions.map(question => {
    const answer = answers[question.id] || '';
    
    // Use our new comprehensive evaluation function
    const evaluation = evaluateAnswer(answer, question.text, question.type);
    
    // Generate ATS analysis
    const atsAnalysis = analyzeATS(answer, question.type);
    
    // Build the result object
    return {
      question: question.text,
      answer: answer,
      score: evaluation.score,
      feedback: evaluation.feedbacks.join(' '),
      suggestions: evaluation.suggestions,
      ats_score: atsAnalysis.score,
      ats_feedback: atsAnalysis.feedback,
      evaluation_details: evaluation.details // Add detailed evaluation metrics
    };
  });
};
