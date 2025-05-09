
// Scoring functions for interview results

/**
 * Calculates the overall score based on the feedback from the AI.
 * @param {Array<Object>} results - An array of result objects, each containing feedback.
 * @returns {number} The calculated overall score.
 */
export const calculateOverallScore = (results) => {
  if (!results || results.length === 0) {
    return 0;
  }
  
  // Sum up the individual scores
  const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0);
  
  // Calculate the average score
  const averageScore = totalScore / results.length;
  
  // Round the average score to the nearest integer
  return Math.round(averageScore);
};

/**
 * Calculates the ATS score from interview results
 * @param {Array<Object>} results - An array of result objects
 * @returns {number} The calculated ATS score
 */
export const calculateATSScore = (results) => {
  if (!results || results.length === 0) {
    return 0;
  }
  
  const atsScores = results.filter(r => r.ats_score !== undefined);
  if (atsScores.length === 0) return 0;
  
  const totalScore = atsScores.reduce((acc, result) => acc + result.ats_score, 0);
  return Math.round(totalScore / atsScores.length);
};

/**
 * Gets ATS feedback from interview results
 * @param {Array<Object>} results - An array of result objects
 * @returns {Array<string>} Array of ATS feedback strings
 */
export const getATSFeedback = (results) => {
  if (!results || results.length === 0) {
    return [];
  }
  
  return results
    .filter(r => r.ats_feedback)
    .map(r => r.ats_feedback)
    .filter((feedback, index, self) => 
      self.indexOf(feedback) === index
    );
};

/**
 * Identifies strengths from interview results
 * @param {Array<Object>} results - An array of result objects
 * @returns {Array<Object>} Array of strength areas with scores
 */
export const identifyStrengths = (results) => {
  if (!results || results.length === 0) {
    return [];
  }
  
  // Look for high scoring questions (80+)
  const strengths = results
    .filter(r => r.score >= 80)
    .map(r => ({
      question: r.question,
      score: r.score,
      type: r.question_type || 'General'
    }));
    
  return strengths;
};

/**
 * Identifies areas for improvement from interview results
 * @param {Array<Object>} results - An array of result objects
 * @returns {Array<Object>} Array of improvement areas with scores
 */
export const identifyImprovements = (results) => {
  if (!results || results.length === 0) {
    return [];
  }
  
  // Look for low/medium scoring questions (below 80)
  const improvements = results
    .filter(r => r.score < 80)
    .map(r => ({
      question: r.question,
      score: r.score,
      type: r.question_type || 'General',
      priority: r.score < 60 ? 'High' : 'Medium' // Prioritize very low scores
    }));
    
  return improvements;
};

/**
 * Generates an aggregate list of suggestions from all results
 * @param {Array<Object>} results - An array of result objects
 * @returns {Array<string>} Array of unique, prioritized suggestions
 */
export const aggregateSuggestions = (results) => {
  if (!results || results.length === 0) {
    return [];
  }
  
  // Collect all suggestions
  const allSuggestions = results.reduce((suggestions, result) => {
    if (result.suggestions && Array.isArray(result.suggestions)) {
      return [...suggestions, ...result.suggestions];
    }
    return suggestions;
  }, []);
  
  // Remove duplicates while preserving order
  const uniqueSuggestions = [];
  allSuggestions.forEach(suggestion => {
    // Check if this suggestion or a very similar one exists
    const exists = uniqueSuggestions.some(existing => 
      existing.toLowerCase().includes(suggestion.toLowerCase()) ||
      suggestion.toLowerCase().includes(existing.toLowerCase())
    );
    
    if (!exists) {
      uniqueSuggestions.push(suggestion);
    }
  });
  
  return uniqueSuggestions;
};
