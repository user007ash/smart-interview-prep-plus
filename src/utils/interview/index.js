
// Main entry point for interview utilities
import { getInterviewQuestions, fetchResumeBasedQuestions, filterQuestionsByLanguage } from './questionGeneration';
import { generateResults } from './resultGeneration';
import { 
  calculateOverallScore, 
  calculateATSScore, 
  getATSFeedback,
  identifyStrengths,
  identifyImprovements,
  aggregateSuggestions
} from './scoring';
import { 
  evaluateAnswer,
  isEffectivelyEmpty 
} from './nlpAnalyzer';

export {
  getInterviewQuestions,
  fetchResumeBasedQuestions,
  filterQuestionsByLanguage,
  generateResults,
  calculateOverallScore,
  calculateATSScore,
  getATSFeedback,
  identifyStrengths,
  identifyImprovements,
  aggregateSuggestions,
  evaluateAnswer,
  isEffectivelyEmpty
};
