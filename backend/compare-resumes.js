const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const ResumeSchema = new mongoose.Schema({
  text: String,
  originalName: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Resume = mongoose.model('Resume', ResumeSchema);

const compareResumes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(10);
    
    const results = resumes.map(r => ({
      name: r.originalName,
      len: r.text?.length || 0,
      hash: crypto.createHash('md5').update(r.text || '').digest('hex').substring(0, 8),
      snippet: r.text?.substring(0, 50).trim()
    }));
    
    console.table(results);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

compareResumes();
