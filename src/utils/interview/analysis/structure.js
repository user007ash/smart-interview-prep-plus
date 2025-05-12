
/**
 * Functions for analyzing answer structure
 */
import { isEffectivelyEmpty } from './core';

/**
 * Analyzes the coherence and structure of the answer
 * @param {string} answer - The candidate's answer
 * @returns {Object} Structure analysis metrics
 */
export const analyzeStructureEnhanced = (answer) => {
  if (isEffectivelyEmpty(answer)) {
    return { score: 0, feedback: "No answer provided to evaluate structure." };
  }
  
  // Split into sentences and paragraphs
  const sentences = answer.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const paragraphs = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  // Analyze sentence length variation (good for readability)
  const sentenceLengths = sentences.map(s => s.split(/\s+/).filter(w => w.length > 0).length);
  const avgSentenceLength = sentenceLengths.reduce((sum, len) => sum + len, 0) / Math.max(1, sentenceLengths.length);
  
  // Check for transition words that indicate good structure
  const transitionWords = ['first', 'second', 'third', 'finally', 'however', 'therefore', 'moreover', 'consequently', 'in addition', 'for example', 'specifically', 'in conclusion'];
  const transitionCount = transitionWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (answer.match(regex) || []).length;
  }, 0);
  
  // Calculate structure score
  let structureScore = 0;
  
  // Sentence structure (20 points)
  if (sentences.length >= 3 && sentences.length <= 15) {
    structureScore += 10;
    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
      structureScore += 10; // Ideal sentence length
    } else {
      structureScore += 5; // Less ideal but acceptable
    }
  } else if (sentences.length > 0) {
    structureScore += 5; // At least has some sentences
  }
  
  // Paragraph structure (40 points)
  if (paragraphs.length >= 2 && paragraphs.length <= 5) {
    structureScore += 25;
    
    // Check if paragraphs seem to have distinct purposes
    const distinctParagraphs = new Set(paragraphs.map(p => p.trim().substring(0, 20))).size;
    if (distinctParagraphs === paragraphs.length) {
      structureScore += 15; // Each paragraph appears unique
    } else {
      structureScore += 5; // Some repetition in paragraphs
    }
  } else if (paragraphs.length === 1) {
    structureScore += 15; // At least has a paragraph
  }
  
  // Transition usage (30 points)
  if (transitionCount >= 3) {
    structureScore += 30;
  } else if (transitionCount >= 1) {
    structureScore += 15;
  }
  
  // Coherence check (10 points) - simple check for repeated words/phrases
  const words = answer.toLowerCase().split(/\s+/);
  const wordFreq = {};
  words.forEach(word => {
    if (word.length > 3) { // Only count significant words
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });
  
  const repeatedWords = Object.values(wordFreq).filter(freq => freq > 3).length;
  if (repeatedWords <= 2) {
    structureScore += 10; // Good vocabulary variation
  } else if (repeatedWords <= 5) {
    structureScore += 5; // Some repetition
  }
  
  let feedback;
  if (structureScore >= 80) {
    feedback = "Excellent structure with clear organization, appropriate paragraphs, and good transitions.";
  } else if (structureScore >= 60) {
    feedback = "Good structure overall, but could improve organization or transition between ideas.";
  } else if (structureScore >= 40) {
    feedback = "Basic structure present, but needs better organization and paragraph development.";
  } else {
    feedback = "Structure needs improvement. Consider organizing your answer with clear paragraphs and transitions.";
  }
  
  return { 
    score: Math.min(100, structureScore), 
    feedback,
    details: {
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      avgSentenceLength,
      transitionCount
    }
  };
};
