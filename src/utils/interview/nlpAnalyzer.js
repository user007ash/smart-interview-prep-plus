
/**
 * Advanced NLP analyzer for interview answers
 * Uses various techniques to evaluate answer quality
 */

// Constants for evaluation
const THRESHOLDS = {
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
