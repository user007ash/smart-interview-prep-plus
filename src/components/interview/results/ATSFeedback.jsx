
import React from 'react';

const ATSFeedback = ({ feedback }) => {
  return (
    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
      <h3 className="font-medium text-blue-800 mb-2">ATS Feedback</h3>
      {feedback.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm">
          {feedback.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-blue-700 text-sm">No specific ATS feedback available.</p>
      )}
    </div>
  );
};

export default ATSFeedback;
