
/**
 * Mock function to extract text content from resume files
 * In a real app, this would use a document parsing library or service
 * @param {File} file - The resume file
 * @returns {Promise<string>} The extracted text content
 */
export const mockExtractResumeContent = async (file) => {
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
