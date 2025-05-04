
import { useState, useRef } from 'react';
import { toast } from 'sonner';

const useAudioRecorder = () => {
  const [recorder, setRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaStreamRef = useRef(null);
  const audioChunks = useRef([]);

  // Stop media stream when component unmounts
  const stopMediaStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  // Start audio recording
  const startRecording = async () => {
    try {
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      setRecorder(mediaRecorder);
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone. Please check your permissions.');
      return false;
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    setIsRecording(false);
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
    stopMediaStream();
    return true;
  };

  // Reset recording state
  const resetRecording = () => {
    setAudioBlob(null);
    audioChunks.current = [];
  };

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    resetRecording
  };
};

export default useAudioRecorder;
