
import React from 'react';
import IntroStep from './IntroStep';
import PreviewStep from './PreviewStep';
import QuestionStep from './QuestionStep';
import SubmittingStep from './SubmittingStep';
import ResultsStep from './ResultsStep';
import { generateResults } from '@/utils/interviewUtils';

const StepManager = ({ 
  step, 
  questions, 
  onStartPreview, 
  onStartTest, 
  currentQuestionIndex, 
  timeLeft, 
  onNextQuestion, 
  isSubmitting, 
  currentAnswer,
  onTranscriptUpdate,
  answers
}) => {
  switch (step) {
    case 'intro':
      return <IntroStep onStartPreview={onStartPreview} />;
      
    case 'preview':
      return <PreviewStep questions={questions} onStartTest={onStartTest} />;
      
    case 'question':
      return (
        <QuestionStep 
          currentQuestionIndex={currentQuestionIndex}
          questions={questions}
          timeLeft={timeLeft}
          onNextQuestion={onNextQuestion}
          isSubmitting={isSubmitting}
          currentAnswer={currentAnswer}
          onTranscriptUpdate={onTranscriptUpdate}
        />
      );
      
    case 'submitting':
      return <SubmittingStep />;
      
    case 'results':
      const results = generateResults(answers, questions);
      return <ResultsStep results={results} />;
      
    default:
      return null;
  }
};

export default StepManager;
