
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

/**
 * Validates if the file is an acceptable resume format
 * @param {File} file - The file to validate
 * @returns {boolean} Whether the file is valid
 */
export const validateResumeFile = (file) => {
  if (!file) {
    toast.error('No file selected');
    return false;
  }
  
  // Check file type
  const acceptableTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const fileExtension = file.name.split('.').pop().toLowerCase();
  
  if (!acceptableTypes.includes(file.type) && !['pdf', 'docx'].includes(fileExtension)) {
    toast.error('Please upload a PDF or DOCX file');
    return false;
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    toast.error('File size exceeds 5MB limit');
    return false;
  }
  
  return true;
};

/**
 * Common job-related keywords used to analyze resume content
 */
const COMMON_JOB_KEYWORDS = {
  softwareEngineering: [
    'javascript', 'react', 'node', 'api', 'frontend', 'backend', 'fullstack', 'typescript', 
    'aws', 'cloud', 'database', 'sql', 'nosql', 'mongodb', 'express', 'rest', 'graphql',
    'docker', 'kubernetes', 'ci/cd', 'testing', 'git', 'agile', 'scrum', 'python', 'java'
  ],
  productManagement: [
    'product', 'strategy', 'roadmap', 'user research', 'analytics', 'stakeholder', 'agile', 
    'scrum', 'customer', 'requirements', 'backlog', 'prioritization', 'market analysis',
    'data-driven', 'mvp', 'launch', 'metrics', 'kpi', 'conversion', 'retention', 'growth'
  ],
  dataScience: [
    'machine learning', 'data analysis', 'python', 'r', 'statistics', 'sql', 'big data', 
    'data visualization', 'tableau', 'power bi', 'predictive modeling', 'regression', 
    'classification', 'clustering', 'neural networks', 'deep learning', 'nlp', 'pandas', 'numpy'
  ],
  marketing: [
    'marketing', 'brand', 'digital', 'seo', 'sem', 'social media', 'content', 'analytics',
    'campaign', 'conversion', 'growth', 'email', 'customer acquisition', 'funnel', 'cro',
    'market research', 'strategy', 'advertising', 'copywriting', 'lead generation'
  ],
  general: [
    'leadership', 'management', 'communication', 'problem solving', 'teamwork', 'collaboration',
    'analytical', 'project', 'strategic', 'innovation', 'initiative', 'organization',
    'detail-oriented', 'results-driven', 'budget', 'planning', 'negotiation', 'client'
  ]
};

/**
 * Strong action verbs that indicate achievements and responsibilities
 */
const STRONG_ACTION_VERBS = [
  'achieved', 'implemented', 'developed', 'created', 'launched', 'improved', 'increased',
  'reduced', 'managed', 'led', 'coordinated', 'designed', 'optimized', 'built', 'delivered',
  'streamlined', 'reorganized', 'established', 'generated', 'negotiated', 'resolved', 'spearheaded'
];

/**
 * Extract information about skills, experience, and projects from resume text
 * @param {string} resumeContent - The extracted text content of the resume
 * @returns {Object} Structured information extracted from the resume
 */
export const extractResumeInformation = (resumeContent) => {
  if (!resumeContent) return { skills: [], experience: [], education: [], projects: [] };
  
  const content = resumeContent.toLowerCase();
  
  // Identify common resume sections
  const sections = {
    skills: findSection(resumeContent, ['skills', 'technical skills', 'core competencies']),
    experience: findSection(resumeContent, ['experience', 'work experience', 'professional experience']),
    education: findSection(resumeContent, ['education', 'academic background', 'qualifications']),
    projects: findSection(resumeContent, ['projects', 'relevant projects', 'personal projects'])
  };
  
  // Extract companies mentioned in experience section
  const companies = extractCompanies(sections.experience);
  
  // Extract skills from skills section and other sections
  let skills = extractSkills(sections.skills);
  if (skills.length < 3) {
    // If few skills found in skills section, try to extract from the entire resume
    skills = extractSkills(resumeContent);
  }
  
  // Extract projects
  const projects = extractProjects(sections.projects);
  
  // Extract education
  const education = extractEducation(sections.education);
  
  return {
    skills,
    companies,
    projects,
    education,
    jobTitles: extractJobTitles(sections.experience),
    achievements: extractAchievements(resumeContent)
  };
};

