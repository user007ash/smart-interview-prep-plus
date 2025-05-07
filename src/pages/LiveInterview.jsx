import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import useLiveInterview from '../hooks/useLiveInterview';
import LiveInterviewControls from '../components/interview/LiveInterviewControls';

const LiveInterview = () => {
  // Mock questions - we'll keep these as-is for now
  const questions = [
    "Tell me about yourself and your experience with web development.",
    "What is your greatest strength as a developer?",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "How do you stay updated with the latest technologies in your field?",
    "Where do you see yourself professionally in 5 years?"
  ];
  
  // Use the custom hook for managing interview state and functions
  const {
    isStarted,
    isPermissionGranted,
    isCheckingPermissions,
    activeCamera,
    activeMic,
    currentQuestion,
    transcript,
    interviewEnded,
    questionIndex,
    videoRef,
    checkPermissions,
    startInterview,
    stopInterview,
    toggleCamera,
    toggleMicrophone,
    nextQuestion,
    resetInterview
  } = useLiveInterview(questions);
  
  const renderContent = () => {
    if (interviewEnded) {
      return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Interview Completed!</h1>
            <p className="text-gray-600">
              Your interview has been recorded and is being analyzed by our AI. You'll receive feedback shortly.
            </p>
          </div>
          
          <div className="bg-interview-softBg p-6 rounded-lg mb-8">
            <h2 className="font-semibold text-lg mb-4">What Happens Next</h2>
            <ol className="space-y-4 text-gray-700">
              <li className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-interview-purple rounded-full text-white font-medium">1</div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">AI Analysis</h3>
                  <p className="text-sm">Our AI will evaluate your answers, body language, and speech patterns.</p>
                </div>
              </li>
              
              <li className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-interview-purple rounded-full text-white font-medium">2</div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Detailed Report</h3>
                  <p className="text-sm">You'll receive a comprehensive report with scores and feedback for each question.</p>
                </div>
              </li>
              
              <li className="flex">
                <div className="mr-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-interview-purple rounded-full text-white font-medium">3</div>
                </div>
                <div>
                  <h3 className="font-medium mb-1">Improvement Suggestions</h3>
                  <p className="text-sm">Get personalized recommendations to enhance your interview skills.</p>
                </div>
              </li>
            </ol>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              className="border-interview-purple text-interview-purple hover:bg-interview-softBg"
              onClick={resetInterview}
            >
              Start New Interview
            </Button>
            <Button className="bg-interview-purple hover:bg-interview-darkPurple">
              View Dashboard
            </Button>
          </div>
        </div>
      );
    }
    
    if (!isStarted) {
      return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold mb-6">Live Interview Simulation</h1>
          
          <div className="mb-8">
            <p className="text-gray-600 mb-4">
              Practice your interview skills with our AI-powered live interview simulation. 
              This module uses your webcam and microphone to create a realistic interview experience.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1">Important Information</h3>
                  <p className="text-sm text-yellow-800">
                    This feature requires access to your webcam and microphone. You'll be asked for permission before starting.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-interview-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  What We Analyze
                </h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Your verbal responses and answer quality</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Speech patterns, pacing, and clarity</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Basic facial expressions and body language</span>
                  </li>
                  <li className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Confidence level and professionalism</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold flex items-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-interview-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How It Works
                </h3>
                <ol className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-interview-purple rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">1</div>
                    <span>Grant permission to access your camera and microphone</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-interview-purple rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">2</div>
                    <span>Our AI interviewer will ask you a series of questions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-interview-purple rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">3</div>
                    <span>Answer each question as naturally as you would in a real interview</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-5 h-5 bg-interview-purple rounded-full text-white flex items-center justify-center text-xs mr-2 flex-shrink-0 mt-0.5">4</div>
                    <span>Receive comprehensive feedback and analysis afterward</span>
                  </li>
                </ol>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button 
                className="bg-interview-purple hover:bg-interview-darkPurple px-8 py-2"
                onClick={startInterview}
                disabled={isCheckingPermissions}
              >
                {isCheckingPermissions ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Checking Permissions...
                  </span>
                ) : (
                  'Start Interview'
                )}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center mb-4">
              <video 
                ref={videoRef} 
                className={`w-full h-auto ${!activeCamera ? 'hidden' : ''}`} 
                autoPlay 
                muted 
                playsInline
              ></video>
              
              {!activeCamera && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p>Camera is turned off</p>
                </div>
              )}
              
              {/* Use our new LiveInterviewControls component */}
              <LiveInterviewControls
                activeCamera={activeCamera}
                activeMic={activeMic}
                toggleCamera={toggleCamera}
                toggleMicrophone={toggleMicrophone}
              />
            </div>
            
            {/* Current question */}
            <div className="p-4 mb-6 bg-interview-softBg rounded-lg">
              <h2 className="font-semibold text-lg mb-2">Current Question ({questionIndex + 1}/{questions.length})</h2>
              <p className="text-gray-700">{currentQuestion}</p>
            </div>
            
            {/* Detected speech */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Your Answer</h3>
              <div className="p-3 min-h-28 border border-gray-200 rounded-lg">
                {transcript ? (
                  <p className="text-gray-700">{transcript}</p>
                ) : (
                  <p className="text-gray-400 italic">Start speaking to see your response here...</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="border-red-500 text-red-500 hover:bg-red-50"
                onClick={stopInterview}
              >
                End Interview
              </Button>
              
              <Button 
                className="bg-interview-purple hover:bg-interview-darkPurple"
                onClick={nextQuestion}
              >
                {questionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
            <h2 className="font-semibold text-lg mb-4">Interview Tips</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-interview-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Maintain Eye Contact
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Look directly at the camera to simulate eye contact with the interviewer.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-interview-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Control Your Expressions
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Smile naturally and show engagement through nodding and appropriate facial expressions.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-interview-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Speak Clearly
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Maintain a moderate pace and enunciate clearly. Avoid fillers like "um" and "uh."
                </p>
              </div>
              
              <div>
                <h3 className="font-medium flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-interview-purple mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Structured Answers
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Use the STAR method: Situation, Task, Action, Result for behavioral questions.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="font-semibold text-lg mb-4">Interview Progress</h2>
            
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm font-medium">{Math.round(((questionIndex + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-interview-purple h-2.5 rounded-full" 
                  style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              {questions.map((question, index) => (
                <div 
                  key={index}
                  className={`p-2 rounded ${
                    index === questionIndex 
                      ? 'bg-interview-softBg border-l-4 border-interview-purple' 
                      : index < questionIndex 
                        ? 'bg-gray-50 text-gray-500'
                        : 'bg-white text-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <span className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 text-xs ${
                      index === questionIndex 
                        ? 'bg-interview-purple text-white' 
                        : index < questionIndex 
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      {index < questionIndex ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </span>
                    <span className="text-sm truncate">
                      {question.substring(0, 30)}...
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default LiveInterview;
