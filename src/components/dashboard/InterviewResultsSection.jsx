
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dashboardUtils';
import { getATSFeedback } from '@/utils/interviewUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const InterviewResultsSection = ({ results, loading }) => {
  const [showingFeedbackFor, setShowingFeedbackFor] = useState(null);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Interview Tests</h2>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getBadgeColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 70) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getATSBadgeColor = (score) => {
    if (score >= 80) return "bg-blue-100 text-blue-800";
    if (score >= 70) return "bg-indigo-100 text-indigo-800";
    return "bg-purple-100 text-purple-800";
  };

  const toggleFeedback = (resultId) => {
    if (showingFeedbackFor === resultId) {
      setShowingFeedbackFor(null);
    } else {
      setShowingFeedbackFor(resultId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Interview Tests</h2>
        <Link to="/interview-history" className="text-interview-purple text-sm hover:underline">View All</Link>
      </div>
      
      {results.length > 0 ? (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Questions</TableHead>
                <TableHead>Interview Score</TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    ATS Score
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-gray-400 hover:text-gray-600">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>ATS Score measures how well your answers match job descriptions using keywords, action verbs, and proper grammar.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.slice(0, 4).map((result) => (
                <React.Fragment key={result.id}>
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">{formatDate(result.date || result.created_at)}</TableCell>
                    <TableCell>{result.questions || '5'}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{result.score || result.total_score || 0}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (result.score || result.total_score || 0) >= 80 ? 'bg-green-500' : 
                              (result.score || result.total_score || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${result.score || result.total_score || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">
                          {result.atsScore || result.ats_score || 0}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              (result.atsScore || result.ats_score || 0) >= 80 ? 'bg-blue-500' : 
                              (result.atsScore || result.ats_score || 0) >= 70 ? 'bg-indigo-500' : 'bg-purple-500'
                            }`}
                            style={{ width: `${result.atsScore || result.ats_score || 0}%` }}
                          ></div>
                        </div>
                        <button 
                          onClick={() => toggleFeedback(result.id)} 
                          className="ml-2 text-gray-400 hover:text-interview-purple transition-colors"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.type === 'Technical' ? 'bg-blue-100 text-blue-800' : 
                        result.type === 'Behavioral' ? 'bg-green-100 text-green-800' : 
                        result.type === 'live' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {result.type || 'Practice'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Link to={`/interview-result/${result.id}`}>
                        <Button variant="ghost" size="sm" className="text-interview-purple hover:text-interview-darkPurple hover:bg-interview-softBg">
                          View Report
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                  {showingFeedbackFor === result.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="flex items-start">
                            <Badge className={`${getATSBadgeColor(result.atsScore || result.ats_score || 0)} mr-2`}>
                              ATS Feedback
                            </Badge>
                            <div>
                              <p className="mb-2">{result.ats_feedback || getATSFeedback(result.atsScore || result.ats_score || 0, '')}</p>
                              
                              <div className="mt-3 text-sm">
                                <h4 className="font-semibold mb-1">Personalized Tips:</h4>
                                <ul className="list-disc pl-5 space-y-1">
                                  {(result.atsScore || result.ats_score || 0) < 70 && (
                                    <>
                                      <li>Reduce filler words like "um", "uh", and "like"</li>
                                      <li>Make your answers more specific with concrete examples</li>
                                    </>
                                  )}
                                  {(result.atsScore || result.ats_score || 0) < 80 && (
                                    <>
                                      <li>Use more action verbs (e.g., led, developed, implemented)</li>
                                      <li>Incorporate industry-specific keywords</li>
                                    </>
                                  )}
                                  {(result.atsScore || result.ats_score || 0) >= 80 && (
                                    <>
                                      <li>Excellent use of keywords and action verbs</li>
                                      <li>Keep maintaining this high standard in your answers</li>
                                    </>
                                  )}
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </Card>
      ) : (
        <Card className="p-8 text-center border border-dashed border-gray-300 bg-gray-50">
          <h3 className="text-lg font-medium mb-2">You haven't taken any interviews yet.</h3>
          <p className="text-gray-500 mb-4">Complete an interview to see your results and feedback here.</p>
          <Link to="/interview-test">
            <Button className="bg-interview-purple hover:bg-interview-darkPurple">
              Start New Interview
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default InterviewResultsSection;
