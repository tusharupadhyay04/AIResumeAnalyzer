const mongoose = require('mongoose');
const crypto = require('crypto');
require('dotenv').config();

const ResumeSchema = new mongoose.Schema({
  text: String,
  originalName: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const Resume = mongoose.model('Resume', ResumeSchema);

const listResumes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const resumes = await Resume.find().sort({ createdAt: -1 }).limit(10);
    
    resumes.forEach((r, i) => {
      const hash = crypto.createHash('md5').update(r.text || '').digest('hex').substring(0, 8);
      console.log(`${r.originalName} | Length: ${r.text?.length} | Hash: ${hash}`);
    });
    
    await mongoose.disconnect();
  } catch (err) { console.error(err); }
};

listResumes();
