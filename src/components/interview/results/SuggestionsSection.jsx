
import React from 'react';

const SuggestionsSection = ({ suggestions }) => {
  return (
    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
      <h3 className="font-medium text-interview-purple mb-3">Key Suggestions for Improvement</h3>
      
      {suggestions.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2 text-gray-700 text-sm">
          {suggestions.slice(0, 5).map((suggestion, idx) => (
            <li key={idx}>{suggestion}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 text-sm">No specific suggestions available.</p>
      )}
    </div>
  );
};

export default SuggestionsSection;
