
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricsCard from './MetricsCard';
import InterviewResultsSection from './InterviewResultsSection';
import ResumeSection from './ResumeSection';
import WelcomeSection from './WelcomeSection';

const OverviewTab = ({ userData, testResults, resumes, dataLoading, metrics }) => {
  return (
    <div className="animate-fade-in">
      {/* Welcome Message for new users or users with no data */}
      {(testResults.length === 0 || resumes.length === 0) && (
        <WelcomeSection userName={userData.name.split(' ')[0]} />
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
          subtitle={metrics.testsCompleted > 0 ? `${resumes.length} Resumes` : "No tests yet"}
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
