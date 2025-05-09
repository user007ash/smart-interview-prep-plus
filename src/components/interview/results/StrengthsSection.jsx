
import React from 'react';
import { CheckCircle } from 'lucide-react';

const StrengthsSection = ({ strengths }) => {
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <CheckCircle size={18} className="text-green-600 mr-2" />
        <h3 className="font-medium text-green-800">Your Strengths</h3>
      </div>
      
      {strengths.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-green-700 text-sm">
          {strengths.map((question, idx) => (
            <li key={idx}>{question}</li>
          ))}
        </ul>
      ) : (
        <p className="text-green-700 text-sm">No specific strengths identified.</p>
      )}
    </div>
  );
};

export default StrengthsSection;
