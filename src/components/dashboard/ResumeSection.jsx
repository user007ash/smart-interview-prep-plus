
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dashboardUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ResumeSection = ({ resumes, loading }) => {
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
        <h2 className="text-xl font-semibold">Your Resumes</h2>
        <Link to="/resume-upload" className="text-interview-purple text-sm hover:underline">Upload New</Link>
      </div>
      
      {resumes.length > 0 ? (
        <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>ATS Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resumes.map((resume) => (
                <TableRow key={resume.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell className="font-medium">{resume.name}</TableCell>
                  <TableCell>{formatDate(resume.uploadDate || resume.uploaded_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="text-sm mr-2">{resume.atsScore || resume.ats_score || 0}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (resume.atsScore || resume.ats_score || 0) >= 80 ? 'bg-green-500' : 
                            (resume.atsScore || resume.ats_score || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${resume.atsScore || resume.ats_score || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="text-interview-purple hover:text-interview-darkPurple hover:bg-interview-softBg">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
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
