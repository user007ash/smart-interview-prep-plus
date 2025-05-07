
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook to handle speech recognition functionality
 * @param {Function} onTranscriptUpdate - Callback function to update transcript
 * @returns {Object} Speech recognition state and methods
 */
const useSpeechRecognition = (onTranscriptUpdate) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState([]);
  const feedbackInterval = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    // Check browser support for speech recognition
    const speechRecognitionAvailable = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    if (speechRecognitionAvailable) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      
      // Handle recognition results
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
          // Call callback if provided
          if (onTranscriptUpdate) {
            onTranscriptUpdate(updatedTranscript.trim());
          }
          return updatedTranscript;
        });
        
        // Generate visual feedback for voice activity
        setVisualFeedback(prev => [
          ...prev.slice(-20), 
          Math.random() * 50 + 10
        ]);
      };

      // Handle recognition errors
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        const errorMessages = {
          'not-allowed': 'Microphone access denied. Please enable microphone permissions.',
          'network': 'Network error occurred. Please check your connection.',
          'no-speech': 'No speech was detected. Please try again.',
          'aborted': 'Speech recognition was aborted.',
          'audio-capture': 'No microphone was found or it is not working properly.',
          'service-not-allowed': 'Speech recognition service is not allowed.',
          'bad-grammar': 'Error in recognition grammar.',
          'language-not-supported': 'The language is not supported.'
        };
        
        const errorMessage = errorMessages[event.error] || `Speech recognition error: ${event.error}`;
        toast.error(errorMessage);
        setIsRecording(false);
        clearInterval(feedbackInterval.current);
      };

      // Handle recognition end
      recognitionInstance.onend = () => {
        if (isRecording) {
          // Restart recognition if it's still supposed to be recording
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

    // Cleanup function
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
      clearInterval(feedbackInterval.current);
    };
  }, [onTranscriptUpdate, isRecording]);

  /**
   * Start speech recognition
   * @returns {boolean} Success status
   */
  const startRecognition = () => {
    try {
      if (!recognition) return false;
      
      // Reset transcript and visual feedback
      setTranscript('');
      if (onTranscriptUpdate) {
        onTranscriptUpdate('');
      }
      setVisualFeedback([]);
      
      // Start recognition
      recognition.start();
      setIsRecording(true);
      
      // Generate visual feedback even when not speaking
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

  /**
   * Stop speech recognition
   */
  const stopRecognition = () => {
    if (recognition) {
      try {
        recognition.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
    setIsRecording(false);
    clearInterval(feedbackInterval.current);
  };

  /**
   * Reset transcript
   */
  const resetTranscript = () => {
    setTranscript('');
    if (onTranscriptUpdate) {
      onTranscriptUpdate('');
    }
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
