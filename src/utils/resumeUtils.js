
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
    
    // Store resume metadata in database
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .insert([{
        user_id: userId,
        file_name: file.name,
        file_path: filePath,
        file_url: fileUrl,
        file_type: file.type
      }])
      .select();
      
    if (resumeError) {
      console.error('Resume metadata save error:', resumeError);
      toast.error('Error saving resume metadata');
      return null;
    }
    
    // In a real app, we'd call an AI service to analyze the resume
    // For now, return mock analysis data
    const mockAnalysis = {
      resumeId: resumeData[0].id,
      atsScore: 75,
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
    
    return mockAnalysis;
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
