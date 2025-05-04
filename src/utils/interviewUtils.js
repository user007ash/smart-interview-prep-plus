
/**
 * Questions data for interview tests
 */
export const getInterviewQuestions = () => [
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

/**
 * Generate simulated feedback based on answer length and content
 */
export const generateResults = (answers, questions) => {
  // Mock results format template
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

/**
 * Calculate the overall score from interview results
 */
export const calculateOverallScore = (results) => {
  if (!results || results.length === 0) return 0;
  const totalScore = results.reduce((acc, result) => acc + result.score, 0);
  return Math.round(totalScore / results.length);
};
