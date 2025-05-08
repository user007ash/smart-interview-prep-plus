
import { COMMON_JOB_KEYWORDS, STRONG_ACTION_VERBS } from './keywords';

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
