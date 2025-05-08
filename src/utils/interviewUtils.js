// Original imports from interviewUtils.js
import { supabase } from '@/integrations/supabase/client';
// Update imports to use the new resume module structure
import { generateResumeBasedQuestions } from '@/utils/resume';

/**
 * Generates a set of mock interview questions.
 * @returns {Array<string>} An array of mock interview questions.
 */
export const getInterviewQuestions = (resumeQuestions) => {
  if (resumeQuestions && resumeQuestions.length > 0) {
    return resumeQuestions.map((question, index) => ({
      id: `resume-question-${index + 1}`,
      text: question,
      type: 'Resume-Based'
    }));
  }
  
  return [
    {
      id: '1',
      text: 'Tell me about yourself.',
      type: 'Behavioral'
    },
    {
      id: '2',
      text: 'Why are you interested in this position?',
      type: 'Behavioral'
    },
    {
      id: '3',
      text: 'What are your strengths?',
      type: 'Behavioral'
    },
    {
      id: '4',
      text: 'What are your weaknesses?',
      type: 'Behavioral'
    },
    {
      id: '5',
      text: 'Where do you see yourself in 5 years?',
      type: 'Behavioral'
    },
    {
      id: '6',
      text: 'Why do you want to leave your current job?',
      type: 'Behavioral'
    },
    {
      id: '7',
      text: 'Tell me about a time you failed.',
      type: 'Behavioral'
    },
    {
      id: '8',
      text: 'Tell me about a time you succeeded.',
      type: 'Behavioral'
    }
  ];
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
    
    // Mock analysis (replace with actual API call)
    const score = Math.floor(Math.random() * 60) + 40; // Score between 40-100
    const feedback = `This is a mock feedback for the answer to the question: ${question.text}. Your answer was: ${answer}.`;
    const ats_score = Math.floor(Math.random() * 30) + 70; // ATS score between 70-100
    const ats_feedback = 'Mock ATS feedback: Consider adding more industry-specific keywords.';
    
    return {
      question: question.text,
      answer: answer,
      score: score,
      feedback: feedback,
      ats_score: ats_score,
      ats_feedback: ats_feedback
    };
  });
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
