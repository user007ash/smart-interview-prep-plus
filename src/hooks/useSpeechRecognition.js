
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

const useSpeechRecognition = (onTranscriptUpdate) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState([]);
  const feedbackInterval = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(prev => {
          const updatedTranscript = prev + ' ' + currentTranscript;
          onTranscriptUpdate && onTranscriptUpdate(updatedTranscript.trim());
          return updatedTranscript;
        });
        
        // Generate random visual feedback when speech is detected
        setVisualFeedback(prev => [
          ...prev.slice(-20), 
          Math.random() * 50 + 10
        ]);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable microphone permissions.');
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
        clearInterval(feedbackInterval.current);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
        } else {
          clearInterval(feedbackInterval.current);
        }
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      setIsSupported(false);
      toast.error('Speech recognition is not supported by your browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      clearInterval(feedbackInterval.current);
    };
  }, [onTranscriptUpdate, isRecording]);

  const startRecognition = () => {
    try {
      if (!recognition) return false;
      
      setTranscript('');
      onTranscriptUpdate && onTranscriptUpdate('');
      setVisualFeedback([]);
      
      recognition.start();
      setIsRecording(true);
      
      // Generate some visual feedback even when not speaking
      feedbackInterval.current = setInterval(() => {
        setVisualFeedback(prev => [
          ...prev.slice(-20), 
          Math.random() * 20
        ]);
      }, 300);
      
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      toast.error('Failed to start speech recognition. Please try again.');
      return false;
    }
  };

  const stopRecognition = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
    clearInterval(feedbackInterval.current);
  };

  const resetTranscript = () => {
    setTranscript('');
    onTranscriptUpdate && onTranscriptUpdate('');
  };

  return {
    isRecording,
    transcript,
    isSupported,
    visualFeedback,
    startRecognition,
    stopRecognition,
    resetTranscript
  };
};

export default useSpeechRecognition;
