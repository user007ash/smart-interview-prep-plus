
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ImprovementsSection = ({ improvements, weaknesses }) => {
  return (
    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <AlertTriangle size={18} className="text-yellow-600 mr-2" />
        <h3 className="font-medium text-yellow-800">Areas for Improvement</h3>
      </div>
      
      {improvements.length > 0 || weaknesses.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-yellow-700 text-sm">
          {improvements.map((question, idx) => (
            <li key={idx}>{question}</li>
          ))}
          {weaknesses.map((question, idx) => (
            <li key={idx} className="text-red-700">{question}</li>
          ))}
        </ul>
      ) : (
        <p className="text-yellow-700 text-sm">No specific areas for improvement identified.</p>
      )}
    </div>
  );
};

export default ImprovementsSection;
