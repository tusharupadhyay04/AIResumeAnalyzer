const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'frame-src': ["'self'"],
      'object-src': ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('AI Resume Analyzer API is running...');
});

// Static file serving for uploaded resumes (PDFs)
app.use('/uploads', express.static('uploads'));

// Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));
// Resume Routes
app.use('/api/resume', require('./routes/resumeRoutes'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
