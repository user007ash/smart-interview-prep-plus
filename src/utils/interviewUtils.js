
// Original imports from interviewUtils.js
import { supabase } from '@/integrations/supabase/client';
// Update imports to use the new resume module structure
import { generateResumeBasedQuestions } from '@/utils/resume';

// Define question categories for better organization
const QUESTION_CATEGORIES = {
  BEHAVIORAL: 'Behavioral',
  TECHNICAL: 'Technical',
  SITUATION: 'Situational',
  ROLE_SPECIFIC: {
    SOFTWARE_ENGINEER: 'Software Engineering',
    MARKETING: 'Marketing',
    DATA_SCIENCE: 'Data Science',
    PRODUCT_MANAGER: 'Product Management',
    DESIGN: 'Design',
    SALES: 'Sales',
  }
};

/**
 * Get previously used questions for a user to avoid repetition
 * @param {string} userId - The user's ID
 * @returns {Promise<Array<string>>} Array of previously asked question IDs
 */
export const getPreviouslyUsedQuestions = async (userId) => {
  if (!userId) return [];
  
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('feedback')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error || !data || data.length === 0) return [];
    
    // Extract question IDs from feedback
    const questionIds = data.reduce((ids, result) => {
      try {
        const feedback = JSON.parse(result.feedback || '[]');
        const resultQuestionIds = feedback.map(item => item.question);
        return [...ids, ...resultQuestionIds];
      } catch (e) {
        console.error('Error parsing feedback:', e);
        return ids;
      }
    }, []);
    
    return questionIds;
  } catch (error) {
    console.error('Error retrieving previously used questions:', error);
    return [];
  }
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} The shuffled array
 */
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Generates a set of interview questions based on user profile and preferences.
 * @param {Array<string>} resumeQuestions - Resume-based questions if available
 * @param {string} roleType - Specific role type for targeted questions
 * @param {Array<string>} previouslyUsedQuestions - Questions to avoid repeating
 * @returns {Array<Object>} An array of question objects.
 */
