
import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook for audio recording functionality
 * @returns {Object} Audio recording state and methods
 */
const useAudioRecorder = () => {
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaStreamRef = useRef(null);
  const audioChunks = useRef([]);

  /**
   * Stops the media stream
   */
  const stopMediaStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  /**
   * Starts audio recording
   * @returns {Promise<boolean>} Success status
   */
  const startRecording = useCallback(async () => {
    try {
      // Reset state
      audioChunks.current = [];
      setAudioBlob(null);
      setAudioUrl(null);
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      setRecorder(mediaRecorder);
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        // Create blob from chunks
        if (audioChunks.current.length > 0) {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          setAudioBlob(audioBlob);
          
          // Create URL for audio preview
          const url = URL.createObjectURL(audioBlob);
          setAudioUrl(url);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      
      // Provide more specific error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Microphone access denied. Please check your permissions.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone detected. Please check your device.');
      } else if (error.name === 'NotReadableError') {
        toast.error('Your microphone is already in use by another application.');
      } else {
        toast.error('Failed to start recording. Please check your device settings.');
      }
      
      return false;
    }
  }, []);

  /**
   * Stops audio recording
   * @returns {boolean} Success status
   */
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    // Stop recorder if exists and is recording
    if (recorder && recorder.state === 'recording') {
      try {
        recorder.stop();
      } catch (e) {
        console.error('Error stopping recorder:', e);
      }
    }
    
    // Stop and clean up media stream
    stopMediaStream();
    
    return true;
  }, [recorder, stopMediaStream]);

  /**
   * Resets recording state
   */
  const resetRecording = useCallback(() => {
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunks.current = [];
    
    // Revoke URL to avoid memory leaks
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  return {
    isRecording,
    audioBlob,
    audioUrl,
    startRecording,
    stopRecording,
    resetRecording
  };
};

export default useAudioRecorder;
