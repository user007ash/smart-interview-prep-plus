
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { toast } from 'sonner';

const SpeechToText = ({ onTranscriptUpdate }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

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
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable microphone permissions.');
        } else {
          toast.error(`Speech recognition error: ${event.error}`);
        }
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
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
      toast.info('Recording stopped.');
    } else {
      setTranscript('');
      onTranscriptUpdate('');
      recognition.start();
      setIsRecording(true);
      toast.info('Recording started. Speak now...');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={toggleRecording}
        className={`flex items-center ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-interview-purple hover:bg-interview-darkPurple'
        } mb-2`}
        disabled={!isSupported}
      >
        {isRecording ? (
          <>
            <MicOff className="mr-2 h-4 w-4" />
            Stop Recording
          </>
        ) : (
          <>
            <Mic className="mr-2 h-4 w-4" />
            Start Recording
          </>
        )}
      </Button>
      {isRecording && (
        <div className="text-sm text-gray-500 flex items-center">
          <span className="relative flex h-3 w-3 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Recording...
        </div>
      )}
    </div>
  );
};

export default SpeechToText;
