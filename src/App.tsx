
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AboutUs from './pages/AboutUs';
import NotFound from './pages/NotFound';
import InterviewTest from './pages/InterviewTest';
import InterviewResult from './pages/InterviewResult';
import ResumeUpload from './pages/ResumeUpload';
import LiveInterview from './pages/LiveInterview';
import { Toaster } from "sonner";
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/interview-test" element={<InterviewTest />} />
          <Route path="/interview-result/:id" element={<InterviewResult />} />
          <Route path="/resume-upload" element={<ResumeUpload />} />
          <Route path="/live-interview" element={<LiveInterview />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" closeButton />
      </AuthProvider>
    </Router>
  );
}

export default App;
