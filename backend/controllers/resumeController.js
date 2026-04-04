const Resume = require('../models/Resume');
const { parsePDF } = require('../utils/pdfParser');
const { analyzeWithAI } = require('../services/openaiService');
const fs = require('fs');
const path = require('path');

// @desc    Upload resume
// @route   POST /api/resume/upload
// @access  Private
const uploadResume = async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname;

  try {
    const text = await parsePDF(filePath);

    const resume = await Resume.create({
      user: req.user.id,
      filename: req.file.filename,
      originalName: originalName,
      text: text,
    });

    res.status(201).json(resume);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Error processing resume');
  }
};

// @desc    Get all user resumes
// @route   GET /api/resume
// @access  Private
const getResumes = async (req, res) => {
  const resumes = await Resume.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(resumes);
};

// @desc    Get resume by ID
// @route   GET /api/resume/:id
// @access  Private
const getResumeById = async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  if (resume.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  res.json(resume);
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private
const deleteResume = async (req, res) => {
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  if (resume.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not authorized');
  }

  // Delete file from storage
  const filePath = path.join(__dirname, '../uploads', resume.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await resume.deleteOne();
  res.json({ message: 'Resume removed' });
};

// @desc    Analyze resume with AI
// @route   POST /api/resume/analyze/:id
// @access  Private
const analyzeResume = async (req, res) => {
  const { jobDescription } = req.body;
  const resume = await Resume.findById(req.params.id);

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found');
  }

  if (!jobDescription) {
    res.status(400);
    throw new Error('Please provide a job description');
  }

  try {
    const analysis = await analyzeWithAI(resume.text, jobDescription);

    resume.jobDescription = jobDescription;
    resume.analysisResults = analysis;
    await resume.save();

    res.json(resume);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(error.message || 'AI Analysis failed');
  }
};

module.exports = {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  analyzeResume,
};
