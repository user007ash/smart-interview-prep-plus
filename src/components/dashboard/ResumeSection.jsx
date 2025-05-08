
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dashboardUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, FileText, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const ResumeSection = ({ resumes, loading }) => {
  const [expandedResumeId, setExpandedResumeId] = React.useState(null);

  const toggleExpand = (resumeId) => {
    setExpandedResumeId(expandedResumeId === resumeId ? null : resumeId);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Group improvements by category
  const categorizeImprovements = (improvements = []) => {
    const categories = {
      keywords: [],
      formatting: [],
      content: [],
      achievements: [],
      other: []
    };
    
    improvements.forEach(improvement => {
      const lower = improvement.toLowerCase();
      if (lower.includes('keyword') || lower.includes('skill'))
        categories.keywords.push(improvement);
      else if (lower.includes('format') || lower.includes('layout') || lower.includes('section'))
        categories.formatting.push(improvement);
      else if (lower.includes('content') || lower.includes('detail'))
        categories.content.push(improvement);
      else if (lower.includes('achievement') || lower.includes('metric') || lower.includes('quantif'))
        categories.achievements.push(improvement);
      else
        categories.other.push(improvement);
    });
    
    return categories;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Resumes</h2>
        </div>
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">Your Resumes</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600">
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Upload your resume to see how well it would perform with Applicant Tracking Systems (ATS) used by employers.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Link to="/resume-upload" className="text-interview-purple text-sm hover:underline">Upload New</Link>
      </div>
      
      {resumes.length > 0 ? (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
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
                          <p>ATS Score measures how well your resume would perform with Applicant Tracking Systems used by employers.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.map((resume) => (
                <React.Fragment key={resume.id}>
                  <TableRow className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        {resume.name || resume.file_name}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(resume.uploadDate || resume.uploaded_at || resume.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm mr-2">{resume.atsScore || resume.ats_score || 0}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getScoreColor(resume.atsScore || resume.ats_score || 0)}`}
                            style={{ width: `${resume.atsScore || resume.ats_score || 0}%` }}
                          ></div>
                        </div>
                        <button 
                          onClick={() => toggleExpand(resume.id)}
                          className="ml-2 text-gray-400 hover:text-interview-purple transition-colors"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-interview-purple hover:text-interview-darkPurple hover:bg-interview-softBg" onClick={() => toggleExpand(resume.id)}>
                          {expandedResumeId === resume.id ? 'Hide Details' : 'View Details'}
                        </Button>
                        <Link to="/interview-test">
                          <Button variant="outline" size="sm" className="border-interview-purple text-interview-purple hover:bg-interview-softBg">
                            Start Interview
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {expandedResumeId === resume.id && (
                    <TableRow>
                      <TableCell colSpan={4} className="p-0">
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                          <div className="flex flex-col gap-4">
                            <div>
                              <h3 className="font-semibold mb-2 flex items-center gap-2">
                                ATS Feedback
                                <Badge className={getScoreBadgeClass(resume.atsScore || resume.ats_score || 0)}>
                                  {resume.atsScore || resume.ats_score || 0}%
                                </Badge>
                              </h3>
                              
                              {resume.atsScoreDetails || (resume.ats_feedback && typeof resume.ats_feedback === 'string') ? (
                                <p className="text-gray-700">
                                  {resume.atsScoreDetails ? 
                                    resume.atsScoreDetails.message : 
                                    typeof resume.ats_feedback === 'string' ? 
                                      JSON.parse(resume.ats_feedback).message : 
                                      "Your resume has been analyzed for ATS compatibility."
                                  }
                                </p>
                              ) : (
                                <p className="text-gray-700">
                                  {(resume.atsScore || resume.ats_score) >= 85
                                    ? "Your resume is well-optimized for ATS systems. Great use of relevant keywords and formatting."
                                    : (resume.atsScore || resume.ats_score) >= 60
                                    ? "Good resume, but you could add more role-specific keywords and achievements to improve ATS compatibility."
                                    : "Your resume needs significant improvement for ATS compatibility. Focus on formatting, keywords, and structure."}
                                </p>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Keywords Found:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {(resume.keywords || 
                                    (resume.keywords_found && typeof resume.keywords_found === 'string' ? 
                                      JSON.parse(resume.keywords_found) : [])).slice(0, 8).map((keyword, i) => (
                                    <Badge key={i} className="bg-green-100 text-green-800">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-medium mb-2">Missing Keywords:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {(resume.missingKeywords || 
                                    (resume.keywords_missing && typeof resume.keywords_missing === 'string' ?
                                      JSON.parse(resume.keywords_missing) : [])).slice(0, 5).map((keyword, i) => (
                                    <Badge key={i} className="bg-red-100 text-red-800">
                                      {keyword}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <Collapsible>
                                <h4 className="font-medium mb-2 flex items-center gap-2">
                                  Improvement Recommendations:
                                  <CollapsibleTrigger asChild>
                                    <button className="text-sm font-normal text-interview-purple hover:underline">
                                      (View all)
                                    </button>
                                  </CollapsibleTrigger>
                                </h4>
                                
                                <ul className="list-disc pl-5 space-y-1">
                                  {/* Show first 3 recommendations by default */}
                                  {(resume.atsScoreDetails?.improvements || 
                                    (resume.ats_feedback && typeof resume.ats_feedback === 'string' ? 
                                      JSON.parse(resume.ats_feedback).improvements : []) || 
                                    resume.improvements || []).slice(0, 3).map((improvement, i) => (
                                    <li key={i} className="text-sm text-gray-700">{improvement}</li>
                                  ))}
                                </ul>
                                
                                <CollapsibleContent>
                                  {/* Categorized improvements */}
                                  {Object.entries(categorizeImprovements(
                                    resume.atsScoreDetails?.improvements || 
                                    (resume.ats_feedback && typeof resume.ats_feedback === 'string' ? 
                                      JSON.parse(resume.ats_feedback).improvements : []) || 
                                    resume.improvements || []
                                  )).filter(([category, items]) => items.length > 0).map(([category, items]) => (
                                    <div key={category} className="mt-3">
                                      <h5 className="font-medium text-sm mb-1 capitalize">{category}:</h5>
                                      <ul className="list-disc pl-5 space-y-1">
                                        {items.map((item, i) => (
                                          <li key={i} className="text-sm text-gray-700">{item}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </CollapsibleContent>
                              </Collapsible>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                              <Link to="/interview-test">
                                <Button size="sm" className="bg-interview-purple hover:bg-interview-darkPurple">
                                  Take Resume-Based Interview
                                </Button>
                              </Link>
                              
                              <Link to="/resume-upload">
                                <Button size="sm" variant="outline">
                                  Upload New Version
                                </Button>
                              </Link>
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
          <h3 className="text-lg font-medium mb-2">You haven't uploaded any resumes yet.</h3>
          <p className="text-gray-500 mb-4">Upload your resume to get ATS analysis and optimization suggestions.</p>
          <Link to="/resume-upload">
            <Button className="bg-interview-purple hover:bg-interview-darkPurple">
              Upload Resume
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default ResumeSection;
