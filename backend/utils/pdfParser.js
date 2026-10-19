const fs = require('fs');
const pdf = require('pdf-parse');

const parsePDF = async (filePath) => {
  const dataBuffer = fs.readFileSync(filePath);
  try {
    const data = await pdf(dataBuffer);
    
    // Clean text: Remove non-printable characters and excess whitespace
    let cleanedText = data.text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ') // Keep only standard printable ASCII
      .replace(/\s+/g, ' ')               // Collapse multiple spaces/newlines
      .trim();

    // Limit to 15,000 characters to ensure AI focus and prevent 503 timeouts
    if (cleanedText.length > 15000) {
      cleanedText = cleanedText.substring(0, 15000) + '... (truncated)';
    }

    return cleanedText;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

module.exports = { parsePDF };