// Helper function to find section content in resume text
const findSection = (text, sectionNames) => {
  if (!text) return '';
  
  const lines = text.split('\n');
  let sectionContent = '';
  let inSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim().toLowerCase();
    
    // Check if this line is a section header
    const isSectionHeader = sectionNames.some(name => 
      line.includes(name.toLowerCase()) && 
      (line.length < name.length + 10) // To ensure it's a header not just text containing the word
    );
    
    // Check if this line is the next section header (to know when to stop)
    const isNextSectionHeader = isCommonSectionHeader(line) && !sectionNames.some(name => 
      line.includes(name.toLowerCase())
    );
    
    // Start collecting content if we found the section
    if (isSectionHeader) {
      inSection = true;
      continue; // Skip the header line itself
    }
    
    // Stop collecting if we found the next section
    if (inSection && isNextSectionHeader) {
      break;
    }
    
    // Collect content if we're in the target section
    if (inSection && line.length > 0) {
      sectionContent += lines[i] + '\n';
    }
  }
  
  return sectionContent.trim();
};

// Check if a line is a common section header
const isCommonSectionHeader = (line) => {
  const commonHeaders = [
    'skills', 'experience', 'education', 'projects', 'summary', 'objective', 
    'certifications', 'awards', 'publications', 'interests', 'references'
  ];
  
  return commonHeaders.some(header => 
    line.includes(header) && 
    (line.length < header.length + 10 || line.endsWith(':'))
  );
};

// Extract job titles from experience section
const extractJobTitles = (experienceText) => {
  if (!experienceText) return [];
  
  const jobTitles = [];
  const commonTitles = [
    'engineer', 'developer', 'manager', 'director', 'specialist', 'analyst', 
    'designer', 'architect', 'consultant', 'coordinator', 'assistant', 'associate',
    'lead', 'senior', 'junior', 'intern'
  ];
  
  // Look for lines that likely contain job titles
  const lines = experienceText.split('\n');
  for (const line of lines) {
    if (line.length > 50) continue; // Job titles are typically short
    
    const lowercaseLine = line.toLowerCase();
    if (commonTitles.some(title => lowercaseLine.includes(title))) {
      // Clean up the potential job title
      let title = line.split('|')[0].split('-')[0].split('at')[0].trim();
      if (title.length > 5 && title.length < 50) {
        jobTitles.push(title);
      }
    }
  }
  
  return jobTitles.slice(0, 3); // Return at most 3 job titles
};

// Extract companies from experience section
const extractCompanies = (experienceText) => {
  if (!experienceText) return [];
  
  const companies = [];
  const lines = experienceText.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Look for lines that might contain company names
    if (line.includes('at') || line.includes('|') || line.includes('-') || line.includes(',')) {
      let company = '';
      
      // Parse line that might be in format "Job Title at Company"
      if (line.includes('at ')) {
        company = line.split('at ')[1].trim().split(',')[0].trim();
      } 
      // Parse line that might be in format "Job Title | Company"
      else if (line.includes('|')) {
        company = line.split('|')[1].trim().split(',')[0].trim();
      }
      // Parse line that might be in format "Job Title - Company"
      else if (line.includes(' - ')) {
        company = line.split(' - ')[1].trim().split(',')[0].trim();
      }
      
      // If we found a potential company name
      if (company && company.length > 1 && company.length < 50) {
        // Clean up common suffixes
        ['Inc.', 'LLC', 'Ltd', 'Corp.', 'Corporation'].forEach(suffix => {
          company = company.replace(suffix, '').trim();
        });
        
        companies.push(company);
      }
    }
  }
  
  return [...new Set(companies)].slice(0, 3); // Return unique companies, max 3
};