export const getInterviewQuestions = (resumeQuestions, roleType = null, previouslyUsedQuestions = []) => {
  // Start with resume-based questions if available
  let allQuestions = [];
  
  if (resumeQuestions && resumeQuestions.length > 0) {
    allQuestions = resumeQuestions.map((question, index) => ({
      id: `resume-question-${index + 1}`,
      text: question,
      type: 'Resume-Based'
    }));
  }
  
  // Add behavioral questions
  const behavioralQuestions = [
    {
      id: 'behavioral-1',
      text: 'Tell me about yourself.',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-2',
      text: 'Why are you interested in this position?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-3',
      text: 'What are your strengths?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-4',
      text: 'What are your weaknesses?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-5',
      text: 'Where do you see yourself in 5 years?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-6',
      text: 'Why do you want to leave your current job?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-7',
      text: 'Tell me about a time you failed.',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-8',
      text: 'Tell me about a time you succeeded.',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-9',
      text: 'Describe a time when you had to make a difficult decision.',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-10',
      text: 'How do you handle stress and pressure?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-11',
      text: 'Describe a time you demonstrated leadership skills.',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    },
    {
      id: 'behavioral-12',
      text: 'How do you handle conflicts with colleagues?',
      type: QUESTION_CATEGORIES.BEHAVIORAL
    }
  ];
  
  // Add situational questions
  const situationalQuestions = [
    {
      id: 'situational-1',
      text: 'How would you handle a situation where a colleague is not pulling their weight?',
      type: QUESTION_CATEGORIES.SITUATION
    },
    {
      id: 'situational-2',
      text: 'If you noticed a process that could be improved, how would you approach it?',
      type: QUESTION_CATEGORIES.SITUATION
    },
    {
      id: 'situational-3',
      text: 'How would you prioritize multiple urgent tasks with approaching deadlines?',
      type: QUESTION_CATEGORIES.SITUATION
    },
    {
      id: 'situational-4',
      text: 'How would you handle negative feedback from a manager?',
      type: QUESTION_CATEGORIES.SITUATION
    },
    {
      id: 'situational-5',
      text: 'How would you adapt if your team's priorities suddenly changed?',
      type: QUESTION_CATEGORIES.SITUATION
    }
  ];
  
  // Role-specific questions
  const roleSpecificQuestions = {
    // Software engineering questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER]: [
      {
        id: 'tech-1',
        text: 'Explain the concept of closures in JavaScript.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-2',
        text: 'What is the difference between REST and GraphQL?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-3',
        text: 'Describe your approach to testing your code.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-4',
        text: 'How do you stay updated with the latest technologies?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      },
      {
        id: 'tech-5',
        text: 'Explain the concept of microservices architecture.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER
      }
    ],
    
    // Marketing questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING]: [
      {
        id: 'marketing-1',
        text: 'How do you measure the success of a marketing campaign?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING
      },
      {
        id: 'marketing-2',
        text: 'Describe your experience with digital marketing tools.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING
      },
      {
        id: 'marketing-3',
        text: 'How do you adapt your marketing strategy for different audience segments?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING
      }
    ],
    
    // Data Science questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE]: [
      {
        id: 'data-1',
        text: 'Explain the difference between supervised and unsupervised learning.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE
      },
      {
        id: 'data-2',
        text: 'How do you handle missing data in a dataset?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE
      },
      {
        id: 'data-3',
        text: 'Describe a data project where you found unexpected insights.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE
      }
    ],
    
    // Product Management questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER]: [
      {
        id: 'pm-1',
        text: 'How do you prioritize product features?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER
      },
      {
        id: 'pm-2',
        text: 'Describe how you gather user feedback and incorporate it into your product.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER
      },
      {
        id: 'pm-3',
        text: 'How do you measure product success?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER
      }
    ],
    
    // Design questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN]: [
      {
        id: 'design-1',
        text: 'Walk me through your design process from concept to delivery.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN
      },
      {
        id: 'design-2',
        text: 'How do you incorporate user feedback into your designs?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN
      },
      {
        id: 'design-3',
        text: 'Describe a challenging design problem and how you solved it.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN
      }
    ],
    
    // Sales questions
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES]: [
      {
        id: 'sales-1',
        text: 'Describe your sales process from lead to close.',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES
      },
      {
        id: 'sales-2',
        text: 'How do you handle objections during a sales conversation?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES
      },
      {
        id: 'sales-3',
        text: 'What metrics do you use to track your sales performance?',
        type: QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES
      }
    ]
  };
  
  // Combine all questions
  allQuestions = [
    ...allQuestions,
    ...behavioralQuestions,
    ...situationalQuestions
  ];
  
  // Add role-specific questions if a role is specified
  if (roleType && roleSpecificQuestions[roleType]) {
    allQuestions = [...allQuestions, ...roleSpecificQuestions[roleType]];
  } else {
    // If no specific role, add some general technical questions
    Object.values(roleSpecificQuestions).forEach(questions => {
      allQuestions = [...allQuestions, ...questions.slice(0, 2)]; // Take first two from each category
    });
  }
  
  // Filter out previously used questions
  if (previouslyUsedQuestions && previouslyUsedQuestions.length > 0) {
    allQuestions = allQuestions.filter(q => !previouslyUsedQuestions.includes(q.text));
  }
  
  // Shuffle and limit to a reasonable number (10-12 questions per session)
  return shuffleArray(allQuestions).slice(0, 12);
};

/**
 * Calculates the overall score based on the feedback from the AI.
 * @param {Array<Object>} results - An array of result objects, each containing feedback.
 * @returns {number} The calculated overall score.
 */
export const calculateOverallScore = (results) => {
  if (!results || results.length === 0) {
    return 0;
  }
  
  // Sum up the individual scores
  const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0);
  
  // Calculate the average score
  const averageScore = totalScore / results.length;
  
  // Round the average score to the nearest integer
  return Math.round(averageScore);
};

/**
 * Generates results for each question based on the provided answers.
 * @param {Object} answers - An object containing the answers to the questions.
 * @param {Array<Object>} questions - An array of question objects.
 * @returns {Array<Object>} An array of result objects, each containing feedback and score.
 */
