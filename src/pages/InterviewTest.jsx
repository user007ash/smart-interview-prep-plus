import React, { useState, useEffect, useRef } from 'react';
import { Link, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import SpeechToText from '../components/SpeechToText';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const InterviewTest = () => {
  const [step, setStep] = useState('intro'); // intro, preview, question, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated, loading } = useAuth();
  const timerRef = useRef(null);
  
  // Mock interview questions
  const questions = [
    {
      id: 1,
      text: "Describe a challenging project where you used React and how you solved the main problems.",
      type: "Technical",
    },
    {
      id: 2,
      text: "How do you approach optimizing database queries in MongoDB?",
      type: "Technical",
    },
    {
      id: 3,
      text: "Can you explain your experience with RESTful API design and implementation?",
      type: "Technical",
    },
    {
      id: 4,
      text: "Tell me about a time when you had to refactor code to improve performance.",
      type: "Behavioral",
    },
    {
      id: 5,
      text: "How do you stay updated with the latest JavaScript ecosystem developments?",
      type: "General",
    },
  ];
  
  // Mock results format (real results will be generated based on actual answers)
  const mockResultTemplate = [
    {
      question: "Describe a challenging project where you used React and how you solved the main problems.",
      answer: "",
      score: 0,
      feedback: "",
      idealAnswer: "A strong answer would include a specific project example, clear identification of challenges faced, detailed technical solutions implemented, metrics of success, and lessons learned."
    },
    {
      question: "How do you approach optimizing database queries in MongoDB?",
      answer: "",
      score: 0,
      feedback: "",
      idealAnswer: "An ideal answer would include indexing strategies, query structure optimization, data model considerations, use of MongoDB's performance analysis tools, caching strategies, and examples of how these techniques were applied."
    },
    {
      question: "Can you explain your experience with RESTful API design and implementation?",
      answer: "",
      score: 0,
      feedback: "",
      idealAnswer: "A comprehensive answer would cover REST architectural principles, resource modeling, endpoint design, HTTP methods usage, status codes, authentication methods, versioning strategies, documentation approaches, and real-world implementation examples."
    },
    {
      question: "Tell me about a time when you had to refactor code to improve performance.",
      answer: "",
      score: 0,
      feedback: "",
      idealAnswer: "A strong answer would identify a specific performance issue, describe the analysis process, detail the refactoring approach, mention specific techniques used, provide metrics of improvement, and share lessons learned."
    },
    {
      question: "How do you stay updated with the latest JavaScript ecosystem developments?",
      answer: "",
      score: 0,
      feedback: "",
      idealAnswer: "An ideal answer would include specific information sources (blogs, newsletters, social media), community involvement (meetups, conferences), hands-on learning methods (side projects, courses), and a process for evaluating and adopting new technologies."
    }
  ];
  
  // Check if user is authenticated
  if (!loading && !isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Start timer when question begins
  useEffect(() => {
    if (step === 'question') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleNextQuestion();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, currentQuestionIndex]);
  
  const handleStartPreview = () => {
    setStep('preview');
  };
  
  const handleStartTest = () => {
    setStep('question');
    setTimeLeft(60);
  };
  
  const handleNextQuestion = () => {
    try {
      // Save current answer
      if (currentAnswer.trim()) {
        setAnswers(prev => ({
          ...prev,
          [questions[currentQuestionIndex].id]: currentAnswer
        }));
      }
      
      // Clear current answer
      setCurrentAnswer('');
      
      // Move to next question or results
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setTimeLeft(60);
      } else {
        setStep('submitting');
        handleSubmitTest();
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
      toast.error('An error occurred. Please try again.');
    }
  };
  
  // Generate simulated feedback and scores based on answer length and content
  const generateResults = (answers) => {
    return mockResultTemplate.map((template, index) => {
      const questionId = questions[index].id;
      const answer = answers[questionId] || '';
      
      // Simple scoring algorithm based on answer length and keyword presence
      let score = Math.min(Math.floor(answer.length / 10), 60);
      
      // Add points for relevant keywords
      const keywords = ['example', 'specific', 'implemented', 'improved', 'learned', 'strategy', 'approach'];
      keywords.forEach(keyword => {
        if (answer.toLowerCase().includes(keyword)) score += 5;
      });
      
      // Cap at 95 to leave room for improvement
      score = Math.min(score, 95);
      
      // Generate feedback based on score
      let feedback = '';
      if (score >= 80) {
        feedback = 'Excellent answer with good structure and specific examples.';
      } else if (score >= 70) {
        feedback = 'Good answer, but could include more specific examples and details.';
      } else {
        feedback = 'Your answer needs more depth and specific examples to fully address the question.';
      }
      
      return {
        question: template.question,
        answer,
        score,
        feedback,
        idealAnswer: template.idealAnswer
      };
    });
  };
  
  const handleSubmitTest = async () => {
    setIsSubmitting(true);
    
    try {
      // Generate results based on answers
      const results = generateResults(answers);
      
      if (user) {
        try {
          // Save to Supabase
          const { error } = await supabase.from('test_results').insert({
            user_id: user.id,
            ats_score: calculateOverallScore(results),
            total_score: calculateOverallScore(results),
            feedback: JSON.stringify(results),
          });
          
          if (error) {
            console.error('Supabase save error:', error);
            toast.error('Error saving results to database. Your results will be available temporarily.');
            // Save to localStorage as backup
            localStorage.setItem('last_interview_results', JSON.stringify({
              timestamp: new Date().toISOString(),
              results
            }));
          } else {
            toast.success('Test results saved successfully!');
          }
        } catch (dbError) {
          console.error('Database error:', dbError);
          toast.error('Error connecting to database. Results saved locally.');
          // Save to localStorage as backup
          localStorage.setItem('last_interview_results', JSON.stringify({
            timestamp: new Date().toISOString(),
            results
          }));
        }
      }
      
      // Simulate API processing time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStep('results');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error('Error submitting your answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const calculateOverallScore = (results) => {
    if (!results || results.length === 0) return 0;
    const totalScore = results.reduce((acc, result) => acc + result.score, 0);
    return Math.round(totalScore / results.length);
  };

  // Handle speech-to-text transcript update
  const handleTranscriptUpdate = (transcript) => {
    setCurrentAnswer(transcript);
  };
  
  const renderContent = () => {
    switch (step) {
      case 'intro':
        return (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-3xl font-bold mb-6">Practice Interview Test</h1>
            
            <div className="space-y-6">
              <div className="bg-interview-softBg p-4 rounded-lg">
                <h2 className="font-semibold text-lg mb-2">How it works</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>You'll answer {questions.length} interview questions based on your resume</li>
                  <li>You have 1 minute to answer each question <strong>using your voice</strong></li>
                  <li>Your voice will be automatically transcribed into text</li>
                  <li>After completing all questions, you'll receive feedback and scores</li>
                </ul>
              </div>
              
              <div>
                <h2 className="font-semibold text-lg mb-3">Interview Format</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="text-interview-purple mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Timed Responses</h3>
                    <p className="text-sm text-gray-600">60 seconds per question to simulate interview pressure</p>
                  </div>
                  
                  <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="text-interview-purple mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">Mixed Questions</h3>
                    <p className="text-sm text-gray-600">Technical, behavioral, and general questions</p>
                  </div>
                  
                  <div className="bg-white p-4 border border-gray-200 rounded-lg">
                    <div className="text-interview-purple mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="font-medium mb-1">AI Evaluation</h3>
                    <p className="text-sm text-gray-600">Detailed feedback and scoring on your responses</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <h2 className="font-semibold text-yellow-800 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Microphone Required
                </h2>
                <p className="text-yellow-800 text-sm mb-2">
                  This interview test uses speech recognition. Please ensure your browser has microphone permissions enabled.
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 text-sm">
                  <li>Speak clearly and at a normal pace</li>
                  <li>Use the STAR method for behavioral questions</li>
                  <li>Provide specific examples where possible</li>
                  <li>Focus on your unique skills and experiences</li>
                </ul>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button 
                  className="bg-interview-purple hover:bg-interview-darkPurple px-8 py-2"
                  onClick={handleStartPreview}
                >
                  Start Interview
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'preview':
        return (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h1 className="text-2xl font-bold mb-6">Interview Questions Overview</h1>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You'll be answering the following {questions.length} questions. You'll have 60 seconds to answer each question.
              </p>
              
              <div className="space-y-3 mb-8">
                {questions.map((question, index) => (
                  <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex justify-between">
                      <span className="font-medium">Question {index + 1}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        question.type === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                        question.type === 'Behavioral' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'
                      }`}>{question.type}</span>
                    </div>
                    <p className="text-gray-700 mt-2">{question.text}</p>
                  </div>
                ))}
              </div>
              
              <div className="bg-interview-softBg p-4 rounded-lg mb-6">
                <h2 className="font-semibold mb-2">Remember</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Answer as if you were speaking in a real interview</li>
                  <li>If you run out of time, your answer will be submitted automatically</li>
                  <li>You cannot go back to previous questions</li>
                </ul>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  className="bg-interview-purple hover:bg-interview-darkPurple px-8 py-2"
                  onClick={handleStartTest}
                >
                  Begin Interview
                </Button>
              </div>
            </div>
          </div>
        );
        
      case 'question':
        return (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <h2 className="text-xl font-bold">{questions[currentQuestionIndex].type} Question</h2>
              </div>
              
              <div className={`flex items-center px-3 py-1 rounded-full ${
                timeLeft > 30 ? 'bg-green-100 text-green-800' : 
                timeLeft > 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{timeLeft}s</span>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="p-4 bg-interview-softBg rounded-lg mb-6">
                <p className="font-medium">{questions[currentQuestionIndex].text}</p>
              </div>
              
              <div className="flex flex-col items-center justify-center py-6">
                <SpeechToText onTranscriptUpdate={handleTranscriptUpdate} />
                
                <div className="w-full max-w-md mt-8">
                  {currentAnswer && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-1">Your Answer (Transcribed)</h3>
                      <div className="p-4 bg-gray-50 rounded-md border border-gray-200 max-h-32 overflow-y-auto">
                        <p className="text-gray-700">{currentAnswer}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                className="bg-interview-purple hover:bg-interview-darkPurple"
                onClick={handleNextQuestion}
              >
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Submit Interview'}
              </Button>
            </div>
          </div>
        );
        
      case 'submitting':
        return (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="py-12">
              <svg className="animate-spin mx-auto h-12 w-12 text-interview-purple" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              
              <h2 className="text-xl font-bold mt-6 mb-2">Analyzing Your Answers</h2>
              <p className="text-gray-600">
                Our AI is evaluating your responses against ideal answers and generating personalized feedback.
              </p>
            </div>
          </div>
        );
        
      case 'results':
        const results = generateResults(answers);
        return (
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold">Interview Results</h1>
                <p className="text-gray-600">Here's how you performed on your practice interview</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex items-center">
                <div className="mr-4">
                  <div className="text-3xl font-bold text-center">{calculateOverallScore(results)}%</div>
                  <div className="text-sm text-gray-500">Overall Score</div>
                </div>
                
                <div className="w-20 h-20">
                  <svg viewBox="0 0 36 36" className="circular-chart">
                    <path 
                      className="circle-bg"
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path 
                      className="circle"
                      strokeDasharray={`${calculateOverallScore(results)}, 100`}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#7E69AB"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="bg-interview-softBg p-4 rounded-lg mb-4">
                <h2 className="font-semibold mb-1">Overall Assessment</h2>
                <p className="text-sm">
                  {calculateOverallScore(results) >= 80 
                    ? "Excellent performance! You demonstrated strong technical knowledge and communication skills. With some minor improvements, you'll be ready to ace your real interviews."
                    : calculateOverallScore(results) >= 70
                      ? "Good performance! You showed solid understanding of most topics. Work on being more specific in your examples and elaborating on technical details."
                      : "You have a good foundation, but need more practice. Focus on providing more specific examples and technical details in your answers."}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-bold text-center">{results.filter(r => r.score >= 80).length}</div>
                  <div className="text-sm text-gray-500 text-center">Strong Answers</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-green-500 h-1.5 rounded-full" 
                      style={{ width: `${(results.filter(r => r.score >= 80).length / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-bold text-center">{results.filter(r => r.score >= 70 && r.score < 80).length}</div>
                  <div className="text-sm text-gray-500 text-center">Good Answers</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-yellow-500 h-1.5 rounded-full" 
                      style={{ width: `${(results.filter(r => r.score >= 70 && r.score < 80).length / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="bg-white p-4 border border-gray-200 rounded-lg">
                  <div className="text-lg font-bold text-center">{results.filter(r => r.score < 70).length}</div>
                  <div className="text-sm text-gray-500 text-center">Needs Improvement</div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-red-500 h-1.5 rounded-full" 
                      style={{ width: `${(results.filter(r => r.score < 70).length / results.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 mb-8">
              <h2 className="text-xl font-semibold">Detailed Question Analysis</h2>
              
              {results.map((result, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <div className="flex items-center">
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          result.score >= 80 ? 'bg-green-100 text-green-800' : 
                          result.score >= 70 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          Score: {result.score}%
                        </div>
                      </div>
                    </div>
                    <p className="mt-2">{result.question}</p>
                  </div>
                  
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Your Answer</h4>
                    <p className="text-gray-700 mb-4">{result.answer}</p>
                    
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Feedback</h4>
                    <p className="text-gray-700 mb-4">{result.feedback}</p>
                    
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800 mb-1">Ideal Answer Structure</h4>
                      <p className="text-blue-800 text-sm">{result.idealAnswer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-interview-softBg p-6 rounded-lg mb-8">
              <h2 className="font-semibold text-lg mb-4">Areas for Improvement</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Be More Specific</h3>
                  <p className="text-gray-600 text-sm">
                    Include more concrete examples and metrics in your answers. Quantify achievements when possible.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Technical Depth</h3>
                  <p className="text-gray-600 text-sm">
                    Demonstrate deeper technical knowledge by explaining not just what you did, but how you did it.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Structure Responses</h3>
                  <p className="text-gray-600 text-sm">
                    Use the STAR method for behavioral questions: Situation, Task, Action, Result.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="font-medium mb-2">Time Management</h3>
                  <p className="text-gray-600 text-sm">
                    Practice giving more concise answers to ensure you cover all key points within the time limit.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/interview-test">
                <Button variant="outline" className="border-interview-purple text-interview-purple hover:bg-interview-softBg">
                  Try Another Practice Test
                </Button>
              </Link>
              
              <Link to="/live-interview">
                <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                  Try Live Interview
                </Button>
              </Link>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-interview-purple"></div>
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
      <Footer />
      
      <style jsx="true">{`
        .circular-chart {
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }
        
        .circle-bg {
          stroke-width: 3;
          fill: none;
        }
        
        .circle {
          stroke-width: 3;
          stroke-linecap: round;
          transition: all 1s ease-out;
          fill: none;
        }
      `}</style>
    </>
  );
};

export default InterviewTest;
