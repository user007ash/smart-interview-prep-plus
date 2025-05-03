
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

const SpeechToText = ({ onTranscriptUpdate }) => {
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
          onTranscriptUpdate(updatedTranscript.trim());
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

  const toggleRecording = () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported by your browser.');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      clearInterval(feedbackInterval.current);
      toast.info('Recording stopped.');
    } else {
      setTranscript('');
      onTranscriptUpdate('');
      setVisualFeedback([]);
      
      try {
        recognition.start();
        setIsRecording(true);
        
        // Generate some visual feedback even when not speaking
        feedbackInterval.current = setInterval(() => {
          setVisualFeedback(prev => [
            ...prev.slice(-20), 
            Math.random() * 20
          ]);
        }, 300);
        
        toast.info('Recording started. Speak now...');
      } catch (error) {
        console.error('Failed to start recording:', error);
        toast.error('Failed to start recording. Please try again.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <Button
        onClick={toggleRecording}
        className={`flex items-center ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-interview-purple hover:bg-interview-darkPurple'
        } mb-4 px-6 py-3 text-lg`}
        disabled={!isSupported}
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
      
      {isSupported ? (
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
              
              {/* Visual audio waveform */}
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
              
              {/* Live transcript preview */}
              {transcript && (
                <div className="w-full max-w-lg bg-gray-50 p-3 rounded-lg text-gray-700 text-sm">
                  <p className="font-medium text-xs text-gray-500 mb-1">What I'm hearing:</p>
                  <p>{transcript}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-amber-600 text-sm p-4 bg-amber-50 rounded-lg">
          Speech recognition is not available in your browser. Please use Chrome, Edge, or Safari for the best experience.
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
