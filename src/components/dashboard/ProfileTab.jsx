
import React from 'react';
import { Button } from '@/components/ui/button';

const ProfileTab = ({ userData }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 bg-interview-softBg rounded-full mb-4 flex items-center justify-center text-4xl text-interview-purple font-semibold">
            {userData.name.charAt(0)}
          </div>
          <button className="text-interview-purple hover:underline text-sm">Change Photo</button>
        </div>
        
        <div className="flex-1">
          <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
          
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  defaultValue={userData.name}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  defaultValue={userData.email}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                  readOnly
                />
              </div>
              
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-1">Current Job Title</label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  defaultValue="Senior Developer"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
                />
              </div>
              
              <div>
                <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select 
                  id="industry"
                  name="industry"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple bg-white"
                  defaultValue="tech"
                >
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue="Full-stack developer with 5+ years of experience building web applications with React, Node.js, and MongoDB."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
              />
            </div>
            
            <div className="pt-4">
              <h3 className="font-medium mb-3">Skills (Used for interview question matching)</h3>
              <div className="flex flex-wrap gap-2">
                {['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'].map((skill, index) => (
                  <span key={index} className="bg-interview-softBg text-interview-purple px-3 py-1 rounded-full text-sm flex items-center">
                    {skill}
                    <button className="ml-2 text-interview-purple hover:text-interview-darkPurple">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
                <button className="border border-dashed border-gray-300 px-3 py-1 rounded-full text-sm text-gray-500 hover:border-interview-purple hover:text-interview-purple">
                  + Add Skill
                </button>
              </div>
            </div>
            
            <div className="pt-4">
              <Button className="bg-interview-purple hover:bg-interview-darkPurple">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;
