
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ResultsStep = ({ results }) => {
  const calculateOverallScore = (results) => {
    if (!results || results.length === 0) return 0;
    const totalScore = results.reduce((acc, result) => acc + result.score, 0);
    return Math.round(totalScore / results.length);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Interview Results</h1>
          <p className="text-gray-600">Here's how you performed on your practice interview</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="mr-4">
            <div className="text-3xl font-bold text-center">{calculateOverallScore(results)}%</div>
            <div className="text-sm text-gray-500">Overall Score</div>
          </div>
          
          <div className="w-20 h-20">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path 
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path 
                className="circle"
                strokeDasharray={`${calculateOverallScore(results)}, 100`}
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#7E69AB"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="bg-interview-softBg p-4 rounded-lg mb-4">
          <h2 className="font-semibold mb-1">Overall Assessment</h2>
          <p className="text-sm">
            {calculateOverallScore(results) >= 80 
              ? "Excellent performance! You demonstrated strong technical knowledge and communication skills. With some minor improvements, you'll be ready to ace your real interviews."
              : calculateOverallScore(results) >= 70
                ? "Good performance! You showed solid understanding of most topics. Work on being more specific in your examples and elaborating on technical details."
                : "You have a good foundation, but need more practice. Focus on providing more specific examples and technical details in your answers."}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-center">{results.filter(r => r.score >= 80).length}</div>
            <div className="text-sm text-gray-500 text-center">Strong Answers</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-green-500 h-1.5 rounded-full" 
                style={{ width: `${(results.filter(r => r.score >= 80).length / results.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-center">{results.filter(r => r.score >= 70 && r.score < 80).length}</div>
            <div className="text-sm text-gray-500 text-center">Good Answers</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-yellow-500 h-1.5 rounded-full" 
                style={{ width: `${(results.filter(r => r.score >= 70 && r.score < 80).length / results.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-white p-4 border border-gray-200 rounded-lg">
            <div className="text-lg font-bold text-center">{results.filter(r => r.score < 70).length}</div>
            <div className="text-sm text-gray-500 text-center">Needs Improvement</div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
              <div 
                className="bg-red-500 h-1.5 rounded-full" 
                style={{ width: `${(results.filter(r => r.score < 70).length / results.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-semibold">Detailed Question Analysis</h2>
        
        {results.map((result, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Question {index + 1}</h3>
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    result.score >= 80 ? 'bg-green-100 text-green-800' : 
                    result.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    Score: {result.score}%
                  </div>
                </div>
              </div>
              <p className="mt-2">{result.question}</p>
            </div>
            
            <div className="p-4">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer</h4>
              <p className="text-gray-700 mb-4">{result.answer}</p>
              
              <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback</h4>
              <p className="text-gray-700 mb-4">{result.feedback}</p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-1">Ideal Answer Structure</h4>
                <p className="text-blue-800 text-sm">{result.idealAnswer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-interview-softBg p-6 rounded-lg mb-8">
        <h2 className="font-semibold text-lg mb-4">Areas for Improvement</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Be More Specific</h3>
            <p className="text-gray-600 text-sm">
              Include more concrete examples and metrics in your answers. Quantify achievements when possible.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Technical Depth</h3>
            <p className="text-gray-600 text-sm">
              Demonstrate deeper technical knowledge by explaining not just what you did, but how you did it.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Structure Responses</h3>
            <p className="text-gray-600 text-sm">
              Use the STAR method for behavioral questions: Situation, Task, Action, Result.
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Time Management</h3>
            <p className="text-gray-600 text-sm">
              Practice giving more concise answers to ensure you cover all key points within the time limit.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <Link to="/interview-test">
          <Button variant="outline" className="border-interview-purple text-interview-purple hover:bg-interview-softBg">
            Try Another Practice Test
          </Button>
        </Link>
        
        <Link to="/live-interview">
          <Button className="bg-interview-purple hover:bg-interview-darkPurple">
            Try Live Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ResultsStep;