export const generateResults = (answers, questions) => {
  return questions.map(question => {
    const answer = answers[question.id] || '';
    
    if (!answer || answer.trim().length === 0) {
      return {
        question: question.text,
        answer: '',
        score: 0,
        feedback: 'No answer was provided for this question.',
        suggestions: ['Consider preparing an answer for this type of question.'],
        ats_score: 0,
        ats_feedback: 'No answer was analyzed.'
      };
    }
    
    // Mock analysis factors based on answer content
    const wordCount = answer.split(/\s+/).length;
    const hasKeywords = analyzeKeywords(answer, question.type);
    const structureFactor = analyzeStructure(answer);
    const clarityFactor = analyzeClarity(answer);
    
    // Calculate the score based on the analysis factors
    let score = Math.min(100, 50 + hasKeywords + structureFactor + clarityFactor);
    score = Math.max(40, score); // Minimum score is 40
    
    // Generate feedback based on the answer analysis
    let feedback = generateFeedback(answer, question.text, question.type, wordCount, score);
    
    // Generate context-aware improvement suggestions
    const suggestions = generateSuggestions(answer, question.text, question.type, wordCount, score);
    
    // Generate ATS analysis
    const atsAnalysis = analyzeATS(answer, question.type);
    
    return {
      question: question.text,
      answer: answer,
      score: score,
      feedback: feedback,
      suggestions: suggestions,
      ats_score: atsAnalysis.score,
      ats_feedback: atsAnalysis.feedback
    };
  });
};

/**
 * Analyzes the presence of keywords relevant to the question type
 * @param {string} answer - The answer provided by the user
 * @param {string} questionType - The type of question
 * @returns {number} Score between 0-20 based on keyword relevance
 */
const analyzeKeywords = (answer, questionType) => {
  const answerLower = answer.toLowerCase();
  
  // Define keywords by question type
  const keywordSets = {
    [QUESTION_CATEGORIES.BEHAVIORAL]: ['experience', 'team', 'project', 'lead', 'challenge', 'success', 'learn', 'improve', 'collaborate'],
    [QUESTION_CATEGORIES.TECHNICAL]: ['implement', 'develop', 'code', 'system', 'architecture', 'design', 'testing', 'debug', 'optimize'],
    [QUESTION_CATEGORIES.SITUATION]: ['handle', 'approach', 'resolve', 'strategy', 'solution', 'decision', 'prioritize', 'communication'],
    'Resume-Based': ['experience', 'skill', 'project', 'role', 'responsibility', 'achievement', 'contribution'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SOFTWARE_ENGINEER]: ['code', 'develop', 'architecture', 'framework', 'algorithm', 'solution', 'testing', 'debug', 'optimize'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.MARKETING]: ['campaign', 'strategy', 'audience', 'metrics', 'brand', 'digital', 'analytics', 'conversion'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DATA_SCIENCE]: ['data', 'model', 'analysis', 'algorithm', 'prediction', 'insight', 'visualization', 'statistics'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.PRODUCT_MANAGER]: ['user', 'feature', 'roadmap', 'prioritize', 'stakeholder', 'requirement', 'market', 'feedback'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.DESIGN]: ['user', 'interface', 'experience', 'wireframe', 'prototype', 'usability', 'feedback', 'iteration'],
    [QUESTION_CATEGORIES.ROLE_SPECIFIC.SALES]: ['client', 'prospect', 'lead', 'conversion', 'pipeline', 'negotiation', 'relationship', 'close']
  };
  
  // Default to behavioral keywords if type not found
  const relevantKeywords = keywordSets[questionType] || keywordSets[QUESTION_CATEGORIES.BEHAVIORAL];
  
  // Count how many relevant keywords are present in the answer
  const keywordMatches = relevantKeywords.filter(keyword => answerLower.includes(keyword));
  
  // Calculate score based on keyword matches
  return Math.min(20, keywordMatches.length * 5);
};

/**
 * Analyzes the structure of the answer
 * @param {string} answer - The answer provided by the user
 * @returns {number} Score between 0-15 based on structure quality
 */