// Extract skills from text
const extractSkills = (text) => {
  if (!text) return [];
  
  const skills = [];
  const allKeywords = Object.values(COMMON_JOB_KEYWORDS).flat();
  
  // Find common skills
  for (const keyword of allKeywords) {
    if (text.toLowerCase().includes(keyword.toLowerCase())) {
      skills.push(keyword);
    }
  }
  
  // Look for programming languages and technologies
  const techPatterns = [
    /\b(java|python|javascript|typescript|c\+\+|c#|ruby|go|rust|php|swift|kotlin|scala)\b/gi,
    /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel|asp\.net|rails)\b/gi,
    /\b(sql|nosql|mysql|postgresql|mongodb|redis|cassandra|oracle|graphql|firebase)\b/gi,
    /\b(aws|azure|gcp|docker|kubernetes|jenkins|terraform|ci\/cd|git)\b/gi,
  ];
  
  techPatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach(match => {
        skills.push(match.toLowerCase());
      });
    }
  });
  
  return [...new Set(skills)]; // Return unique skills
};

// Extract projects from projects section
const extractProjects = (projectsText) => {
  if (!projectsText) return [];
  
  const projects = [];
  const lines = projectsText.split('\n');
  let currentProject = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line seems like a project title
    if (line.length < 60 && !line.endsWith('.') && 
        (i === 0 || !lines[i-1].trim() || lines[i-1].endsWith('.'))) {
      // Save previous project if exists
      if (currentProject) {
        projects.push(currentProject);
      }
      
      // Start new project
      currentProject = { name: line, description: '' };
    } 
    // Add to current project description
    else if (currentProject) {
      currentProject.description += ' ' + line;
    }
  }
  
  // Add the last project
  if (currentProject) {
    projects.push(currentProject);
  }
  
  return projects.slice(0, 3); // Return at most 3 projects
};

// Extract education information
const extractEducation = (educationText) => {
  if (!educationText) return [];
  
  const education = [];
  const degreePatterns = [
    /\b(bachelor|master|phd|doctorate|associate|bs|ms|ba|ma|mba|phd)\b/i,
    /\b(computer science|engineering|business|mathematics|physics|chemistry|biology)\b/i
  ];
  
  const lines = educationText.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // Check if this line contains degree information
    if (degreePatterns.some(pattern => pattern.test(line))) {
      education.push(line);
    }
  }
  
  return education.slice(0, 2); // Return at most 2 education entries
};

// Extract quantifiable achievements
const extractAchievements = (text) => {
  if (!text) return [];
  
  const achievements = [];
  const lines = text.split('\n');
  
  // Look for lines with numbers (metrics) and action verbs
  for (const line of lines) {
    const containsNumber = /\d+%|\d+\s*million|\d+\s*thousand|\$\d+|\d+\s*users|\d+\s*customers|\d+\s*projects|\d+\s*team|\d+X/i.test(line);
    const containsActionVerb = STRONG_ACTION_VERBS.some(verb => 
      line.toLowerCase().includes(verb)
    );
    
    if (containsNumber && containsActionVerb) {
      // Clean up the line
      const achievement = line.trim()
        .replace(/^[•\-\*]\s*/, '') // Remove bullet points
        .trim();
      
      if (achievement.length > 10) {
        achievements.push(achievement);
      }
    }
  }
  
  return achievements.slice(0, 5); // Return at most 5 achievements
};

/**
 * Checks for formatting issues commonly found in resumes that cause ATS problems
 * @param {string} resumeContent - The extracted text content of the resume
 * @returns {Object} Issues found and their severity
 */
const checkFormattingIssues = (resumeContent) => {
  const issues = [];
  
  // Check for common section headers
  const essentialSections = ['experience', 'education', 'skills'];
  const missingSections = essentialSections.filter(section => 
    !resumeContent.toLowerCase().includes(section)
  );
  
  if (missingSections.length > 0) {
    issues.push({
      issue: `Missing standard section(s): ${missingSections.join(', ')}`,
      severity: 'high'
    });
  }
  
  // Check for excessive whitespace or formatting issues
  if (resumeContent.includes('\t\t') || resumeContent.includes('  ') || resumeContent.includes('\n\n\n')) {
    issues.push({
      issue: 'Potential formatting issues detected (excessive spacing)',
      severity: 'medium'
    });
  }
  
  // Check for potential tables (approximate detection)
  if ((resumeContent.match(/\|/g) || []).length > 3) {
    issues.push({
      issue: 'Possible table structures detected which may not parse well in ATS systems',
      severity: 'high'
    });
  }
  
  // Check for bullet point consistency
  const bulletPointStyles = [
    (resumeContent.match(/•/g) || []).length,
    (resumeContent.match(/\*/g) || []).length,
    (resumeContent.match(/\-/g) || []).length,
    (resumeContent.match(/\>/g) || []).length
  ];
  
  if (Math.max(...bulletPointStyles) > 0 && bulletPointStyles.filter(count => count > 0).length > 1) {
    issues.push({
      issue: 'Inconsistent bullet point styles detected',
      severity: 'low'
    });
  }
  
  // Check for contact information
  const hasEmail = !!resumeContent.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const hasPhone = !!resumeContent.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (!hasEmail || !hasPhone) {
    issues.push({
      issue: !hasEmail && !hasPhone ? 
        'Missing contact information (email and phone)' :
        !hasEmail ? 'Missing email address' : 'Missing phone number',
      severity: 'high'
    });
  }
  
  // Check for quantifiable achievements
  const hasQuantifiableAchievements = (resumeContent.match(/\d+%|\d+\s*percent|\$\d+|\d+\s*million|\d+\s*thousand/g) || []).length;
  if (hasQuantifiableAchievements === 0) {
    issues.push({
      issue: 'No quantifiable achievements found - add metrics to strengthen impact',
      severity: 'medium'
    });
  }
  
  return issues;
};

