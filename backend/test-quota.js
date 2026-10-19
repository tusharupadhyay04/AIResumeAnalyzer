const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const testSpecificModels = async () => {
  const modelsToTest = [
    'gemini-pro-latest',
    'gemini-flash-latest',
    'gemini-3-flash-preview',
    'gemini-2.0-flash-exp',
    'gemini-2.0-flash',
    'gemini-2.0-flash-001'
  ];

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  for (const modelName of modelsToTest) {
    console.log(`Testing ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('hi');
      const response = await result.response;
      console.log(`✅ ${modelName} worked!`);
      return modelName;
    } catch (error) {
      console.log(`❌ ${modelName} failed: ${error.message}`);
    }
  }
};

testSpecificModels().then(workingModel => {
  if (workingModel) {
    console.log(`BEST_MODEL: ${workingModel}`);
  } else {
    console.log('Final check: no models worked.');
    // List all names again just to be sure
  }
});
