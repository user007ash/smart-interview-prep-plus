
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getInterviewTypeFromFeedback, calculateGrowthTrend } from '@/utils/dashboardUtils';

export const useDashboardData = (userId) => {
  const [testResults, setTestResults] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch test results
  const fetchTestResults = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data: testResultsData, error: testResultsError } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (testResultsError) {
        throw testResultsError;
      }
      
      // Process test results
      const processedResults = (testResultsData || []).map(result => {
        try {
          // Parse feedback JSON if it exists
          const feedback = result.feedback ? JSON.parse(result.feedback) : [];
          return {
            id: result.id,
            date: result.created_at,
            questions: feedback.length || 0,
            score: result.total_score || 0,
            atsScore: result.ats_score || 0,
            type: result.type || getInterviewTypeFromFeedback(feedback) || 'Practice',
            feedback
          };
        } catch (e) {
          console.error('Error parsing result:', e);
          return {
            id: result.id,
            date: result.created_at,
            questions: 0,
            score: result.total_score || 0,
            atsScore: result.ats_score || 0,
            type: result.type || 'Practice',
            feedback: []
          };
        }
      });
      
      setTestResults(processedResults);
    } catch (error) {
      console.error('Error fetching test results:', error);
      setError('Failed to load test results');
    }
  }, [userId]);

  // Function to fetch resumes
  const fetchResumes = useCallback(async () => {
    if (!userId) return;
    
    try {
      // Fetch actual resumes from Supabase
      const { data: resumesData, error: resumesError } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (resumesError) {
        throw resumesError;
      }
      
      // Process resume data
      const processedResumes = (resumesData || []).map(resume => {
        return {
          id: resume.id,
          name: resume.file_name || 'Resume',
          uploadDate: resume.created_at,
          atsScore: resume.ats_score || 0,
          atsScoreDetails: resume.ats_feedback ? JSON.parse(resume.ats_feedback) : null,
          jobType: resume.job_type || 'general',
          keywords: resume.keywords_found ? JSON.parse(resume.keywords_found) : [],
          missingKeywords: resume.keywords_missing ? JSON.parse(resume.keywords_missing) : [],
          fileUrl: resume.file_url
        };
      });
      
      setResumes(processedResumes);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setError('Failed to load resumes');
    }
  }, [userId]);

  // Initial data fetch
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        await Promise.all([
          fetchTestResults(),
          fetchResumes()
        ]);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Error loading dashboard data');
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    if (userId) {
      loadAllData();
    }
  }, [userId, fetchTestResults, fetchResumes]);

  // Set up real-time subscription for test results and resumes
  useEffect(() => {
    if (!userId) return;
    
    // Subscribe to test results changes
    const testResultsSubscription = supabase
      .channel('test_results_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'test_results',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Test results change received:', payload);
          fetchTestResults();
        }
      )
      .subscribe();
    
    // Subscribe to resumes changes
    const resumesSubscription = supabase
      .channel('resumes_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'resumes',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          console.log('Resumes change received:', payload);
          fetchResumes();
        }
      )
      .subscribe();
    
    // Clean up subscriptions
    return () => {
      supabase.removeChannel(testResultsSubscription);
      supabase.removeChannel(resumesSubscription);
    };
  }, [userId, fetchTestResults, fetchResumes]);

  // Calculate metrics
  const metrics = {
    testsCompleted: testResults.length,
    averageInterviewScore: testResults.length > 0 
      ? Math.round(testResults.reduce((sum, result) => sum + (result.score || 0), 0) / testResults.length) 
      : 0,
    averageATSScore: resumes.length > 0 
      ? Math.round(resumes.reduce((sum, result) => sum + (result.atsScore || 0), 0) / resumes.length) 
      : 0,
    resumesUploaded: resumes.length,
    interviewScoreTrend: calculateGrowthTrend(testResults, 'score'),
    atsScoreTrend: calculateGrowthTrend(resumes, 'atsScore'),
    latestResume: resumes.length > 0 ? resumes[0] : null
  };

  return {
    testResults,
    resumes,
    loading,
    error,
    metrics,
    refreshData: useCallback(async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchTestResults(),
          fetchResumes()
        ]);
        toast.success('Dashboard data refreshed');
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast.error('Error refreshing dashboard data');
      } finally {
        setLoading(false);
      }
    }, [fetchTestResults, fetchResumes])
  };
};

export default useDashboardData;
