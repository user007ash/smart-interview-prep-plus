
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Custom hook to handle live interview functionality
 * @param {Array} questions - Array of interview questions
 * @returns {Object} Live interview state and methods
 */
const useLiveInterview = (questions) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(false);
  const [activeCamera, setActiveCamera] = useState(true);
  const [activeMic, setActiveMic] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [interviewEnded, setInterviewEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const videoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  
  // Check for camera and microphone permissions
  const checkPermissions = async () => {
    setIsCheckingPermissions(true);
    
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setIsPermissionGranted(true);
      return true;
    } catch (error) {
      console.error('Permission error:', error);
      
      // Provide more specific error messages
      if (error.name === 'NotAllowedError') {
        toast.error('Camera and microphone access denied. Please check your browser settings.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No camera or microphone found. Please check your devices.');
      } else if (error.name === 'NotReadableError') {
        toast.error('Your camera or microphone is already in use by another application.');
      } else {
        toast.error('Failed to access camera and microphone. Please check your device settings.');
      }
      
      setIsPermissionGranted(false);
      return false;
    } finally {
      setIsCheckingPermissions(false);
    }
  };
  
  // Start interview
  const startInterview = async () => {
    try {
      if (!isPermissionGranted) {
        const permissionGranted = await checkPermissions();
        if (!permissionGranted) return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      mediaStreamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      // Start speech recognition if supported
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          
          setTranscript(finalTranscript || interimTranscript);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          toast.error(`Speech recognition error: ${event.error}`);
        };
        
        recognitionRef.current.start();
      } else {
        toast.error('Speech recognition is not supported in your browser');
      }
      
      setCurrentQuestion(questions[0]);
      setIsStarted(true);
    } catch (error) {
      console.error('Start interview error:', error);
      toast.error('Error starting interview. Please try again.');
    }
  };
  
  // Stop interview
  const stopInterview = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping recognition:', e);
      }
    }
    
    setInterviewEnded(true);
    setIsStarted(false);
  };
  
  // Toggle camera
  const toggleCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !activeCamera;
      });
      setActiveCamera(!activeCamera);
    }
  };
  
  // Toggle microphone
  const toggleMicrophone = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !activeMic;
      });
      setActiveMic(!activeMic);
      
      if (!activeMic) {
        // Restart recognition if mic was turned off
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.error('Error starting recognition:', e);
          }
        }
      } else {
        // Stop recognition if mic is turned off
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error('Error stopping recognition:', e);
          }
        }
      }
    }
  };
  
  // Move to next question
  const nextQuestion = () => {
    // Save current answer
    setAnswers(prev => [
      ...prev,
      {
        question: questions[questionIndex],
        answer: transcript
      }
    ]);
    
    // Clear transcript
    setTranscript('');
    
    // Move to next question or end interview
    if (questionIndex < questions.length - 1) {
      setQuestionIndex(prevIndex => prevIndex + 1);
      setCurrentQuestion(questions[questionIndex + 1]);
    } else {
      stopInterview();
    }
  };
  
  // Reset interview
  const resetInterview = () => {
    setInterviewEnded(false);
    setQuestionIndex(0);
    setTranscript('');
    setAnswers([]);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error('Error stopping recognition:', e);
        }
      }
    };
  }, []);
  
  return {
    isStarted,
    isPermissionGranted,
    isCheckingPermissions,
    activeCamera,
    activeMic,
    currentQuestion,
    transcript,
    interviewEnded,
    questionIndex,
    answers,
    videoRef,
    checkPermissions,
    startInterview,
    stopInterview,
    toggleCamera,
    toggleMicrophone,
    nextQuestion,
    resetInterview
  };
};

export default useLiveInterview;
