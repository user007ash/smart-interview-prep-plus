
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsCard from './MetricsCard';
import InterviewResultsSection from './InterviewResultsSection';
import ResumeSection from './ResumeSection';
import WelcomeSection from './WelcomeSection';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/dashboardUtils';

const OverviewTab = ({ userData, testResults, resumes, dataLoading, metrics }) => {
  return (
    <div className="animate-fade-in">
      {/* Welcome Message for new users or users with no data */}
      {(testResults.length === 0 || resumes.length === 0) && (
        <WelcomeSection userName={userData.name.split(' ')[0]} />
      )}
      
      {/* Latest Resume Update - Show this only if there's at least one resume */}
      {resumes.length > 0 && metrics.latestResume && (
        <Card className="p-4 mb-6 border-l-4 border-l-interview-purple">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Latest Resume: {metrics.latestResume.name}</h3>
              <p className="text-sm text-gray-500">
                Uploaded {formatDate(metrics.latestResume.uploadDate)} · 
                ATS Score: <span className={metrics.latestResume.atsScore >= 80 ? 'text-green-600 font-medium' : 
                                          metrics.latestResume.atsScore >= 60 ? 'text-yellow-600 font-medium' : 
                                          'text-red-600 font-medium'}>
                  {metrics.latestResume.atsScore}%
                </span>
              </p>
            </div>
            <Link to="/interview-test">
              <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                Take Interview
              </Button>
            </Link>
          </div>
        </Card>
      )}
      
      {/* Dashboard Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricsCard
          title="Average Interview Score"
          value={`${metrics.averageInterviewScore}%`}
          loading={dataLoading}
          trend={metrics.interviewScoreTrend}
          tooltip="Your average score across all interview tests. This measures factors like content, clarity, and depth of your answers."
        />
        
        <MetricsCard
          title="Average ATS Score"
          value={`${metrics.averageATSScore}%`}
          loading={dataLoading}
          trend={metrics.atsScoreTrend}
          tooltip="Average score from Applicant Tracking System analysis, measuring how well your resume matches job descriptions."
        />
        
        <MetricsCard
          title="Tests Completed"
          value={metrics.testsCompleted}
          loading={dataLoading}
          subtitle={metrics.testsCompleted > 0 ? `${resumes.length} Resume${resumes.length !== 1 ? 's' : ''}` : "No tests yet"}
        />
      </div>
      
      {/* Main Content Tabs */}
      <Tabs defaultValue="interviews" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="interviews" className="px-6">Interview Results</TabsTrigger>
          <TabsTrigger value="resumes" className="px-6">Resumes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="interviews" className="animate-fade-in">
          <InterviewResultsSection results={testResults} loading={dataLoading} />
        </TabsContent>
        
        <TabsContent value="resumes" className="animate-fade-in">
          <ResumeSection resumes={resumes} loading={dataLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OverviewTab;
