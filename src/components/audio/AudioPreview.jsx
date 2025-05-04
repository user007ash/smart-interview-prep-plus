
import React from 'react';

const AudioPreview = ({ audioBlob, transcript }) => {
  if (!audioBlob) return null;
  
  return (
    <div className="w-full max-w-md mt-4">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium text-sm text-gray-700 mb-2">Recording Preview</h3>
        <audio className="w-full" controls src={URL.createObjectURL(audioBlob)}></audio>
        
        {transcript && (
          <div className="mt-3">
            <h4 className="font-medium text-xs text-gray-500 mb-1">Transcript:</h4>
            <p className="text-sm text-gray-700">{transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioPreview;
