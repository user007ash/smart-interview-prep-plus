
import { COMMON_JOB_KEYWORDS, STRONG_ACTION_VERBS } from './keywords';
import { checkFormattingIssues } from './formatting';

/**
 * Calculate ATS compatibility score based on resume content
 * @param {string} resumeContent - The extracted text content of the resume
 * @param {string} jobType - The type of job (used to match relevant keywords)
 * @returns {Object} The ATS score and detailed analysis
 */
export const calculateATSScore = (resumeContent, jobType = 'general') => {
  if (!resumeContent || resumeContent.trim() === '') {
    return { 
      score: 0,
      keywordsFound: [],
      missingKeywords: [],
      actionVerbsFound: [],
      formattingIssues: [],
      recommendations: ['No resume content could be extracted. Please check the file format.']
    };
  }
  
  const content = resumeContent.toLowerCase();
  let score = 70; // Base score
  
  // Select relevant keyword categories
  const keywordSets = [COMMON_JOB_KEYWORDS[jobType] || [], COMMON_JOB_KEYWORDS.general];
  const allKeywords = [...new Set([].concat(...keywordSets))];
  
  // Find matching keywords
  const keywordsFound = allKeywords.filter(keyword => content.includes(keyword.toLowerCase()));
  const keywordScore = Math.min(15, keywordsFound.length * 1.5);
  score += keywordScore;
  
  // Find missing important keywords
  const importantKeywords = allKeywords.slice(0, 10); // Consider first 10 as most important
  const missingKeywords = importantKeywords.filter(keyword => 
    !content.includes(keyword.toLowerCase())
  ).slice(0, 5); // Show up to 5 missing keywords
  
  // Check for action verbs
  const actionVerbsFound = STRONG_ACTION_VERBS.filter(verb => 
    content.includes(verb.toLowerCase())
  );
  const actionVerbScore = Math.min(10, actionVerbsFound.length);
  score += actionVerbScore;
  
  // Check for quantifiable achievements (numbers and percentages)
  const hasQuantifiableAchievements = (content.match(/\d+%|\d+\s*percent|\$\d+|\d+\s*million|\d+\s*thousand/g) || []).length;
  if (hasQuantifiableAchievements > 0) {
    score += Math.min(5, hasQuantifiableAchievements * 2);
  } else {
    score -= 5;
  }
  
  // Check for contact information
  const hasEmail = !!content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const hasPhone = !!content.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (hasEmail && hasPhone) {
    score += 2;
  } else {
    score -= 3;
  }
  
  // Check formatting issues
  const formattingIssues = checkFormattingIssues(resumeContent);
  const severityMultipliers = { high: 5, medium: 3, low: 1 };
  
  formattingIssues.forEach(issue => {
    score -= severityMultipliers[issue.severity] || 0;
  });
  
  // Generate recommendations
  const recommendations = [];
  
  if (keywordsFound.length < 8) {
    recommendations.push('Include more industry-specific keywords relevant to the job description');
  }
  
  if (actionVerbsFound.length < 5) {
    recommendations.push('Use more strong action verbs to describe your experiences and achievements');
  }
  
  if (!hasQuantifiableAchievements) {
    recommendations.push('Add quantifiable achievements with numbers and percentages');
  }
  
  if (formattingIssues.length > 0) {
    recommendations.push('Address formatting issues that may affect ATS readability');
  }
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider adding these relevant keywords: ${missingKeywords.join(', ')}`);
  }
  
  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    score,
    keywordsFound,
    missingKeywords,
    actionVerbsFound,
    formattingIssues,
    recommendations
  };
};

/**
 * Generate comprehensive ATS feedback based on score and analysis
 * @param {number} score - The ATS compatibility score
 * @param {Object} analysisDetails - Detailed analysis results
 * @returns {Object} Formatted feedback object with message and improvements
 */
export const generateATSFeedback = (score, analysisDetails) => {
  let feedbackMessage = '';
  let strength = '';
  
  // Generate tiered feedback based on score
  if (score >= 85) {
    feedbackMessage = 'Your resume is well-optimized for ATS systems. Great use of relevant keywords and formatting.';
    strength = 'strong';
  } else if (score >= 60) {
    feedbackMessage = 'Good resume, but you could add more role-specific keywords and achievements to improve ATS compatibility.';
    strength = 'moderate';
  } else {
    feedbackMessage = 'Your resume needs significant improvement for ATS compatibility. Focus on formatting, keywords, and structure.';
    strength = 'weak';
  }
  
  // Generate specific improvements
  let improvements = [];
  
  if (analysisDetails) {
    if (analysisDetails.recommendations && analysisDetails.recommendations.length > 0) {
      improvements = analysisDetails.recommendations;
    }
    
    if (analysisDetails.formattingIssues && analysisDetails.formattingIssues.length > 0) {
      improvements = improvements.concat(
        analysisDetails.formattingIssues.map(issue => issue.issue)
      );
    }
  }
  
  return {
    message: feedbackMessage,
    strength,
    improvements: improvements.filter((item, index) => improvements.indexOf(item) === index) // Remove duplicates
  };
};
