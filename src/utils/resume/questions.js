
import { COMMON_JOB_KEYWORDS } from './keywords';

/**
 * Generate interview questions based on resume content
 * @param {Object} resumeInfo - Extracted resume information
 * @param {string} jobType - The type of job 
 * @returns {Array} List of personalized interview questions
 */
export const generateResumeBasedQuestions = (resumeInfo, jobType = 'general') => {
  if (!resumeInfo) return [];
  
  const questions = [];
  
  // Add skills-based questions
  if (resumeInfo.skills && resumeInfo.skills.length > 0) {
    resumeInfo.skills.slice(0, 3).forEach(skill => {
      questions.push(`Tell me about your experience with ${skill}?`);
    });
    
    if (resumeInfo.skills.length > 2) {
      questions.push(`How do you stay updated with the latest developments in ${resumeInfo.skills[0]} and ${resumeInfo.skills[1]}?`);
    }
  }
  
  // Add company/experience-based questions
  if (resumeInfo.companies && resumeInfo.companies.length > 0) {
    resumeInfo.companies.slice(0, 2).forEach(company => {
      questions.push(`What was the most challenging project you worked on at ${company}?`);
    });
  }
  
  // Add project-based questions
  if (resumeInfo.projects && resumeInfo.projects.length > 0) {
    resumeInfo.projects.slice(0, 2).forEach(project => {
      questions.push(`Can you elaborate on your project "${project.name}" and your specific contribution to it?`);
    });
  }
  
  // Add achievement-based questions
  if (resumeInfo.achievements && resumeInfo.achievements.length > 0) {
    questions.push(`You mentioned "${resumeInfo.achievements[0].substring(0, 100)}..." - can you tell me more about how you achieved this?`);
  }
  
  // Add job-title specific questions
  if (resumeInfo.jobTitles && resumeInfo.jobTitles.length > 0) {
    questions.push(`Based on your experience as a ${resumeInfo.jobTitles[0]}, how do you approach problem-solving in your work?`);
  }
  
  // Add jobType specific questions
  if (jobType === 'softwareEngineering') {
    questions.push("Describe your approach to debugging complex technical issues.");
    questions.push("How do you ensure your code is maintainable and scalable?");
  } else if (jobType === 'productManagement') {
    questions.push("How do you prioritize features in a product roadmap?");
    questions.push("Describe a situation where you had to make a difficult product decision based on conflicting feedback.");
  } else if (jobType === 'dataScience') {
    questions.push("Explain how you would approach a new data analysis project from start to finish.");
    questions.push("How do you validate the accuracy of your predictive models?");
  } else {
    questions.push("How do you handle situations when you have to meet tight deadlines?");
    questions.push("Describe a time when you had to learn a new skill quickly. How did you approach it?");
  }
  
  // Fill with general behavioral questions if needed
  const generalBehavioral = [
    "Tell me about a time you faced a significant challenge in your work.",
    "How do you prioritize tasks when you have multiple deadlines?",
    "Describe a situation where you had to work with a difficult team member.",
    "Tell me about a mistake you made and how you recovered from it."
  ];
  
  // Add general questions until we have at least 8
  while (questions.length < 8) {
    const randomIndex = Math.floor(Math.random() * generalBehavioral.length);
    const question = generalBehavioral[randomIndex];
    
    // Only add if not already present
    if (!questions.includes(question)) {
      questions.push(question);
    }
  }
  
  return questions;
};
