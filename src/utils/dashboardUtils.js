
import { format } from 'date-fns';

// Format date to readable format
export const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), 'MMM d, yyyy');
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString || 'Unknown date';
  }
};

// Calculate average score from an array of test results
export const calculateAverageScore = (results, scoreField) => {
  if (!results || results.length === 0) return 0;
  
  const validScores = results
    .map(result => {
      // Parse the feedback if it exists and extract the score
      if (scoreField === 'ats_score') return result.ats_score || 0;
      
      try {
        const feedback = result.feedback ? JSON.parse(result.feedback) : [];
        if (scoreField === 'total_score') return result.total_score || 0;
      } catch (error) {
        console.error("Error parsing feedback:", error);
        return 0;
      }
      return 0;
    })
    .filter(score => score > 0);
  
  if (validScores.length === 0) return 0;
  return Math.round(validScores.reduce((sum, score) => sum + score, 0) / validScores.length);
};

// Helper to get growth trend
export const calculateGrowthTrend = (results, scoreField) => {
  if (!results || results.length < 2) return { percentage: 0, isPositive: true };
  
  // Sort results by date (newest first)
  const sortedResults = [...results].sort((a, b) => 
    new Date(b.created_at) - new Date(a.created_at)
  );
  
  // Get the latest and previous scores
  let latestScore, previousScore;
  
  if (scoreField === 'ats_score' || scoreField === 'total_score') {
    latestScore = sortedResults[0][scoreField] || 0;
    previousScore = sortedResults[1][scoreField] || 0;
  } else {
    try {
      latestScore = sortedResults[0][scoreField] || 0;
      previousScore = sortedResults[1][scoreField] || 0;
    } catch (error) {
      return { percentage: 0, isPositive: true };
    }
  }
  
  // Calculate growth percentage
  if (previousScore === 0) return { percentage: 0, isPositive: true };
  
  const difference = latestScore - previousScore;
  const percentage = Math.round((difference / previousScore) * 100);
  
  return {
    percentage: Math.abs(percentage),
    isPositive: percentage >= 0
  };
};

// Get interview type from feedback
export const getInterviewTypeFromFeedback = (feedback) => {
  if (!feedback || feedback.length === 0) return 'General';
  
  // Count question types
  const typeCounts = feedback.reduce((counts, item) => {
    if (item.question && item.question.toLowerCase().includes('technical')) {
      counts.technical = (counts.technical || 0) + 1;
    } else if (item.question && item.question.toLowerCase().includes('behavior')) {
      counts.behavioral = (counts.behavioral || 0) + 1;
    } else {
      counts.general = (counts.general || 0) + 1;
    }
    return counts;
  }, {});
  
  // Determine dominant type
  const max = Math.max(
    typeCounts.technical || 0, 
    typeCounts.behavioral || 0, 
    typeCounts.general || 0
  );
  
  if (max === typeCounts.technical) return 'Technical';
  if (max === typeCounts.behavioral) return 'Behavioral';
  return 'General';
};
