
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/utils/dashboardUtils';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InterviewResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInterviewResult = async () => {
      if (!id || !user) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase
          .from('test_results')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError('Result not found or you do not have permission to view it.');
          return;
        }
        
        // Process feedback data
        let feedbackItems = [];
        try {
          if (data.feedback) {
            feedbackItems = JSON.parse(data.feedback);
          }
        } catch (e) {
          console.error('Error parsing feedback:', e);
        }
        
        setResult({
          ...data,
          feedbackItems,
          date: formatDate(data.created_at)
        });
      } catch (err) {
        console.error('Error fetching interview result:', err);
        setError('Failed to load interview result. Please try again.');
        toast.error('Error loading interview data');
      } finally {
        setLoading(false);
      }
    };
    
    if (user && id) {
      fetchInterviewResult();
    }
  }, [id, user]);

  // Redirect if not authenticated
  if (!authLoading && !isAuthenticated) {
    return navigate('/login', { replace: true });
  }

  if (loading || authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 pt-20 pb-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-interview-purple"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <Link to="/dashboard" className="text-interview-purple hover:underline mr-6">
              &larr; Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold">Interview Report</h1>
          </div>
          
          {error ? (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-lg text-red-600 mb-4">{error}</p>
                <Link to="/dashboard">
                  <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                    Return to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : result ? (
            <div className="space-y-8">
              {/* Summary Card */}
              <Card>
                <CardHeader className="bg-interview-softBg">
                  <CardTitle>Interview Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Date</h3>
                      <p className="text-lg">{result.date}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Type</h3>
                      <p className="text-lg">{result.type || 'Practice'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500 mb-1">Overall Score</h3>
                      <div className="flex items-center">
                        <span className="text-lg font-semibold mr-2">
                          {result.total_score || 0}%
                        </span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (result.total_score || 0) >= 80 ? 'bg-green-500' : 
                              (result.total_score || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.total_score || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Feedback Items */}
              {result.feedbackItems && result.feedbackItems.length > 0 ? (
                result.feedbackItems.map((item, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardHeader className="bg-gray-50">
                      <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-500 mb-1">Question</h3>
                        <p className="text-lg">{item.question}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-500 mb-1">Your Answer</h3>
                        <p>{item.answer}</p>
                      </div>
                      
                      {item.audio_url && (
                        <div className="mb-4">
                          <h3 className="font-medium text-gray-500 mb-1">Audio Recording</h3>
                          <audio controls className="w-full">
                            <source src={item.audio_url} type="audio/wav" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                      
                      <div className="mb-4">
                        <h3 className="font-medium text-gray-500 mb-1">Feedback</h3>
                        <p className="bg-interview-softBg p-4 rounded-md">{item.feedback}</p>
                      </div>
                      
                      <div>
                        <h3 className="font-medium text-gray-500 mb-1">Score</h3>
                        <div className="flex items-center">
                          <span className="text-lg font-semibold mr-2">
                            {item.score || 0}%
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                (item.score || 0) >= 80 ? 'bg-green-500' : 
                                (item.score || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${item.score || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="p-6 text-center">
                  <p className="text-gray-500">No detailed feedback available for this interview.</p>
                </Card>
              )}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <CardContent>
                <p className="text-lg mb-4">Interview result not found.</p>
                <Link to="/dashboard">
                  <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                    Return to Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InterviewResult;
