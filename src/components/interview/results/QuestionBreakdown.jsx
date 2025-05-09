
import React from 'react';
import QuestionDetail from './QuestionDetail';

const QuestionBreakdown = ({ results }) => {
  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Question-by-Question Breakdown</h2>
      
      <div className="space-y-4">
        {results.map((result, idx) => (
          <QuestionDetail key={idx} result={result} index={idx} />
        ))}
      </div>
    </div>
  );
};

export default QuestionBreakdown;
