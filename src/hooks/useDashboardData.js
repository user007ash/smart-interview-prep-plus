
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
      // In a real app, fetch resumes from Supabase
      // For now, using mock data as placeholder
      setResumes([
        {
          id: 1,
          name: 'Software_Engineer_Resume.pdf',
          uploadDate: '2023-05-15',
          atsScore: 85,
        },
        {
          id: 2,
          name: 'Product_Manager_Resume.pdf',
          uploadDate: '2023-06-02',
          atsScore: 72,
        }
      ]);
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

  // Set up real-time subscription for test results
  useEffect(() => {
    if (!userId) return;
    
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
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(testResultsSubscription);
    };
  }, [userId, fetchTestResults]);

  // Calculate metrics
  const metrics = {
    testsCompleted: testResults.length,
    averageInterviewScore: testResults.length > 0 
      ? Math.round(testResults.reduce((sum, result) => sum + (result.score || 0), 0) / testResults.length) 
      : 0,
    averageATSScore: testResults.length > 0 
      ? Math.round(testResults.reduce((sum, result) => sum + (result.atsScore || 0), 0) / testResults.length) 
      : 0,
    resumesUploaded: resumes.length,
    interviewScoreTrend: calculateGrowthTrend(testResults, 'score'),
    atsScoreTrend: calculateGrowthTrend(testResults, 'atsScore'),
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
