
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const SpeechToText = ({ onTranscriptUpdate, currentQuestion }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [visualFeedback, setVisualFeedback] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const mediaStreamRef = useRef(null);
  const feedbackInterval = useRef(null);
  const audioChunks = useRef([]);

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
      stopMediaStream();
    };
  }, [onTranscriptUpdate, isRecording]);

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
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to access microphone. Please check your permissions.');
      return false;
    }
  };

  // Stop audio recording
  const stopRecording = () => {
    if (recorder && recorder.state === 'recording') {
      recorder.stop();
    }
    stopMediaStream();
  };

  // Toggle recording state
  const toggleRecording = async () => {
    if (!isSupported) {
      toast.error('Speech recognition is not supported by your browser.');
      return;
    }

    if (isRecording) {
      // Stop recording
      recognition.stop();
      stopRecording();
      setIsRecording(false);
      clearInterval(feedbackInterval.current);
      toast.info('Recording stopped.');
    } else {
      // Start recording
      setTranscript('');
      onTranscriptUpdate('');
      setVisualFeedback([]);
      setAudioBlob(null);
      
      const recordingStarted = await startRecording();
      if (!recordingStarted) return;
      
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
        stopRecording();
      }
    }
  };

  // Upload audio recording to Supabase
  const uploadRecording = async () => {
    if (!audioBlob || !currentQuestion) {
      toast.error('No recording to upload or question is missing.');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('question', currentQuestion);
      formData.append('transcript', transcript);

      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No session found. Please log in.');
      }

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

  return (
    <div className="flex flex-col items-center w-full">
      <Button
        onClick={toggleRecording}
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
          onClick={uploadRecording}
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

      {audioBlob && !isRecording && (
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
      )}
    </div>
  );
};

export default SpeechToText;
