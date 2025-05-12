
/**
 * Functions for analyzing answer completeness
 */
import { THRESHOLDS, isEffectivelyEmpty } from './core';

/**
 * Analyzes answer completeness based on length and content
 * @param {string} answer - The candidate's answer
 * @returns {Object} Completeness metrics
 */
export const analyzeCompleteness = (answer) => {
  if (isEffectivelyEmpty(answer)) {
    return { score: 0, feedback: "No answer provided." };
  }
  
  const words = answer.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  
  let completenessScore;
  let feedback;
  
  if (wordCount < THRESHOLDS.MINIMAL_ANSWER) {
    completenessScore = Math.max(20, (wordCount / THRESHOLDS.MINIMAL_ANSWER) * 40);
    feedback = "Your answer is very brief. Consider providing more details and examples.";
  } else if (wordCount < THRESHOLDS.SHORT_ANSWER) {
    completenessScore = 40 + ((wordCount - THRESHOLDS.MINIMAL_ANSWER) / 
                           (THRESHOLDS.SHORT_ANSWER - THRESHOLDS.MINIMAL_ANSWER)) * 20;
    feedback = "Your answer could be more comprehensive. Try elaborating further.";
  } else if (wordCount < THRESHOLDS.MEDIUM_ANSWER) {
    completenessScore = 60 + ((wordCount - THRESHOLDS.SHORT_ANSWER) / 
                           (THRESHOLDS.MEDIUM_ANSWER - THRESHOLDS.SHORT_ANSWER)) * 20;
    feedback = "Good answer length, but ensure you're covering all key aspects.";
  } else {
    completenessScore = 80 + Math.min(15, wordCount / 50);
    feedback = "Your answer is detailed and comprehensive.";
  }
  
  return { 
    score: Math.min(100, Math.round(completenessScore)), 
    feedback 
  };
};