/**
 * Calculate ATS compatibility score based on resume content
 * @param {string} resumeContent - The extracted text content of the resume
 * @param {string} jobType - The type of job (used to match relevant keywords)
 * @returns {Object} The ATS score and detailed analysis
 */
const calculateATSScore = (resumeContent, jobType = 'general') => {
  if (!resumeContent || resumeContent.trim() === '') {
    return { 
      score: 0,
      keywordsFound: [],
      missingKeywords: [],
      actionVerbsFound: [],
      formattingIssues: [],
      recommendations: ['No resume content could be extracted. Please check the file format.']
    };
  }
  
  const content = resumeContent.toLowerCase();
  let score = 70; // Base score
  
  // Select relevant keyword categories
  const keywordSets = [COMMON_JOB_KEYWORDS[jobType] || [], COMMON_JOB_KEYWORDS.general];
  const allKeywords = [...new Set([].concat(...keywordSets))];
  
  // Find matching keywords
  const keywordsFound = allKeywords.filter(keyword => content.includes(keyword.toLowerCase()));
  const keywordScore = Math.min(15, keywordsFound.length * 1.5);
  score += keywordScore;
  
  // Find missing important keywords
  const importantKeywords = allKeywords.slice(0, 10); // Consider first 10 as most important
  const missingKeywords = importantKeywords.filter(keyword => 
    !content.includes(keyword.toLowerCase())
  ).slice(0, 5); // Show up to 5 missing keywords
  
  // Check for action verbs
  const actionVerbsFound = STRONG_ACTION_VERBS.filter(verb => 
    content.includes(verb.toLowerCase())
  );
  const actionVerbScore = Math.min(10, actionVerbsFound.length);
  score += actionVerbScore;
  
  // Check for quantifiable achievements (numbers and percentages)
  const hasQuantifiableAchievements = (content.match(/\d+%|\d+\s*percent|\$\d+|\d+\s*million|\d+\s*thousand/g) || []).length;
  if (hasQuantifiableAchievements > 0) {
    score += Math.min(5, hasQuantifiableAchievements * 2);
  } else {
    score -= 5;
  }
  
  // Check for contact information
  const hasEmail = !!content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const hasPhone = !!content.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  if (hasEmail && hasPhone) {
    score += 2;
  } else {
    score -= 3;
  }
  
  // Check formatting issues
  const formattingIssues = checkFormattingIssues(resumeContent);
  const severityMultipliers = { high: 5, medium: 3, low: 1 };
  
  formattingIssues.forEach(issue => {
    score -= severityMultipliers[issue.severity] || 0;
  });
  
  // Generate recommendations
  const recommendations = [];
  
  if (keywordsFound.length < 8) {
    recommendations.push('Include more industry-specific keywords relevant to the job description');
  }
  
  if (actionVerbsFound.length < 5) {
    recommendations.push('Use more strong action verbs to describe your experiences and achievements');
  }
  
  if (!hasQuantifiableAchievements) {
    recommendations.push('Add quantifiable achievements with numbers and percentages');
  }
  
  if (formattingIssues.length > 0) {
    recommendations.push('Address formatting issues that may affect ATS readability');
  }
  
  if (missingKeywords.length > 0) {
    recommendations.push(`Consider adding these relevant keywords: ${missingKeywords.join(', ')}`);
  }
  
  // Ensure score stays within bounds
  score = Math.max(0, Math.min(100, Math.round(score)));
  
  return {
    score,
    keywordsFound,
    missingKeywords,
    actionVerbsFound,
    formattingIssues,
    recommendations
  };
};

