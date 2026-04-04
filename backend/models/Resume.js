const mongojs = require('mongoose');

const resumeSchema = mongojs.Schema(
  {
    user: {
      type: mongojs.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    jobDescription: {
      type: String,
    },
    analysisResults: {
      atsScore: Number,
      matchPercentage: Number,
      matchingSkills: [String],
      missingKeywords: [String],
      skillGaps: [String],
      suggestions: [String],
      improvedBulletPoints: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongojs.model('Resume', resumeSchema);
module.exports = Resume;
