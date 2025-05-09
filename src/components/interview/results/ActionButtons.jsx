
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4">
      <Button 
        variant="outline" 
        className="border-interview-purple text-interview-purple hover:bg-interview-softBg"
        asChild
      >
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
      
      <Button 
        className="bg-interview-purple hover:bg-interview-darkPurple"
        asChild
      >
        <Link to="/interview-test">Start New Interview</Link>
      </Button>
    </div>
  );
};

export default ActionButtons;
