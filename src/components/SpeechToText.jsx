
import React, { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import RecordingControls from './audio/RecordingControls';
import AudioVisualizer from './audio/AudioVisualizer';
import AudioPreview from './audio/AudioPreview';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useAudioRecorder from '../hooks/useAudioRecorder';

/**
 * Component for speech-to-text functionality with audio recording
 */
const SpeechToText = ({ onTranscriptUpdate, currentQuestion }) => {
  const [isUploading, setIsUploading] = useState(false);
  
  // Use custom hooks for speech recognition and audio recording
  const speech = useSpeechRecognition(onTranscriptUpdate);
  const audio = useAudioRecorder();
  
  /**
   * Toggle recording state
   */
  const toggleRecording = async () => {
    if (!speech.isSupported) {
      toast.error('Speech recognition is not supported by your browser.');
      return;
    }

    if (speech.isRecording) {
      // Stop recording
      speech.stopRecognition();
      audio.stopRecording();
      toast.info('Recording stopped.');
    } else {
      // Start recording
      speech.resetTranscript();
      
      const audioStarted = await audio.startRecording();
      if (!audioStarted) return;
      
      const speechStarted = speech.startRecognition();
      if (!speechStarted) {
        audio.stopRecording();
        return;
      }
      
      toast.info('Recording started. Speak now...');
    }
  };

  /**
   * Upload audio recording to Supabase
   */
  const uploadRecording = async () => {
    if (!audio.audioBlob || !currentQuestion) {
      toast.error('No recording to upload or question is missing.');
      return;
    }

    setIsUploading(true);

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('audio', audio.audioBlob, 'recording.webm');
      formData.append('question', currentQuestion);
      formData.append('transcript', speech.transcript);

      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found. Please log in.');
      }

      // Call Supabase Edge Function for audio upload
      const response = await fetch(`https://lousxuhyqvxkmyjhzqcj.supabase.co/functions/v1/audio-upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload recording');
      }

      toast.success('Answer recorded and saved successfully!');
    } catch (error) {
      console.error('Error uploading recording:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Combine state from both hooks to determine overall recording status
  const isRecording = speech.isRecording || audio.isRecording;

  return (
    <div className="flex flex-col items-center w-full">
      <RecordingControls 
        isRecording={isRecording}
        onToggleRecording={toggleRecording}
        audioBlob={audio.audioBlob}
        onUploadRecording={uploadRecording}
        isUploading={isUploading}
        isSupported={speech.isSupported}
      />
      
      <div className={`w-full transition-all duration-300 ${isRecording ? 'opacity-100' : 'opacity-0'}`}>
        {isRecording && (
          <div className="text-sm text-gray-500 flex flex-col items-center">
            <div className="flex items-center mb-2">
              <span className="relative flex h-3 w-3 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Recording...
            </div>
            
            <AudioVisualizer 
              visualFeedback={speech.visualFeedback} 
              isRecording={isRecording} 
            />
            
            {/* Live transcript preview */}
            {speech.transcript && (
              <div className="w-full max-w-lg bg-gray-50 p-3 rounded-lg text-gray-700 text-sm">
                <p className="font-medium text-xs text-gray-500 mb-1">What I'm hearing:</p>
                <p>{speech.transcript}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <AudioPreview 
        audioBlob={audio.audioBlob}
        transcript={speech.transcript}
      />
    </div>
  );
};

export default SpeechToText;
