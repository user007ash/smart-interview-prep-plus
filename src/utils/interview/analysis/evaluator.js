
/**
 * Main evaluation module that combines all analyses
 */
import { isEffectivelyEmpty } from './core';
import { analyzeCompleteness } from './completeness';
import { analyzeRelevance } from './relevance';
import { analyzeKeywordsEnhanced } from './keywords';
import { analyzeStructureEnhanced } from './structure';

/**
 * Performs comprehensive answer evaluation using all available metrics
 * @param {string} answer - The candidate's answer
 * @param {string} question - The interview question
 * @param {string} questionType - The type of question
 * @returns {Object} Comprehensive evaluation results
 */
export const evaluateAnswer = (answer, question, questionType) => {
  // Check if the answer is empty first
  if (isEffectivelyEmpty(answer)) {
    return {
      score: 0,
      feedbacks: ["No answer was provided for this question."],
      suggestions: ["Prepare an answer for this type of question before your interview."],
      details: {
        completeness: { score: 0 },
        relevance: { score: 0 },
        keywords: { score: 0 },
        structure: { score: 0 }
      }
    };
  }
  
  // Run all analyses
  const completeness = analyzeCompleteness(answer);
  const relevance = analyzeRelevance(answer, question, questionType);
  const keywords = analyzeKeywordsEnhanced(answer, questionType);
  const structure = analyzeStructureEnhanced(answer);
  
  // Calculate weighted overall score
  // Weights: Relevance (40%), Keywords (30%), Structure (20%), Completeness (10%)
  const overallScore = Math.round(
    (relevance.score * 0.4) +
    (keywords.score * 0.3) +
    (structure.score * 0.2) +
    (completeness.score * 0.1)
  );
  
  // Collect all feedback points
  const feedbacks = [];
  if (completeness.feedback) feedbacks.push(completeness.feedback);
  if (relevance.feedback) feedbacks.push(relevance.feedback);
  if (keywords.feedback) feedbacks.push(keywords.feedback);
  if (structure.feedback) feedbacks.push(structure.feedback);
  
  // Generate suggestions based on lowest scoring areas
  const suggestions = [];
  const areas = [
    { name: "relevance", score: relevance.score },
    { name: "keywords", score: keywords.score },
    { name: "structure", score: structure.score },
    { name: "completeness", score: completeness.score }
  ].sort((a, b) => a.score - b.score);
  
  // Generate suggestions for the two weakest areas
  for (let i = 0; i < Math.min(2, areas.length); i++) {
    if (areas[i].score < 60) {
      switch(areas[i].name) {
        case "relevance":
          suggestions.push("Focus more on addressing the specific question asked.");
          break;
        case "keywords":
          suggestions.push(`Include more ${questionType}-specific terminology in your answer.`);
          break;
        case "structure":
          suggestions.push("Improve your answer structure with clear paragraphs and transition phrases.");
          break;
        case "completeness":
          suggestions.push("Provide a more comprehensive answer with specific examples.");
          break;
      }
    }
  }
  
  // Add a type-specific suggestion if score is below 80
  if (overallScore < 80) {
    if (questionType === 'Behavioral') {
      suggestions.push("Use the STAR method (Situation, Task, Action, Result) to structure your response.");
    } else if (questionType.includes('Java') || questionType.includes('JavaScript') || questionType.includes('Python')) {
      suggestions.push("Include code examples or syntax to demonstrate your technical knowledge.");
    }
  }
  
  // Ensure we have at least one suggestion
  if (suggestions.length === 0 && overallScore < 95) {
    suggestions.push("For an even better answer, consider quantifying your achievements with specific metrics or results.");
  }
  
  return {
    score: overallScore,
    feedbacks,
    suggestions,
    details: {
      completeness,
      relevance,
      keywords,
      structure
    }
  };
};
