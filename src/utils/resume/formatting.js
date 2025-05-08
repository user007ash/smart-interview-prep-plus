
/**
 * Checks for formatting issues commonly found in resumes that cause ATS problems
 * @param {string} resumeContent - The extracted text content of the resume
 * @returns {Object} Issues found and their severity
 */
export const checkFormattingIssues = (resumeContent) => {
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
