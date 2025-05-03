
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ResumeUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };
  
  const handleFile = (file) => {
    // Check if file is PDF
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      toast.error('Please upload a PDF file');
    }
  };
  
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Simulate file upload API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Resume uploaded successfully');
      setIsUploading(false);
      setIsAnalyzing(true);
      
      // Simulate resume analysis API call
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Mock analysis response
      const mockAnalysis = {
        atsScore: 75,
        keywords: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Full Stack', 'API Development'],
        missingKeywords: ['TypeScript', 'AWS', 'Docker', 'CI/CD'],
        summary: 'Your resume shows strong experience in full-stack development with JavaScript technologies. Consider highlighting more specific achievements and metrics.',
        interviewQuestions: [
          'Describe a challenging project where you used React and how you solved the main problems.',
          'How do you approach optimizing database queries in MongoDB?',
          'Can you explain your experience with RESTful API design and implementation?',
          'Tell me about a time when you had to refactor code to improve performance.',
          'How do you stay updated with the latest JavaScript ecosystem developments?',
          'Describe your experience working with version control systems like Git.',
          'How would you handle authentication and authorization in a Node.js application?',
          'What strategies do you use to ensure your code is maintainable and scalable?',
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading resume');
      setIsUploading(false);
      setIsAnalyzing(false);
    }
  };
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Resume Upload & Analysis</h1>
            <p className="text-gray-600">
              Upload your resume to get ATS scoring, feedback, and personalized interview questions.
            </p>
          </div>
          
          {!analysis ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  isDragging 
                    ? 'border-interview-purple bg-interview-softBg' 
                    : 'border-gray-300 hover:border-interview-purple hover:bg-gray-50'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                {selectedFile ? (
                  <div>
                    <p className="text-lg font-medium mb-2">Selected File:</p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>{selectedFile.name}</span>
                      <button 
                        onClick={() => setSelectedFile(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                    <Button 
                      className="bg-interview-purple hover:bg-interview-darkPurple"
                      disabled={isUploading}
                      onClick={handleUpload}
                    >
                      {isUploading ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </div>
                      ) : 'Analyze Resume'}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-medium mb-2">Drag and drop your resume here</p>
                    <p className="text-gray-500 mb-4">or</p>
                    <label className="cursor-pointer bg-interview-purple hover:bg-interview-darkPurple text-white font-medium py-2 px-4 rounded-md transition-colors">
                      Browse Files
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf" 
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-4">
                      Supported format: PDF (Max size: 5MB)
                    </p>
                  </div>
                )}
              </div>
              
              {isAnalyzing && (
                <div className="mt-8 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-interview-softBg text-interview-purple rounded-full">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing your resume...
                  </div>
                  <div className="mt-8 max-w-md mx-auto text-left">
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Parsing Resume</span>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-interview-purple h-2 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Extracting Skills</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-interview-purple h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Analyzing ATS Score</span>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-interview-purple h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Generating Questions</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-interview-purple h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-semibold mb-1">Resume Analysis</h2>
                      <p className="text-gray-600">Based on your uploaded resume: {selectedFile?.name}</p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Button variant="outline" onClick={() => setAnalysis(null)} className="border-interview-purple text-interview-purple hover:bg-interview-softBg">
                        Upload Another
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">ATS Score</h3>
                      <span className="text-lg font-bold">{analysis.atsScore}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${
                          analysis.atsScore >= 80 ? 'bg-green-500' : 
                          analysis.atsScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${analysis.atsScore}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-sm text-gray-500">Needs Improvement</span>
                      <span className="text-sm text-gray-500">Excellent</span>
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-4">Keywords Found</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.keywords.map((keyword, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-4">Keywords Missing</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.missingKeywords.map((keyword, index) => (
                        <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <h3 className="font-semibold text-lg mb-4">Summary</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
                      {analysis.summary}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Generated Interview Questions</h3>
                      <span className="bg-interview-softBg text-interview-purple px-2 py-1 rounded text-sm">
                        {analysis.interviewQuestions.length} Questions
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      {analysis.interviewQuestions.map((question, index) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h4 className="font-medium mb-1">Question {index + 1}</h4>
                          <p className="text-gray-700">{question}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 flex justify-center">
                      <Link to="/interview-test">
                        <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                          Start Practice Interview
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
                  <h3 className="font-semibold text-lg mb-4">Resume Tips</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-interview-purple">Quantify Achievements</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Include specific metrics and results to demonstrate impact (e.g., "Increased sales by 20%").
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-interview-purple">Use Action Verbs</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Start bullet points with strong action verbs like "Developed," "Implemented," or "Led."
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-interview-purple">Focus on Relevant Skills</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Tailor your resume to highlight skills and experiences most relevant to the job.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-interview-purple">Keep it Concise</h4>
                      <p className="text-gray-600 text-sm mt-1">
                        Aim for a 1-2 page resume with clear, concise descriptions of your experience.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-4">Next Steps</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-interview-purple text-white flex items-center justify-center text-sm">
                          1
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Update Your Resume</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Apply our recommendations to improve your ATS score.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-interview-purple text-white flex items-center justify-center text-sm">
                          2
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Practice Interview Questions</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Take a practice interview with our AI-generated questions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-interview-purple text-white flex items-center justify-center text-sm">
                          3
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Try Live Interview</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Test your skills with our webcam-based interview simulation.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 rounded-full bg-interview-purple text-white flex items-center justify-center text-sm">
                          4
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium">Review Performance</h4>
                        <p className="text-gray-600 text-sm mt-1">
                          Analyze your interview performance and improve weak areas.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link to="/interview-test">
                      <Button className="w-full bg-interview-purple hover:bg-interview-darkPurple">
                        Start Practice Interview
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ResumeUpload;
