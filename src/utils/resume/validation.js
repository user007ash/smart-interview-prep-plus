
import { toast } from 'sonner';

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
