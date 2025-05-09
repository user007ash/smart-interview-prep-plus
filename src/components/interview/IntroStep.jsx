
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const IntroStep = ({ onStartPreview, onSetLanguage = () => {} }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  
  const handleLanguageChange = (value) => {
    setSelectedLanguage(value);
    onSetLanguage(value);
  };
  
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h1 className="text-3xl font-bold mb-4">AI Interview Simulator</h1>
      
      <p className="text-lg text-gray-700 mb-6">
        Practice your interviewing skills with our AI-powered interview simulator. 
        You'll be asked a series of questions and your answers will be recorded and analyzed.
      </p>
      
      <div className="bg-interview-softBg p-5 rounded-lg mb-8">
        <h2 className="font-bold text-lg mb-3">How it works:</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Preview the interview questions first</li>
          <li>Answer each question by speaking into your microphone</li>
          <li>You'll have 60 seconds to answer each question</li>
          <li>Get personalized feedback on your responses</li>
        </ol>
      </div>
      
      <div className="mb-8">
        <h2 className="font-bold text-lg mb-3">Customize your interview:</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Programming Language (Optional)</label>
            <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a language (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any / General</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              {selectedLanguage ? `Your interview will include ${selectedLanguage}-specific technical questions` : "Select a language to include language-specific technical questions"}
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          className="bg-interview-purple hover:bg-interview-darkPurple px-8 py-2"
          onClick={onStartPreview}
        >
          Start Interview
        </Button>
      </div>
    </div>
  );
};

export default IntroStep;
