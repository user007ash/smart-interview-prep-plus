
import React from 'react';
import { calculateATSScore, getATSFeedback } from '@/utils/interview/scoring';
import ScoreCard from './results/ScoreCard';
import ATSFeedback from './results/ATSFeedback';
import StrengthsSection from './results/StrengthsSection';
import ImprovementsSection from './results/ImprovementsSection';
import SuggestionsSection from './results/SuggestionsSection';
import QuestionBreakdown from './results/QuestionBreakdown';
import ActionButtons from './results/ActionButtons';

const ResultsStep = ({ results }) => {
  const calculateOverallScore = (results) => {
    if (!results || results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + (result.score || 0), 0);
    return Math.round(total / results.length);
  };

  const overallScore = calculateOverallScore(results);
  const atsScore = calculateATSScore(results);
  const atsFeedback = getATSFeedback(results);
  
  // Group feedback by score range
  const strengthsAndWeaknesses = {
    strengths: results.filter(r => r.score >= 80).map(r => r.question),
    improvements: results.filter(r => r.score >= 60 && r.score < 80).map(r => r.question),
    weaknesses: results.filter(r => r.score < 60).map(r => r.question)
  };
  
  // Aggregate suggestions across all answers
  const allSuggestions = results.reduce((acc, result) => {
    if (result.suggestions && result.suggestions.length > 0) {
      return [...acc, ...result.suggestions];
    }
    return acc;
  }, []);
  
  // Remove duplicate suggestions
  const uniqueSuggestions = [...new Set(allSuggestions)];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold mb-2">Interview Results</h1>
        <p className="text-gray-600">
          Here's how you performed in your mock interview. Review your scores and feedback to improve for your next interview.
        </p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Overall Score */}
        <ScoreCard 
          title="Overall Score" 
          description="How well you performed overall" 
          score={overallScore}
          tooltipText="This score represents your overall interview performance based on the quality and relevance of your answers."
        />
        
        {/* ATS Score */}
        <ScoreCard 
          title="ATS Compatibility" 
          description="How well your answers would perform in ATS systems" 
          score={atsScore}
          tooltipText="This score indicates how well your answers would perform when processed by an Applicant Tracking System (ATS)."
        />
      </div>
      
      {/* ATS Feedback */}
      <div className="px-6 pb-6">
        <ATSFeedback feedback={atsFeedback} />
      </div>
      
      {/* Strengths and Areas for Improvement */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <StrengthsSection strengths={strengthsAndWeaknesses.strengths} />
        <ImprovementsSection 
          improvements={strengthsAndWeaknesses.improvements} 
          weaknesses={strengthsAndWeaknesses.weaknesses} 
        />
      </div>
      
      {/* Key Suggestions */}
      <div className="px-6 pb-6">
        <SuggestionsSection suggestions={uniqueSuggestions} />
      </div>
      
      {/* Detailed Question Responses */}
      <div className="px-6 pb-6">
        <QuestionBreakdown results={results} />
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-100">
        <ActionButtons />
      </div>
    </div>
  );
};

export default ResultsStep;
