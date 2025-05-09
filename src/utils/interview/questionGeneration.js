
// Functionality for generating interview questions
import { supabase } from '@/integrations/supabase/client';
import { generateResumeBasedQuestions } from '@/utils/resume';
import { QUESTION_CATEGORIES } from './categories';
import { getLanguageSpecificQuestions } from './languageQuestions';
import { getRoleSpecificQuestions } from './roleQuestions';

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
export const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Filters questions by programming language
 * @param {Array<Object>} questions - Array of question objects
 * @param {string} language - Programming language to filter by
 * @returns {Array<Object>} Filtered questions
 */
export const filterQuestionsByLanguage = (questions, language) => {
  if (!language) return questions;
  return questions.filter(q => 
    q.language === language || 
    !q.language // Include non-language specific questions
  );
};

/**
 * Creates behavioral questions
 * @returns {Array<Object>} Array of behavioral questions
 */
const getBehavioralQuestions = () => {
  return [
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
};

/**
 * Creates situational questions
 * @returns {Array<Object>} Array of situational questions
 */
const getSituationalQuestions = () => {
  return [
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
      text: 'How would you adapt if your team\'s priorities suddenly changed?',
      type: QUESTION_CATEGORIES.SITUATION
    }
  ];
};

/**
 * Creates resume-based questions from raw resume questions
 * @param {Array<string>} resumeQuestions - Raw resume questions
 * @returns {Array<Object>} Array of resume question objects
 */
const createResumeQuestions = (resumeQuestions) => {
  if (!resumeQuestions || resumeQuestions.length === 0) {
    return [];
  }
  
  return resumeQuestions.map((question, index) => ({
    id: `resume-question-${index + 1}`,
    text: question,
    type: 'Resume-Based'
  }));
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
  let allQuestions = createResumeQuestions(resumeQuestions);
  
  // Add behavioral and situational questions
  const behavioralQuestions = getBehavioralQuestions();
  const situationalQuestions = getSituationalQuestions();
  
  // Get language-specific questions
  const languageSpecificQuestions = getLanguageSpecificQuestions();
  
  // Get role-specific questions
  const roleSpecificQuestions = getRoleSpecificQuestions();
  
  // Combine all questions
  allQuestions = [
    ...allQuestions,
    ...behavioralQuestions,
    ...situationalQuestions
  ];
  
  // Add language-specific questions (add a few from each language)
  Object.values(languageSpecificQuestions).forEach(questions => {
    allQuestions = [...allQuestions, ...questions];
  });
  
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