const analyzeStructure = (answer) => {
  const sentenceCount = answer.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const avgSentenceLength = answer.length / Math.max(1, sentenceCount);
  const paragraphs = answer.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  
  // Ideal: 3-6 sentences, average sentence length 10-20 words, 1-3 paragraphs
  let structureScore = 0;
  
  if (sentenceCount >= 3 && sentenceCount <= 10) structureScore += 5;
  if (avgSentenceLength >= 50 && avgSentenceLength <= 150) structureScore += 5;
  if (paragraphs >= 1 && paragraphs <= 3) structureScore += 5;
  
  return structureScore;
};

/**
 * Analyzes the clarity of the answer
 * @param {string} answer - The answer provided by the user
 * @returns {number} Score between 0-15 based on clarity
 */
const analyzeClarity = (answer) => {
  // Simple analysis based on answer properties
  const wordsCount = answer.split(/\s+/).length;
  const avgWordLength = answer.length / Math.max(1, wordsCount);
  
  // Check for filler words that might indicate lack of clarity
  const fillerWords = ['um', 'like', 'you know', 'sort of', 'kind of'];
  const fillerCount = fillerWords.reduce((count, word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    return count + (answer.match(regex) || []).length;
  }, 0);
  
  // Calculate clarity score
  let clarityScore = 15;
  
  // Deduct points for too short or too long answers
  if (wordsCount < 30) clarityScore -= 5;
  if (wordsCount > 300) clarityScore -= 5;
  
  // Deduct points for too many filler words
  clarityScore -= Math.min(10, fillerCount * 2);
  
  return Math.max(0, clarityScore);
};

/**
 * Generates contextual feedback based on the answer analysis
 * @param {string} answer - The user's answer
 * @param {string} question - The interview question
 * @param {string} questionType - The type of question
 * @param {number} wordCount - Word count of the answer
 * @param {number} score - Overall score
 * @returns {string} Detailed feedback
 */
const generateFeedback = (answer, question, questionType, wordCount, score) => {
  if (score >= 85) {
    return `Excellent answer! You provided a comprehensive response that directly addressed the question with specific examples and clear communication.`;
  } else if (score >= 70) {
    return `Good answer. Your response was relevant and addressed the key aspects of the question. With a few improvements, it could be even stronger.`;
  } else if (score >= 50) {
    return `Satisfactory answer. Your response touched on some important points, but could benefit from more specific examples and clearer structure.`;
  } else {
    return `Your answer needs improvement. Consider providing more specific details, examples, and a clearer structure to better address the question.`;
  }
};

/**
 * Generates improvement suggestions based on answer analysis
 * @param {string} answer - The user's answer
 * @param {string} question - The interview question
 * @param {string} questionType - The type of question
 * @param {number} wordCount - Word count of the answer
 * @param {number} score - Overall score
 * @returns {Array<string>} Array of improvement suggestions
 */
const generateSuggestions = (answer, question, questionType, wordCount, score) => {
  const suggestions = [];
  
  // Length-based suggestions
  if (wordCount < 50) {
    suggestions.push("Try to provide a more detailed response with specific examples.");
  } else if (wordCount > 300) {
    suggestions.push("Consider making your answer more concise while maintaining key points.");
  }
  
  // Structure-based suggestions
  if (answer.split(/[.!?]+/).length < 3) {
    suggestions.push("Structure your answer with a clear beginning, middle, and end.");
  }
  
  // Content-based suggestions by question type
  switch (questionType) {
    case QUESTION_CATEGORIES.BEHAVIORAL:
      if (!answer.toLowerCase().includes('example') && !answer.toLowerCase().includes('situation')) {
        suggestions.push("Include a specific example using the STAR method (Situation, Task, Action, Result).");
      }
      break;
      
    case QUESTION_CATEGORIES.TECHNICAL:
      if (!answer.toLowerCase().includes('example') && !answer.toLowerCase().includes('project')) {
        suggestions.push("Reference specific projects or technical implementations from your experience.");
      }
      break;
      
    case 'Resume-Based':
      if (!answer.toLowerCase().includes('experience')) {
        suggestions.push("Connect your answer more directly to the experiences mentioned on your resume.");
      }
      break;
      
    default:
      // Default suggestions for any question type
      if (score < 70 && !answer.toLowerCase().includes('example')) {
        suggestions.push("Include specific examples to strengthen your response.");
      }
  }
  
  // Add a suggestion based on score
  if (score < 60) {
    suggestions.push("Practice articulating your thoughts more clearly with a structured approach to answering questions.");
  }
  
  // Ensure we always provide at least one suggestion
  if (suggestions.length === 0) {
    suggestions.push("For an even better answer, consider quantifying your achievements with specific metrics or results.");
  }
  
  return suggestions;
};

