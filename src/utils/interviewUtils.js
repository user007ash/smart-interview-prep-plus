
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

// ATS Score Calculation based on transcript content
export const calculateATSScore = (transcript, jobKeywords = []) => {
  // Default job keywords if none provided
  const defaultJobKeywords = [
    "team", "project", "develop", "solution", "experience", 
    "technical", "collaborate", "implement", "result", "success"
  ];
  
  // Use provided keywords or defaults
  const keywords = jobKeywords.length > 0 ? jobKeywords : defaultJobKeywords;
  
  // If no transcript, return a default score
  if (!transcript || transcript.trim() === '') {
    return 65;
  }
  
  const words = transcript.toLowerCase().split(/\s+/);
  const actionVerbs = [
    "led", "managed", "developed", "built", "designed", "launched", 
    "created", "implemented", "achieved", "improved", "reduced", 
    "increased", "coordinated", "delivered", "established", "generated"
  ];
  
  const fillerWords = [
    "um", "uh", "like", "you know", "basically", "actually", 
    "literally", "sort of", "kind of", "i mean", "so", "right"
  ];
  
  // Initial score
  let score = 100;
  
  // Calculate matches
  let keywordMatchCount = keywords.filter(k => 
    transcript.toLowerCase().includes(k.toLowerCase())
  ).length;
  
  let actionVerbCount = actionVerbs.filter(v => 
    transcript.toLowerCase().includes(v)
  ).length;
  
  let fillerCount = fillerWords.reduce((count, filler) => {
    // Count occurrences of each filler word or phrase
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = transcript.match(regex);
    return count + (matches ? matches.length : 0);
  }, 0);
  
  // Adjust score based on factors
  
  // 1. Answer length
  if (words.length < 20) {
    score -= 15; // Significant penalty for very short answers
  } else if (words.length < 50) {
    score -= 5; // Small penalty for somewhat short answers
  }
  
  // 2. Filler words
  if (fillerCount > 0) {
    // Calculate filler word density (percentage of total words)
    const fillerDensity = fillerCount / words.length;
    // Penalty increases with density
    score -= Math.min(25, Math.round(fillerDensity * 100)); 
  }
  
  // 3. Action verbs
  const expectedActionVerbs = Math.max(1, Math.floor(words.length / 75)); // Expect more action verbs in longer answers
  if (actionVerbCount < expectedActionVerbs) {
    score -= Math.min(15, (expectedActionVerbs - actionVerbCount) * 5);
  } else {
    // Bonus for good use of action verbs
    score += Math.min(5, actionVerbCount - expectedActionVerbs);
  }
  
  // 4. Keywords
  const expectedKeywordMatches = Math.max(1, Math.ceil(keywords.length * 0.3)); // Expect at least 30% of keywords
  if (keywordMatchCount < expectedKeywordMatches) {
    score -= Math.min(20, (expectedKeywordMatches - keywordMatchCount) * 3);
  } else {
    // Bonus for good keyword usage
    score += Math.min(5, keywordMatchCount - expectedKeywordMatches);
  }
  
  // Ensure score stays within bounds
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Generate ATS feedback based on score
export const getATSFeedback = (score, transcript) => {
  const words = transcript ? transcript.toLowerCase().split(/\s+/) : [];
  const wordCount = words.length;
  
  if (!transcript || transcript.trim() === '') {
    return "No answer provided. Please provide a complete response to receive ATS feedback.";
  }
  
  let feedback = "";
  
  // Core feedback based on score
  if (score >= 85) {
    feedback = "Excellent! Your response is highly ATS-compatible with strong use of relevant keywords and action verbs.";
  } else if (score >= 70) {
    feedback = "Good job! Your answer includes relevant keywords, but could benefit from more specific action verbs.";
  } else if (score >= 50) {
    feedback = "Fair. Try to include more job-related terms and focus on concrete achievements and skills.";
  } else {
    feedback = "Needs improvement. Your answer may have too many filler words or lack relevance to the question.";
  }
  
  // Additional specific feedback
  if (wordCount < 30) {
    feedback += " Your answer is quite brief. Providing more detail would improve your ATS score.";
  }
  
  if (wordCount > 300) {
    feedback += " Your answer is comprehensive, but consider being more concise while maintaining key details.";
  }
  
  return feedback;
};

// Helper function to generate a score based on answer content
const generateSmartScore = (answer) => {
  if (!answer || answer.trim() === '') return 65;
  
  const wordCount = answer.split(' ').length;
  let baseScore = 0;
  
  // Base score on length (longer answers tend to be more detailed)
  if (wordCount < 10) baseScore = 65;
  else if (wordCount < 30) baseScore = 72;
  else if (wordCount < 50) baseScore = 78;
  else if (wordCount < 100) baseScore = 84;
  else baseScore = 89;
  
  // Add some randomness (±5%)
  const randomFactor = Math.floor(Math.random() * 11) - 5;
  
  // Calculate final score
  let finalScore = baseScore + randomFactor;
  
  // Ensure score is within bounds
  if (finalScore < 60) finalScore = 60;
  if (finalScore > 95) finalScore = 95;
  
  return finalScore;
};

// Generate personalized feedback based on score and content
const generateSmartFeedback = (answer, score, questionType) => {
  if (!answer || answer.trim() === '') {
    return 'No answer provided. Please provide a complete response to receive feedback.';
  }
  
  const wordCount = answer.split(' ').length;
  let feedback = '';
  
  // Score level feedback
  if (score >= 90) {
    feedback = 'Outstanding answer! Your response is well-structured, detailed, and demonstrates exceptional experience. ';
  } else if (score >= 80) {
    feedback = 'Strong answer. You provided good examples and insight. ';
  } else if (score >= 70) {
    feedback = 'Good answer with some solid points. ';
  } else {
    feedback = 'Your answer provides a basic response, but could use more development. ';
  }
  
  // Content specific feedback
  if (wordCount < 20) {
    feedback += 'Your response could benefit from more detail and examples. ';
  }
  
  // Question type specific additions
  if (questionType === 'Behavioral') {
    feedback += score > 80 
      ? 'You effectively demonstrated your interpersonal skills and approach to workplace situations. '
      : 'Try using the STAR method (Situation, Task, Action, Result) to structure your behavioral answers more effectively. ';
  } else if (questionType === 'Technical') {
    feedback += score > 80 
      ? 'You showed strong technical knowledge and problem-solving approach. '
      : 'Consider explaining your technical process more thoroughly and highlighting specific tools or methods you\'ve used. ';
  }
  
  // Add tips for improvement
  if (score < 85) {
    feedback += 'To improve, consider adding more concrete examples from your experience.';
  }
  
  return feedback;
};

// Generate ideal answer template
const generateIdealAnswer = (question) => {
  const isBehavioral = question.toLowerCase().includes('time') || 
                       question.toLowerCase().includes('handle') || 
                       question.toLowerCase().includes('situation');
  
  if (isBehavioral) {
    return 'An ideal answer would use the STAR method (Situation, Task, Action, Result). Start by briefly describing a specific situation, explain the task or challenge, detail your actions with focus on your individual contribution, and share measurable results. Include what you learned from the experience.';
  } else {
    return 'An ideal answer would demonstrate your technical knowledge while highlighting your problem-solving approach. Include specific examples from your experience, mention relevant technologies or methodologies, and emphasize outcomes. Show both your technical expertise and your ability to communicate complex concepts clearly.';
  }
};

// Generate results from answers and questions with improved scoring and feedback
export const generateResults = (answers, questions) => {
  return Object.keys(answers).map(questionId => {
    const question = questions.find(q => q.id === questionId);
    const answer = answers[questionId];
    
    // Generate interview score based on answer content
    const interviewScore = generateSmartScore(answer);
    
    // Generate ATS score based on answer content
    const atsScore = calculateATSScore(answer);
    
    // Generate personalized feedback
    const feedback = generateSmartFeedback(answer, interviewScore, question.type);
    
    // Generate ATS feedback
    const atsFeedback = getATSFeedback(atsScore, answer);
    
    // Generate ideal answer template
    const idealAnswer = generateIdealAnswer(question.text);
    
    return {
      question: question.text,
      answer,
      score: interviewScore,
      ats_score: atsScore,
      feedback,
      ats_feedback: atsFeedback,
      idealAnswer,
      type: question.type
    };
  });
};
