
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const WelcomeSection = ({ userName }) => {
  return (
    <Card className="mb-8 bg-interview-softBg border-none">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-2">Welcome{userName ? `, ${userName}` : ''}!</h2>
        <p className="text-gray-600 mb-4">
          Start preparing for your next interview by taking a practice test or uploading your resume for analysis.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/interview-test">
            <Button className="bg-interview-purple hover:bg-interview-darkPurple">
              Take Interview Test
            </Button>
          </Link>
          <Link to="/resume-upload">
            <Button variant="outline" className="border-interview-purple text-interview-purple hover:bg-interview-softBg">
              Upload Resume
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