/**
 * Analyzes the answer for ATS (Applicant Tracking System) compatibility
 * @param {string} answer - The user's answer
 * @param {string} questionType - The type of question
 * @returns {Object} Object containing ATS score and feedback
 */
const analyzeATS = (answer, questionType) => {
  // Simple ATS analysis
  const wordCount = answer.split(/\s+/).length;
  let score = 70; // Base score
  
  // Adjust score based on word count
  if (wordCount < 30) score -= 15;
  if (wordCount > 50) score += 10;
  if (wordCount > 100) score += 5;
  
  // Cap the score
  score = Math.min(100, score);
  
  // Generate feedback based on score
  let feedback;
  if (score >= 90) {
    feedback = "Your answer contains strong keywords and phrases that would perform well in ATS systems.";
  } else if (score >= 75) {
    feedback = "Your answer is good for ATS systems, consider adding more industry-specific keywords.";
  } else {
    feedback = "To improve ATS compatibility, include more relevant keywords and elaborate on your specific experiences.";
  }
  
  return { score, feedback };
};

/**
 * Fetches resume-based questions from Supabase or generates them if not found.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<string>>} An array of resume-based interview questions.
 */
export const fetchResumeBasedQuestions = async (userId) => {
  try {
    // Fetch the latest resume for the user
    const { data: resumes, error: resumeError } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (resumeError) {
      console.error('Error fetching resume:', resumeError);
      return [];
    }
    
    // If no resume found, return an empty array
    if (!resumes || resumes.length === 0) {
      return [];
    }
    
    // Parse interview questions from the resume data
    const resume = resumes[0];
    let interviewQuestions = [];
    
    try {
      interviewQuestions = JSON.parse(resume.interview_questions);
    } catch (parseError) {
      console.error('Error parsing interview questions:', parseError);
      interviewQuestions = [];
    }
    
    // If no interview questions found, generate them
    if (!interviewQuestions || interviewQuestions.length === 0) {
      console.log('Generating new resume-based questions...');
      
      // Ensure resume_content is not null or empty
      if (!resume.resume_content) {
        console.warn('Resume content is empty. Cannot generate questions.');
        return [];
      }
      
      // Call the function to generate resume-based questions
      const generatedQuestions = generateResumeBasedQuestions(resume.resume_content);
      
      // Update the resume record with the generated questions
      const { error: updateError } = await supabase
        .from('resumes')
        .update({ interview_questions: JSON.stringify(generatedQuestions) })
        .eq('id', resume.id);
      
      if (updateError) {
        console.error('Error updating resume with new questions:', updateError);
      }
      
      return generatedQuestions;
    }
    
    return interviewQuestions;
  } catch (error) {
    console.error('Error fetching or generating resume-based questions:', error);
    return [];
  }
};

/**
 * Calculates the ATS score from interview results
 * @param {Array<Object>} results - An array of result objects
 * @returns {number} The calculated ATS score
 */
export const calculateATSScore = (results) => {
  if (!results || results.length === 0) {
    return 0;
  }
  
  const atsScores = results.filter(r => r.ats_score !== undefined);
  if (atsScores.length === 0) return 0;
  
  const totalScore = atsScores.reduce((acc, result) => acc + result.ats_score, 0);
  return Math.round(totalScore / atsScores.length);
};

/**
 * Gets ATS feedback from interview results
 * @param {Array<Object>} results - An array of result objects
 * @returns {Array<string>} Array of ATS feedback strings
 */
export const getATSFeedback = (results) => {
  if (!results || results.length === 0) {
    return [];
  }
  
  return results
    .filter(r => r.ats_feedback)
    .map(r => r.ats_feedback)
    .filter((feedback, index, self) => 
      self.indexOf(feedback) === index
    );
};

