
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
