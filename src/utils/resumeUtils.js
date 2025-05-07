
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
    
    // Analyze resume content for ATS compatibility
    // Detect job type from file name or content
    let jobType = 'general';
    const fileName = file.name.toLowerCase();
    
    if (fileName.includes('engineer') || fileName.includes('developer') || resumeContent.toLowerCase().includes('software')) {
      jobType = 'softwareEngineering';
    } else if (fileName.includes('product') || resumeContent.toLowerCase().includes('product manager')) {
      jobType = 'productManagement';
    } else if (fileName.includes('data') || resumeContent.toLowerCase().includes('data scientist')) {
      jobType = 'dataScience';
    } else if (fileName.includes('market') || resumeContent.toLowerCase().includes('marketing')) {
      jobType = 'marketing';
    }
    
    // Calculate ATS score and generate feedback
    const atsAnalysis = calculateATSScore(resumeContent, jobType);
    const atsFeedback = generateATSFeedback(atsAnalysis.score, atsAnalysis);
    
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
        keywords_missing: JSON.stringify(atsAnalysis.missingKeywords)
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