/**
 * Generate comprehensive ATS feedback based on score and analysis
 * @param {number} score - The ATS compatibility score
 * @param {Object} analysisDetails - Detailed analysis results
 * @returns {Object} Formatted feedback object with message and improvements
 */
const generateATSFeedback = (score, analysisDetails) => {
  let feedbackMessage = '';
  let strength = '';
  
  // Generate tiered feedback based on score
  if (score >= 85) {
    feedbackMessage = 'Your resume is well-optimized for ATS systems. Great use of relevant keywords and formatting.';
    strength = 'strong';
  } else if (score >= 60) {
    feedbackMessage = 'Good resume, but you could add more role-specific keywords and achievements to improve ATS compatibility.';
    strength = 'moderate';
  } else {
    feedbackMessage = 'Your resume needs significant improvement for ATS compatibility. Focus on formatting, keywords, and structure.';
    strength = 'weak';
  }
  
  // Generate specific improvements
  let improvements = [];
  
  if (analysisDetails) {
    if (analysisDetails.recommendations && analysisDetails.recommendations.length > 0) {
      improvements = analysisDetails.recommendations;
    }
    
    if (analysisDetails.formattingIssues && analysisDetails.formattingIssues.length > 0) {
      improvements = improvements.concat(
        analysisDetails.formattingIssues.map(issue => issue.issue)
      );
    }
  }
  
  return {
    message: feedbackMessage,
    strength,
    improvements: improvements.filter((item, index) => improvements.indexOf(item) === index) // Remove duplicates
  };
};

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

/**
 * Mock function to extract text content from resume files
 * In a real app, this would use a document parsing library or service
 * @param {File} file - The resume file
 * @returns {Promise<string>} The extracted text content
 */
const mockExtractResumeContent = async (file) => {
  // In a real app, this would use a PDF/DOCX parser library or API
  // For mock purposes, we'll return sample text based on file name
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
  
  const fileName = file.name.toLowerCase();
  
  if (fileName.includes('engineer') || fileName.includes('developer')) {
    return `
      John Doe
      Software Engineer
      email@example.com | (555) 123-4567 | linkedin.com/in/johndoe

      SUMMARY
      Experienced software engineer with 5+ years developing scalable web applications using React, Node.js, and AWS. Led development of enterprise applications resulting in 35% increased user engagement.

      EXPERIENCE
      Senior Software Engineer | Tech Company Inc. | 2020 - Present
      • Implemented microservice architecture that reduced server costs by 25%
      • Developed CI/CD pipeline using GitHub Actions, improving deployment time by 40%
      • Led team of 5 engineers to deliver project under budget and ahead of schedule

      Software Developer | Start-Up Corp | 2018 - 2020
      • Built RESTful APIs serving 10,000+ daily active users
      • Refactored legacy codebase, improving load times by 60%
      
      EDUCATION
      Bachelor of Science in Computer Science | University Name | 2018
      
      SKILLS
      JavaScript, TypeScript, React, Node.js, Express, MongoDB, SQL, AWS, Docker, Git
    `;
  } else if (fileName.includes('product') || fileName.includes('manager')) {
    return `
      Jane Smith
      Product Manager
      jane@example.com | (555) 987-6543

      EXPERIENCE
      Senior Product Manager | Product Company | 2019 - Present
      • Led product strategy for SaaS platform with $2M ARR
      • Increased user retention by 25% through data-driven feature development
      
      Product Manager | Tech Solutions Inc. | 2017 - 2019
      • Managed agile team of developers and designers
      • Launched MVP that attracted 5,000 users in first month
      
      EDUCATION
      MBA | Business School | 2017
      BS in Marketing | University Name | 2015
      
      SKILLS
      Product Strategy, User Research, Agile/Scrum, Roadmapping, Data Analysis
    `;
  } else {
    // Generic resume content
    return `
      Professional Resume
      name@example.com | (555) 555-5555

      EXPERIENCE
      Senior Position | Company Name | 2020 - Present
      • Led important projects
      • Managed team members
      
      Junior Position | Another Company | 2018 - 2020
      • Assisted with tasks
      • Learned skills
      
      EDUCATION
      Degree | University Name | 2018
      
      SKILLS
      Communication, Teamwork, Microsoft Office
    `;
  }
};

