
import React from 'react';

const QuestionDetail = ({ result, index }) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
        <h3 className="font-medium">Question {index + 1}</h3>
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
  );
};

export default QuestionDetail;
