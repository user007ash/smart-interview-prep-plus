
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Form field component for reusability
const FormField = ({ id, label, type, value, onChange, required = false, autoComplete = '' }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-interview-purple focus:border-interview-purple"
      placeholder={`Enter your ${label.toLowerCase()}`}
    />
  </div>
);

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (forgotPassword) {
      if (!formData.email) {
        toast.error('Please enter your email address');
        return false;
      }
      return true;
    }
    
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password');
      return false;
    }
    
    if (!isLogin && !formData.name) {
      toast.error('Please enter your full name');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);

    try {
      if (forgotPassword) {
        // Handle password reset
        const { success } = await resetPassword(formData.email);
        if (success) {
          setForgotPassword(false);
        }
      } else if (isLogin) {
        // Handle login
        const { success } = await signIn({
          email: formData.email,
          password: formData.password
        });
        
        if (!success) {
          // Error is already handled in the signIn function
          setIsLoading(false);
          return;
        }
      } else {
        // Handle signup
        const { success } = await signUp({
          email: formData.email,
          password: formData.password,
          name: formData.name
        });
        
        if (!success) {
          // Error is already handled in the signUp function
          setIsLoading(false);
          return;
        }
        
        toast.success('Account created! Please check your email to confirm your registration.');
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when switching between login/signup/forgot password
  const handleModeChange = (mode) => {
    setFormData({
      email: formData.email,
      password: '',
      name: '',
    });
    
    if (mode === 'login') {
      setIsLogin(true);
      setForgotPassword(false);
    } else if (mode === 'signup') {
      setIsLogin(false);
      setForgotPassword(false);
    } else if (mode === 'forgot') {
      setForgotPassword(true);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold gradient-text inline-block">
          {forgotPassword 
            ? 'Reset Your Password' 
            : isLogin 
              ? 'Welcome Back' 
              : 'Create Account'}
        </h2>
        <p className="text-gray-600 mt-2">
          {forgotPassword 
            ? 'Enter your email to receive a password reset link'
            : isLogin 
              ? 'Sign in to your account to continue' 
              : 'Join us to start your interview preparation'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && !forgotPassword && (
          <FormField
            id="name"
            label="Full Name"
            type="text"
            required={!isLogin && !forgotPassword}
            value={formData.name}
            onChange={handleChange}
            autoComplete="name"
          />
        )}

        <FormField
          id="email"
          label="Email Address"
          type="email"
          required={true}
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
        />

        {!forgotPassword && (
          <FormField
            id="password"
            label="Password"
            type="password"
            required={!forgotPassword}
            value={formData.password}
            onChange={handleChange}
            autoComplete={isLogin ? "current-password" : "new-password"}
          />
        )}

        {isLogin && !forgotPassword && (
          <div className="flex justify-end mb-6">
            <button
              type="button"
              className="text-interview-purple hover:underline text-sm"
              onClick={() => handleModeChange('forgot')}
            >
              Forgot password?
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-interview-purple hover:bg-interview-darkPurple"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            forgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        {forgotPassword ? (
          <p className="text-gray-600">
            Remember your password?
            <button
              type="button"
              onClick={() => handleModeChange('login')}
              className="ml-1 text-interview-purple hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        ) : (
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => handleModeChange(isLogin ? 'signup' : 'login')}
              className="ml-1 text-interview-purple hover:underline font-medium"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        )}
      </div>

      {!forgotPassword && (
        <>
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
              </svg>
              <span className="ml-2">Google</span>
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"/>
              </svg>
              <span className="ml-2">Facebook</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthForm;
