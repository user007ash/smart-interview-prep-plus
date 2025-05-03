
# AI-Powered Interview Preparation Platform

A full-stack web application that helps users prepare for job interviews using AI-powered tools, including resume analysis, mock interviews, and live interview practice with webcam and microphone.

## Features

- **Resume Upload & Analysis**: Upload your resume for ATS scoring, keyword extraction, and personalized interview questions.
- **Interview Practice Tests**: Take timed interview tests with personalized questions based on your resume.
- **Live Interview Simulation**: Practice interviews using your webcam and microphone with AI feedback.
- **User Authentication**: Create an account to save your resume, interview history, and performance metrics.
- **Performance Analytics**: Track your progress and get suggestions for improvement.

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui components
- **Backend**: Mock API endpoints (to be implemented with Express.js and MongoDB)
- **AI Integration**: Mock API for Groq LLM endpoints

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/           # Page components for each route
├── lib/             # Utility functions and helpers
├── App.tsx          # Main application component with routing
└── main.tsx         # Application entry point
```

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd interview-prep-platform
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Start the development server**
   ```
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080` to see the application.

## Future Enhancements

- Backend implementation with Express.js and MongoDB
- Real AI integration with Groq LLM for resume parsing and question generation
- Video recording and analysis of mock interviews
- Meeting scheduling for peer interview practice
- Industry-specific question banks

## License

MIT License

## Contributors

- Your Name
