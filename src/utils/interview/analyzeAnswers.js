
// Functions for analyzing answers
import { QUESTION_CATEGORIES } from './categories';

/**
 * Analyzes the presence of keywords relevant to the question type
 * @param {string} answer - The answer provided by the user
 * @param {string} questionType - The type of question
 * @returns {number} Score between 0-20 based on keyword relevance
 */
export const analyzeKeywords = (answer, questionType) => {
  const answerLower = answer.toLowerCase();
  
  // Define keywords by question type
  const keywordSets = {
    [QUESTION_CATEGORIES.BEHAVIORAL]: ['experience', 'team', 'project', 'lead', 'challenge', 'success', 'learn', 'improve', 'collaborate'],
    [QUESTION_CATEGORIES.TECHNICAL]: ['implement', 'develop', 'code', 'system', 'architecture', 'design', 'testing', 'debug', 'optimize'],
    [QUESTION_CATEGORIES.SITUATION]: ['handle', 'approach', 'resolve', 'strategy', 'solution', 'decision', 'prioritize', 'communication'],
    'Resume-Based': ['experience', 'skill', 'project', 'role', 'responsibility', 'achievement', 'contribution'],
    // Add language-specific keywords
    [QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA]: ['class', 'interface', 'extends', 'implements', 'exception', 'try', 'catch', 'finally', 'public', 'private', 'protected', 'static', 'override', 'abstract'],
    [QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT]: ['function', 'var', 'let', 'const', 'promise', 'async', 'await', 'callback', 'closure', 'prototype', 'this', 'arrow function', 'event loop'],
    [QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON]: ['def', 'class', 'self', 'list', 'tuple', 'dictionary', 'exception', 'try', 'except', 'finally', 'with', 'comprehension', 'lambda', 'decorator'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER]: ['code', 'develop', 'architecture', 'framework', 'algorithm', 'solution', 'testing', 'debug', 'optimize'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING]: ['campaign', 'strategy', 'audience', 'metrics', 'brand', 'digital', 'analytics', 'conversion'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE]: ['data', 'model', 'analysis', 'algorithm', 'prediction', 'insight', 'visualization', 'statistics'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER]: ['user', 'feature', 'roadmap', 'prioritize', 'stakeholder', 'requirement', 'market', 'feedback'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN]: ['user', 'interface', 'experience', 'wireframe', 'prototype', 'usability', 'feedback', 'iteration'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES]: ['client', 'prospect', 'lead', 'conversion', 'pipeline', 'negotiation', 'relationship', 'close']
  };
  
  // Default to behavioral keywords if type not found
  const relevantKeywords = keywordSets[questionType] || keywordSets[QUESTION_CATEGORIES.BEHAVIORAL];
  
  // Count how many relevant keywords are present in the answer
  const keywordMatches = relevantKeywords.filter(keyword => answerLower.includes(keyword));
  
  // Calculate score based on keyword matches
  return Math.min(20, keywordMatches.length * 5);
};

/**
 * Analyzes the structure of the answer
 * @param {string} answer - The answer provided by the user
 * @returns {number} Score between 0-15 based on structure quality
 */
export const analyzeStructure = (answer) => {
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgSentenceLength = answer.length / Math.max(1, sentenceCount);
  const paragraphs = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  
  // Ideal: 3-6 sentences, average sentence length 10-20 words, 1-3 paragraphs
  let structureScore = 0;
  
  if (sentenceCount >= 3 && sentenceCount <= 10) structureScore += 5;
  if (avgSentenceLength >= 50 && avgSentenceLength <= 150) structureScore += 5;
  if (paragraphs >= 1 && paragraphs <= 3) structureScore += 5;
  
  return structureScore;
};

/**
 * Analyzes the clarity of the answer
 * @param {string} answer - The answer provided by the user
 * @returns {number} Score between 0-15 based on clarity
 */
export const analyzeClarity = (answer) => {
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
  // Simple ATS analysis
  const wordCount = answer.split(/\s+/).length;
  let score = 70; // Base score
  
  // Adjust score based on word count
  if (wordCount < 30) score -= 15;
  if (wordCount > 50) score += 10;
  if (wordCount > 100) score += 5;
  
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
