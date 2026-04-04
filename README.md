# AI Resume Analyzer System

A production-ready full-stack web application designed for placement preparation and ATS optimization. Users can upload their resumes, compare them with job descriptions, and receive AI-powered insights to improve their chances of getting shortlisted.

## 🚀 Key Features

- **Secure Authentication**: User signup/login with JWT and secure password hashing.
- **Smart Parsing**: Automated text extraction from PDF resumes.
- **AI Analysis Engine**: Compares resume text with job descriptions to identify:
  - Matching skills
  - Missing keywords
  - Skill gaps
- **ATS Scoring**: Real-time score generation based on resume-JD alignment.
- **Improved Content**: AI-generated bullet points to enhance your experience section.
- **Premium Dashboard**: Visual tracking of all previous analyses.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI**: OpenAI API (GPT-3.5 Turbo)

## 📦 Project Structure

```bash
AI resume/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   └── services/        # AI integration
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI
    │   ├── context/     # Auth state
    │   └── pages/       # Application views
    └── tailwind.config.js
```

## ⚙️ Installation

### Backend
```bash
cd backend
npm install
# Configure .env with MONGO_URI and OPENAI_API_KEY
node server.js
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Goal
Empower candidates to bridge the gap between their resumes and their dream jobs using cutting-edge AI.
