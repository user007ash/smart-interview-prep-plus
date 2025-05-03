
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, signOut } = useAuth();

  // Check if user is scrolling down to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-interview-purple">InterviewPro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-interview-purple transition-colors">Home</Link>
          <Link to="/about-us" className="text-gray-700 hover:text-interview-purple transition-colors">About Us</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-interview-purple transition-colors">Dashboard</Link>
              <Button 
                variant="ghost" 
                className="text-gray-700 hover:text-interview-purple"
                onClick={signOut}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login" className="text-gray-700 hover:text-interview-purple transition-colors">Login</Link>
          )}
          
          <Button asChild>
            <Link to="/resume-upload" className="bg-interview-purple hover:bg-interview-darkPurple transition-colors">
              Get Started
            </Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-700" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="container mx-auto px-4 py-2 flex flex-col space-y-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-interview-purple transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/about-us" 
              className="text-gray-700 hover:text-interview-purple transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-interview-purple transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button 
                  className="text-left text-gray-700 hover:text-interview-purple transition-colors py-2"
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-interview-purple transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            
            <Link 
              to="/resume-upload" 
              className="bg-interview-purple text-white py-2 px-4 rounded w-full text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
