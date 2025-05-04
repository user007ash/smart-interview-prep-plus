
import React from 'react';

const AudioVisualizer = ({ visualFeedback, isRecording }) => {
  if (!isRecording) return null;
  
  return (
    <div className="w-full max-w-md h-16 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
      <div className="flex items-end h-12 space-x-1">
        {visualFeedback.map((height, index) => (
          <div 
            key={index} 
            className="w-1 bg-interview-purple transition-all duration-150"
            style={{ height: `${height}%`, minHeight: '2px' }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default AudioVisualizer;
