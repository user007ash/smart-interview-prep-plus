// Function to get interview questions
export const getInterviewQuestions = () => {
  return [
    {
      id: 'q1',
      text: 'Tell me about a time when you had to work under pressure to meet a deadline.',
      type: 'Behavioral'
    },
    {
      id: 'q2',
      text: 'How do you handle conflicts within a team?',
      type: 'Behavioral'
    },
    {
      id: 'q3',
      text: 'Describe a situation where you had to learn a new technology quickly.',
      type: 'Technical'
    },
    {
      id: 'q4',
      text: 'What is your approach to debugging complex issues?',
      type: 'Technical'
    },
    {
      id: 'q5',
      text: 'How do you prioritize tasks when you have multiple deadlines?',
      type: 'Behavioral'
    }
  ];
};

// Calculate overall score from individual question scores
export const calculateOverallScore = (results) => {
  if (!results || results.length === 0) return 0;
  
  const sum = results.reduce((total, result) => total + result.score, 0);
  return Math.round(sum / results.length);
};

// Generate results from answers and questions
export const generateResults = (answers, questions) => {
  return Object.keys(answers).map(questionId => {
    const question = questions.find(q => q.id === questionId);
    // Generate score and feedback based on answer
    const score = Math.floor(Math.random() * 30) + 70; // Placeholder scoring logic
    return {
      question: question.text,
      answer: answers[questionId],
      score,
      feedback: `Your answer was ${score >= 80 ? 'strong' : 'good'}. ${score >= 80 ? 'Well articulated!' : 'Could use more specific examples.'}`,
      idealAnswer: `An ideal answer would include specific examples and demonstrate your experience with ${question.type.toLowerCase()} situations.`
    };
  });
};
