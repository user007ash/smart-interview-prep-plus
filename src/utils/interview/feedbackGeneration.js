
// Functions for generating feedback on answers
import { QUESTION_CATEGORIES } from './categories';
import { isEffectivelyEmpty } from './nlpAnalyzer';

/**
 * Generates contextual feedback based on the answer analysis
 * @param {string} answer - The user's answer
 * @param {string} question - The interview question
 * @param {string} questionType - The type of question
 * @param {number} wordCount - Word count of the answer
 * @param {number} score - Overall score
 * @returns {string} Detailed feedback
 */
export const generateFeedback = (answer, question, questionType, wordCount, score) => {
  if (isEffectivelyEmpty(answer)) {
    return `No answer was provided for this question.`;
  }
  
  if (score >= 85) {
    return `Excellent answer! You provided a comprehensive response that directly addressed the question with specific examples and clear communication.`;
  } else if (score >= 70) {
    return `Good answer. Your response was relevant and addressed the key aspects of the question. With a few improvements, it could be even stronger.`;
  } else if (score >= 50) {
    return `Satisfactory answer. Your response touched on some important points, but could benefit from more specific examples and clearer structure.`;
  } else {
    return `Your answer needs improvement. Consider providing more specific details, examples, and a clearer structure to better address the question.`;
  }
};

/**
 * Generates improvement suggestions based on answer analysis
 * @param {string} answer - The user's answer
 * @param {string} question - The interview question
 * @param {string} questionType - The type of question
 * @param {number} wordCount - Word count of the answer
 * @param {number} score - Overall score
 * @returns {Array<string>} Array of improvement suggestions
 */
export const generateSuggestions = (answer, question, questionType, wordCount, score) => {
  // Check if answer is empty
  if (isEffectivelyEmpty(answer)) {
    return ["Consider preparing an answer for this type of question."];
  }
  
  const suggestions = [];
  
  // Length-based suggestions
  if (wordCount < 50) {
    suggestions.push("Try to provide a more detailed response with specific examples.");
  } else if (wordCount > 300) {
    suggestions.push("Consider making your answer more concise while maintaining key points.");
  }
  
  // Structure-based suggestions
  if (answer.split(/[.!?]+/).length < 3) {
    suggestions.push("Structure your answer with a clear beginning, middle, and end.");
  }
  
  // Content-based suggestions by question type
  switch (questionType) {
    case QUESTION_CATEGORIES.BEHAVIORAL:
      if (!answer.toLowerCase().includes('example') && !answer.toLowerCase().includes('situation')) {
        suggestions.push("Include a specific example using the STAR method (Situation, Task, Action, Result).");
      }
      break;
      
    case QUESTION_CATEGORIES.TECHNICAL:
      if (!answer.toLowerCase().includes('example') && !answer.toLowerCase().includes('project')) {
        suggestions.push("Reference specific projects or technical implementations from your experience.");
      }
      break;
      
    case QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVA:
    case QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.JAVASCRIPT:
    case QUESTION_CATEGORIES.PROGRAMMING_LANGUAGE.PYTHON:
      if (!answer.toLowerCase().includes('example') && !answer.toLowerCase().includes('code')) {
        suggestions.push(`Include ${questionType} code examples or syntax to demonstrate your knowledge.`);
      }
      break;
      
    case 'Resume-Based':
      if (!answer.toLowerCase().includes('experience')) {
        suggestions.push("Connect your answer more directly to the experiences mentioned on your resume.");
      }
      break;
      
    default:
      // Default suggestions for any question type
      if (score < 70 && !answer.toLowerCase().includes('example')) {
        suggestions.push("Include specific examples to strengthen your response.");
      }
  }
  
  // Add a suggestion based on score
  if (score < 60) {
    suggestions.push("Practice articulating your thoughts more clearly with a structured approach to answering questions.");
  }
  
  // Technical language-specific suggestions
  if (questionType.includes('Java') || questionType.includes('JavaScript') || questionType.includes('Python')) {
    if (!answer.toLowerCase().includes('complexity') && !answer.toLowerCase().includes('performance')) {
      suggestions.push("Consider discussing time/space complexity or performance implications in your answer.");
    }
  }
  
  // Ensure we always provide at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push("For an even better answer, consider quantifying your achievements with specific metrics or results.");
  }
  
  return suggestions;
};
