
import React from 'react';

const Features = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'ATS Resume Optimization',
      description: 'Get your resume scored and optimized for Applicant Tracking Systems to increase your chances of getting interviews.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Personalized Question Bank',
      description: 'AI generates questions tailored to your resume, experience level, and target job positions.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Live Interview Simulations',
      description: 'Practice with our AI interviewer using your webcam and microphone for a realistic interview experience.'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Performance Analytics',
      description: 'Get detailed feedback on your responses, body language, and speech patterns to improve your interview skills.'
    }
  ];

  return (
    <section className="py-16 bg-white" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prepare Smarter, <span className="gradient-text">Interview Better</span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Our AI-powered platform helps you ace every interview with personalized preparation and real-time feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-interview-purple mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their interview skills and landed their dream jobs using our platform.
          </p>
          <div className="flex justify-center gap-8 flex-wrap">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-interview-purple">95%</span>
              <span className="text-gray-500 text-sm">Success Rate</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-interview-purple">10,000+</span>
              <span className="text-gray-500 text-sm">Practice Sessions</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-interview-purple">200+</span>
              <span className="text-gray-500 text-sm">Job Categories</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
