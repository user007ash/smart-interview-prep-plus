
// Functions for generating interview results
import { analyzeKeywords, analyzeStructure, analyzeClarity, analyzeATS } from './analyzeAnswers';
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
    
    if (!answer || answer.trim().length === 0) {
      return {
        question: question.text,
        answer: '',
        score: 0,
        feedback: 'No answer was provided for this question.',
        suggestions: ['Consider preparing an answer for this type of question.'],
        ats_score: 0,
        ats_feedback: 'No answer was analyzed.'
      };
    }
    
    // Mock analysis factors based on answer content
    const wordCount = answer.split(/\s+/).length;
    const hasKeywords = analyzeKeywords(answer, question.type);
    const structureFactor = analyzeStructure(answer);
    const clarityFactor = analyzeClarity(answer);
    
    // Calculate the score based on the analysis factors
    let score = Math.min(100, 50 + hasKeywords + structureFactor + clarityFactor);
    score = Math.max(40, score); // Minimum score is 40
    
    // Generate feedback based on the answer analysis
    let feedback = generateFeedback(answer, question.text, question.type, wordCount, score);
    
    // Generate context-aware improvement suggestions
    const suggestions = generateSuggestions(answer, question.text, question.type, wordCount, score);
    
    // Generate ATS analysis
    const atsAnalysis = analyzeATS(answer, question.type);
    
    return {
      question: question.text,
      answer: answer,
      score: score,
      feedback: feedback,
      suggestions: suggestions,
      ats_score: atsAnalysis.score,
      ats_feedback: atsAnalysis.feedback
    };
  });
};