/**
 * Uploads a resume to Supabase and analyzes it
 * @param {File} file - The resume file to upload
 * @param {string} userId - The user's ID
 * @returns {Promise<Object|null>} Analysis result or null if failed
 */
export const uploadResumeToSupabase = async (file, userId) => {
  if (!validateResumeFile(file)) {
    return null;
  }
  
  try {
    // Check authentication
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      toast.error('You must be logged in to upload a resume');
      return null;
    }
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Upload error:', uploadError);
      toast.error('Error uploading resume: ' + uploadError.message);
      return null;
    }
    
    // Get the URL of the uploaded file
    const { data: urlData } = await supabase.storage
      .from('resumes')
      .getPublicUrl(filePath);
      
    const fileUrl = urlData?.publicUrl;
    
    // Extract resume content for analysis
    const resumeContent = await mockExtractResumeContent(file);
    
    // Extract structured information from resume
    const resumeInfo = extractResumeInformation(resumeContent);
    
    // Analyze resume content for ATS compatibility
    // Detect job type from file name or content
    let jobType = 'general';
    const lowerCaseFileName = file.name.toLowerCase();
    
    if (lowerCaseFileName.includes('engineer') || lowerCaseFileName.includes('developer') || resumeContent.toLowerCase().includes('software')) {
      jobType = 'softwareEngineering';
    } else if (lowerCaseFileName.includes('product') || resumeContent.toLowerCase().includes('product manager')) {
      jobType = 'productManagement';
    } else if (lowerCaseFileName.includes('data') || resumeContent.toLowerCase().includes('data scientist')) {
      jobType = 'dataScience';
    } else if (lowerCaseFileName.includes('market') || resumeContent.toLowerCase().includes('marketing')) {
      jobType = 'marketing';
    }
    
    // Calculate ATS score and generate feedback
    const atsAnalysis = calculateATSScore(resumeContent, jobType);
    const atsFeedback = generateATSFeedback(atsAnalysis.score, atsAnalysis);
    
    // Generate resume-based interview questions
    const interviewQuestions = generateResumeBasedQuestions(resumeInfo, jobType);
    
    // Store resume metadata in database
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert([{
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_url: fileUrl,
        file_type: file.type,
        ats_score: atsAnalysis.score,
        ats_feedback: JSON.stringify(atsFeedback),
        job_type: jobType,
        keywords_found: JSON.stringify(atsAnalysis.keywordsFound),
        keywords_missing: JSON.stringify(atsAnalysis.missingKeywords),
        resume_content: resumeContent,
        interview_questions: JSON.stringify(interviewQuestions)
      }])
      .select();
      
    if (resumeError) {
      console.error('Resume metadata save error:', resumeError);
      toast.error('Error saving resume metadata');
      return null;
    }
    
    // Return enhanced analysis results
    const analysisResult = {
      resumeId: resumeData[0].id,
      atsScore: atsAnalysis.score,
      keywords: atsAnalysis.keywordsFound,
      missingKeywords: atsAnalysis.missingKeywords,
      actionVerbs: atsAnalysis.actionVerbsFound,
      formattingIssues: atsAnalysis.formattingIssues,
      feedback: atsFeedback,
      jobType: jobType,
      summary: atsFeedback.message,
      improvements: atsFeedback.improvements,
      interviewQuestions: interviewQuestions
    };
    
    return analysisResult;
  } catch (error) {
    console.error('Resume upload process error:', error);
    toast.error('Unexpected error during resume upload');
    return null;
  }
};

/**
 * Mock function to simulate resume analysis
 * Would be replaced with actual API call in production
 */
export const analyzeResume = async (resumeUrl) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock analysis response
  return {
    atsScore: Math.floor(Math.random() * 30) + 65, // Score between 65-95
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
};
