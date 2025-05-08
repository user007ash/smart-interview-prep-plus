
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { validateResumeFile } from './validation';
import { mockExtractResumeContent } from './mockExtraction';
import { extractResumeInformation } from './extraction';
import { calculateATSScore, generateATSFeedback } from './analysis';
import { generateResumeBasedQuestions } from './questions';

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
