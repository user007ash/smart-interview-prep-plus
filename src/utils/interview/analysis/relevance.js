
/**
 * Functions for analyzing answer relevance
 */
import { isEffectivelyEmpty } from './core';

/**
 * Analyzes relevance of the answer to the question
 * @param {string} answer - The candidate's answer
 * @param {string} question - The interview question
 * @param {string} questionType - The type of question
 * @returns {Object} Relevance metrics
 */
export const analyzeRelevance = (answer, question, questionType) => {
  if (isEffectivelyEmpty(answer)) {
    return { score: 0, feedback: "No answer provided to evaluate relevance." };
  }
  
  // Extract key terms from the question
  const questionLower = question.toLowerCase();
  const answerLower = answer.toLowerCase();
  
  // Basic relevance check - look for question keywords in the answer
  const questionWords = questionLower
    .replace(/[.,?!;:(){}[\]]/g, '')
    .split(/\s+/)
    .filter(word => 
      word.length > 3 && 
      !['what', 'when', 'where', 'which', 'how', 'why', 'would', 'could', 'should', 'about', 'with', 'have', 'this', 'that', 'your'].includes(word)
    );
  
  // Count how many question keywords appear in the answer
  const matchedWords = questionWords.filter(word => answerLower.includes(word));
  const matchRatio = questionWords.length > 0 ? matchedWords.length / questionWords.length : 0;
  
  let relevanceScore = Math.round(matchRatio * 70);
  
  // Check for specific question-response patterns based on question type
  if (questionType === 'Behavioral') {
    // For behavioral questions, check for STAR method elements
    const hasStarElements = 
      /situation|context|background/i.test(answerLower) && 
      /task|challenge|problem/i.test(answerLower) &&
      /action|approach|step|did/i.test(answerLower) &&
      /result|outcome|impact|learn/i.test(answerLower);
      
    if (hasStarElements) {
      relevanceScore += 30;
    } else {
      relevanceScore = Math.min(80, relevanceScore + 15);
    }
  } else if (questionType.includes('Java') || questionType.includes('JavaScript') || questionType.includes('Python')) {
    // For technical coding questions, check for code snippets or technical terms
    const hasCodeElements = 
      /function|method|class|variable|return|if|else|for|while|try|catch|import|package|const|let|var/i.test(answerLower);
      
    if (hasCodeElements) {
      relevanceScore += 20;
    }
  }
  
  // Cap the score at 100
  relevanceScore = Math.min(100, relevanceScore);
  
  let feedback;
  if (relevanceScore >= 80) {
    feedback = "Your answer directly addresses the question with relevant content.";
  } else if (relevanceScore >= 60) {
    feedback = "Your answer is mostly relevant but could focus more directly on the question.";
  } else if (relevanceScore >= 40) {
    feedback = "Your answer is somewhat relevant but misses key aspects of the question.";
  } else {
    feedback = "Your answer appears to be off-topic or not directly addressing the question.";
  }
  
  return { score: relevanceScore, feedback };
};
