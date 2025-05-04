
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Save, Loader2 } from 'lucide-react';

const RecordingControls = ({ isRecording, onToggleRecording, audioBlob, onUploadRecording, isUploading, isSupported }) => {
  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={onToggleRecording}
        className={`flex items-center ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-interview-purple hover:bg-interview-darkPurple'
        } mb-4 px-6 py-3 text-lg`}
        disabled={!isSupported || isUploading}
      >
        {isRecording ? (
          <>
            <MicOff className="mr-2 h-5 w-5" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-5 w-5" />
            Start Recording
          </>
        )}
      </Button>
      
      {audioBlob && !isRecording && (
        <Button
          onClick={onUploadRecording}
          className="bg-green-600 hover:bg-green-700 mb-4"
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Recording
            </>
          )}
        </Button>
      )}
      
      {!isSupported && (
        <div className="text-amber-600 text-sm p-4 bg-amber-50 rounded-lg">
          Speech recognition is not available in your browser. Please use Chrome, Edge, or Safari for the best experience.
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
