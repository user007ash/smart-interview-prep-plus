
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { calculateATSScore, getATSFeedback } from '@/utils/interviewUtils';

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
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium">Overall Score</h2>
              <p className="text-sm text-gray-500">How well you performed overall</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">This score represents your overall interview performance based on the quality and relevance of your answers.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-36 h-36">
              <svg className="circular-chart" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#EAEAEA"
                />
                <path
                  className="circle"
                  strokeDasharray={`${overallScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke={
                    overallScore >= 80 ? "#4CAF50" :
                    overallScore >= 60 ? "#FF9800" : "#F44336"
                  }
                />
                <text x="18" y="20.35" className="score-text text-center font-bold text-3xl fill-current" style={{ dominantBaseline: 'middle', textAnchor: 'middle' }}>
                  {overallScore}%
                </text>
              </svg>
            </div>
          </div>
        </div>
        
        {/* ATS Score */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-medium">ATS Compatibility</h2>
              <p className="text-sm text-gray-500">How well your answers would perform in ATS systems</p>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info size={16} className="text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">This score indicates how well your answers would perform when processed by an Applicant Tracking System (ATS).</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex justify-center">
            <div className="relative w-36 h-36">
              <svg className="circular-chart" viewBox="0 0 36 36">
                <path
                  className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke="#EAEAEA"
                />
                <path
                  className="circle"
                  strokeDasharray={`${atsScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  stroke={
                    atsScore >= 80 ? "#4CAF50" :
                    atsScore >= 60 ? "#FF9800" : "#F44336"
                  }
                />
                <text x="18" y="20.35" className="score-text text-center font-bold text-3xl fill-current" style={{ dominantBaseline: 'middle', textAnchor: 'middle' }}>
                  {atsScore}%
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* ATS Feedback */}
      <div className="px-6 pb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-blue-800 mb-2">ATS Feedback</h3>
          {atsFeedback.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm">
              {atsFeedback.map((feedback, idx) => (
                <li key={idx}>{feedback}</li>
              ))}
            </ul>
          ) : (
            <p className="text-blue-700 text-sm">No specific ATS feedback available.</p>
          )}
        </div>
      </div>
      
      {/* Strengths and Areas for Improvement */}
      <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <CheckCircle size={18} className="text-green-600 mr-2" />
            <h3 className="font-medium text-green-800">Your Strengths</h3>
          </div>
          
          {strengthsAndWeaknesses.strengths.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-green-700 text-sm">
              {strengthsAndWeaknesses.strengths.map((question, idx) => (
                <li key={idx}>{question}</li>
              ))}
            </ul>
          ) : (
            <p className="text-green-700 text-sm">No specific strengths identified.</p>
          )}
        </div>
        
        {/* Areas for Improvement */}
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <AlertTriangle size={18} className="text-yellow-600 mr-2" />
            <h3 className="font-medium text-yellow-800">Areas for Improvement</h3>
          </div>
          
          {strengthsAndWeaknesses.improvements.length > 0 || strengthsAndWeaknesses.weaknesses.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1 text-yellow-700 text-sm">
              {strengthsAndWeaknesses.improvements.map((question, idx) => (
                <li key={idx}>{question}</li>
              ))}
              {strengthsAndWeaknesses.weaknesses.map((question, idx) => (
                <li key={idx} className="text-red-700">{question}</li>
              ))}
            </ul>
          ) : (
            <p className="text-yellow-700 text-sm">No specific areas for improvement identified.</p>
          )}
        </div>
      </div>
      
      {/* Key Suggestions */}
      <div className="px-6 pb-6">
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
          <h3 className="font-medium text-interview-purple mb-3">Key Suggestions for Improvement</h3>
          
          {uniqueSuggestions.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
              {uniqueSuggestions.slice(0, 5).map((suggestion, idx) => (
                <li key={idx}>{suggestion}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-700 text-sm">No specific suggestions available.</p>
          )}
        </div>
      </div>
      
      {/* Detailed Question Responses */}
      <div className="px-6 pb-6">
        <h2 className="text-lg font-bold mb-4">Question-by-Question Breakdown</h2>
        
        <div className="space-y-4">
          {results.map((result, idx) => (
            <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
                <h3 className="font-medium">Question {idx + 1}</h3>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  result.score >= 80 ? 'bg-green-100 text-green-800' :
                  result.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  Score: {result.score}%
                </span>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-500">Question:</span>
                  <p className="text-gray-800">{result.question}</p>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-500">Your Answer:</span>
                  <p className="text-gray-800 text-sm bg-gray-50 p-2 rounded">{result.answer || 'No answer provided'}</p>
                </div>
                
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-500">Feedback:</span>
                  <p className="text-gray-700 text-sm">{result.feedback}</p>
                </div>
                
                {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Suggestions:</span>
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                      {result.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
        <Button 
          variant="outline" 
          className="border-interview-purple text-interview-purple hover:bg-interview-softBg"
          asChild
        >
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        
        <Button 
          className="bg-interview-purple hover:bg-interview-darkPurple"
          asChild
        >
          <Link to="/interview-test">Start New Interview</Link>
        </Button>
      </div>
    </div>
  );
};

export default ResultsStep;
