
/**
 * Functions for analyzing keywords in answers
 */
import { isEffectivelyEmpty } from './core';

/**
 * Performs enhanced keyword analysis beyond simple matching
 * @param {string} answer - The candidate's answer
 * @param {string} questionType - The type of question
 * @returns {Object} Keyword analysis metrics
 */
export const analyzeKeywordsEnhanced = (answer, questionType) => {
  if (isEffectivelyEmpty(answer)) {
    return { score: 0, feedback: "No answer provided for keyword analysis." };
  }
  
  const answerLower = answer.toLowerCase();
  
  // Define enhanced keyword sets by question type
  const enhancedKeywordSets = {
    'Behavioral': {
      primary: ['experience', 'team', 'project', 'lead', 'challenge', 'success', 'learn', 'improve', 'collaborate'],
      secondary: ['responsibility', 'initiative', 'communication', 'problem', 'solution', 'achievement', 'goal', 'impact'],
      bonus: ['specific', 'measurable', 'results', 'value', 'insight', 'growth', 'reflection']
    },
    'Technical': {
      primary: ['implement', 'develop', 'code', 'system', 'architecture', 'design', 'testing', 'debug', 'optimize'],
      secondary: ['algorithm', 'efficiency', 'pattern', 'framework', 'library', 'solution', 'approach', 'analysis'],
      bonus: ['complexity', 'trade-off', 'performance', 'scalability', 'maintainability', 'best practice']
    },
    'Java': {
      primary: ['class', 'interface', 'extends', 'implements', 'exception', 'try', 'catch', 'object', 'method'],
      secondary: ['inheritance', 'polymorphism', 'encapsulation', 'abstract', 'static', 'final', 'override'],
      bonus: ['garbage collection', 'jvm', 'multithreading', 'synchronization', 'collection', 'generics']
    },
    'JavaScript': {
      primary: ['function', 'var', 'let', 'const', 'promise', 'async', 'await', 'callback', 'object'],
      secondary: ['closure', 'prototype', 'this', 'arrow function', 'event loop', 'dom', 'api', 'json'],
      bonus: ['hoisting', 'scope', 'context', 'destructuring', 'module', 'es6', 'framework']
    },
    'Python': {
      primary: ['def', 'class', 'list', 'tuple', 'dictionary', 'exception', 'try', 'except', 'import'],
      secondary: ['comprehension', 'lambda', 'decorator', 'generator', 'iterator', 'package', 'module'],
      bonus: ['pythonic', 'pep8', 'duck typing', 'gil', 'virtual environment', 'context manager']
    }
  };
  
  // Default to behavioral if no specific match
  const keywordSet = enhancedKeywordSets[questionType] || enhancedKeywordSets['Behavioral'];
  
  // Count matches in each category
  const primaryMatches = keywordSet.primary.filter(keyword => answerLower.includes(keyword));
  const secondaryMatches = keywordSet.secondary.filter(keyword => answerLower.includes(keyword));
  const bonusMatches = keywordSet.bonus.filter(keyword => answerLower.includes(keyword));
  
  // Calculate weighted score
  const score = Math.min(100, 
    (primaryMatches.length / keywordSet.primary.length) * 50 +
    (secondaryMatches.length / keywordSet.secondary.length) * 30 +
    (bonusMatches.length / keywordSet.bonus.length) * 20
  );
  
  let feedback;
  if (score >= 80) {
    feedback = "Excellent use of relevant terminology and concepts.";
  } else if (score >= 60) {
    feedback = "Good use of key terms, but could incorporate more domain-specific vocabulary.";
  } else if (score >= 40) {
    feedback = "Some relevant terms used, but missing important concepts for this topic.";
  } else {
    feedback = "Consider incorporating more technical/relevant terminology in your answer.";
  }
  
  return { 
    score: Math.round(score), 
    feedback,
    details: {
      primaryMatches,
      secondaryMatches,
      bonusMatches
    }
  };
};
