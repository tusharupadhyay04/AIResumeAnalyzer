const { GoogleGenerativeAI } = require('@google/generative-ai');

const analyzeWithAI = async (resumeText, jobDescription) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.0-pro" });

  const prompt = `
    You are an expert ATS (Applicant Tracking System). 
    Analyze the following resume text against the provided job description.
    
    Resume Text:
    ${resumeText}
    
    Job Description:
    ${jobDescription}
    
    Provide the analysis in a clean JSON format (no backticks) with:
    atsScore: (number)
    matchPercentage: (number)
    matchingSkills: (array)
    missingKeywords: (array)
    skillGaps: (array)
    suggestions: (array)
    improvedBulletPoints: (array)
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini Error:', error.message);
    
    // Throw a specific error that the frontend can display
    if (error.message.includes('location is not supported')) {
      throw new Error('Gemini AI is not available in your region. Please use an OpenAI Key or a VPN.');
    } else {
      throw new Error(`AI Analysis failed: ${error.message}`);
    }
  }
};

module.exports = { analyzeWithAI };
