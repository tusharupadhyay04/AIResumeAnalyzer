const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const ResumeSchema = new mongoose.Schema({
  text: String,
  originalName: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Resume = mongoose.model('Resume', ResumeSchema);

const checkResumes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Check last 5 resumes
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(5);
    
    if (resumes.length === 0) {
      console.log('No resumes found.');
    } else {
      resumes.forEach((r, i) => {
        const hash = crypto.createHash('md5').update(r.text || '').digest('hex');
        console.log(`\n--- Resume ${i+1}: ${r.originalName} ---`);
        console.log(`ID: ${r._id}`);
        console.log(`Text Length: ${r.text?.length || 0}`);
        console.log(`MD5 Hash: ${hash}`);
        console.log(`Snippet: "${r.text?.substring(0, 150).replace(/\n/g, ' ')}..."`);
      });
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
};

checkResumes();
