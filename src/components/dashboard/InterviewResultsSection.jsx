
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dashboardUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const InterviewResultsSection = ({ results, loading }) => {
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
                <TableHead>Score</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.slice(0, 4).map((result) => (
                <TableRow key={result.id} className="hover:bg-gray-50 transition-colors">
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
