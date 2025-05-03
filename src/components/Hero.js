
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative bg-white pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-interview-softBg to-white z-0"></div>
      
      {/* Decoration circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-interview-lightPurple/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-interview-accent/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="gradient-text">AI-Powered</span> Interview Preparation
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Ace your next interview with our advanced AI assistant. Upload your resume, 
              get personalized questions, practice with real-time feedback, and improve your 
              chances of getting hired.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-interview-purple hover:bg-interview-darkPurple transition-colors">
                <Link to="/resume-upload">Upload Resume</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-interview-purple text-interview-purple hover:bg-interview-softBg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
            <div className="mt-8 flex items-center">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center text-white text-xs">JD</div>
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white flex items-center justify-center text-white text-xs">SM</div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 border-2 border-white flex items-center justify-center text-white text-xs">KL</div>
              </div>
              <p className="ml-4 text-sm text-gray-500">
                <span className="font-semibold">500+</span> interviews practiced today
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="w-full h-96 bg-gray-200 rounded-lg shadow-lg overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-interview-purple/20 to-interview-accent/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-6 bg-white/90 rounded-lg shadow-lg max-w-md w-full">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <h3 className="font-semibold mb-3 text-interview-purple">AI Interview Assistant</h3>
                  <div className="space-y-3">
                    <div className="p-2 bg-interview-softBg rounded-lg text-sm">
                      Tell me about your experience with React.js?
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg text-sm ml-6">
                      I have 3 years of experience building React applications, focusing on...
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      AI Assistant is analyzing your response...
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-interview-purple rounded-lg rotate-12 opacity-10"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-interview-accent rounded-lg -rotate-12 opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
