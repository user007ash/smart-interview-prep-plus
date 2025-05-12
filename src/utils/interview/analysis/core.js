
/**
 * Core utility functions for NLP analysis
 */

// Constants for evaluation
export const THRESHOLDS = {
  MINIMAL_ANSWER: 15, // word count
  SHORT_ANSWER: 50,
  MEDIUM_ANSWER: 100,
  EMPTY_THRESHOLD: 3, // consider answers with <= 3 words as effectively empty
};

/**
 * Determines if an answer should be considered empty/skipped
 * @param {string} answer - The candidate's answer
 * @returns {boolean} True if answer is effectively empty
 */
export const isEffectivelyEmpty = (answer) => {
  if (!answer || typeof answer !== 'string') return true;
  
  const trimmed = answer.trim();
  if (trimmed.length === 0) return true;
  
  const wordCount = trimmed.split(/\s+/).filter(word => word.length > 0).length;
  return wordCount <= THRESHOLDS.EMPTY_THRESHOLD;
};
