
// Functions for analyzing answers
import { QUESTION_CATEGORIES } from './categories';
import { 
  evaluateAnswer, 
  isEffectivelyEmpty,
  analyzeKeywordsEnhanced,
  analyzeStructureEnhanced,
  analyzeCompleteness,
  analyzeRelevance 
} from './nlpAnalyzer';

/**
 * Analyzes the presence of keywords relevant to the question type
 * @param {string} answer - The answer provided by the user
 * @param {string} questionType - The type of question
 * @returns {number} Score between 0-20 based on keyword relevance
 */
export const analyzeKeywords = (answer, questionType) => {
  // Safety check for empty answers
  if (isEffectivelyEmpty(answer)) {
    return 0;
  }
  
  // Use our enhanced keyword analyzer but adapt output to maintain API compatibility
  const result = analyzeKeywordsEnhanced(answer, questionType);
  return Math.round(result.score / 5); // Convert 0-100 to 0-20
};

/**
 * Analyzes the structure of the answer
 * @param {string} answer - The answer provided by the user
 * @returns {number} Score between 0-15 based on structure quality
 */
export const analyzeStructure = (answer) => {
  // Safety check for empty answers
  if (isEffectivelyEmpty(answer)) {
    return 0;
  }
  
  // Use our enhanced structure analyzer but adapt output to maintain API compatibility
  const result = analyzeStructureEnhanced(answer);
  return Math.round((result.score / 100) * 15); // Convert 0-100 to 0-15
};

/**
 * Analyzes the clarity of the answer
 * @param {string} answer - The answer provided by the user
 * @returns {number} Score between 0-15 based on clarity
 */
export const analyzeClarity = (answer) => {
  if (isEffectivelyEmpty(answer)) {
    return 0;
  }
  
  // Simple analysis based on answer properties
  const wordsCount = answer.split(/\s+/).length;
  const avgWordLength = answer.length / Math.max(1, wordsCount);
  
  // Check for filler words that might indicate lack of clarity
  const fillerWords = ['um', 'like', 'you know', 'sort of', 'kind of'];
  const fillerCount = fillerWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (answer.match(regex) || []).length;
  }, 0);
  
  // Calculate clarity score
  let clarityScore = 15;
  
  // Deduct points for too short or too long answers
  if (wordsCount < 30) clarityScore -= 5;
  if (wordsCount > 300) clarityScore -= 5;
  
  // Deduct points for too many filler words
  clarityScore -= Math.min(10, fillerCount * 2);
  
  return Math.max(0, clarityScore);
};

/**
 * Analyzes the answer for ATS (Applicant Tracking System) compatibility
 * @param {string} answer - The user's answer
 * @param {string} questionType - The type of question
 * @returns {Object} Object containing ATS score and feedback
 */
export const analyzeATS = (answer, questionType) => {
  // Check if the answer is empty
  if (isEffectivelyEmpty(answer)) {
    return {
      score: 0,
      feedback: "No answer provided for ATS evaluation."
    };
  }
  
  // Simple ATS analysis
  const wordCount = answer.split(/\s+/).length;
  let score = 70; // Base score
  
  // Adjust score based on word count
  if (wordCount < 30) score -= 15;
  if (wordCount > 50) score += 10;
  if (wordCount > 100) score += 5;
  
  // Check for industry keywords based on question type
  const enhancedKeywords = analyzeKeywordsEnhanced(answer, questionType);
  score = Math.round(score * 0.7 + enhancedKeywords.score * 0.3);
  
  // Check for relevance to the question
  const relevance = analyzeRelevance(answer, questionType, questionType);
  score = Math.round(score * 0.8 + relevance.score * 0.2);
  
  // Cap the score
  score = Math.min(100, score);
  
  // Generate feedback based on score
  let feedback;
  if (score >= 90) {
    feedback = "Your answer contains strong keywords and phrases that would perform well in ATS systems.";
  } else if (score >= 75) {
    feedback = "Your answer is good for ATS systems, consider adding more industry-specific keywords.";
  } else {
    feedback = "To improve ATS compatibility, include more relevant keywords and elaborate on your specific experiences.";
  }
  
  return { score, feedback };
};

// Export comprehensive evaluation function
export { evaluateAnswer };
