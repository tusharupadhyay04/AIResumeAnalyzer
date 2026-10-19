const Groq = require('groq-sdk');

const PROMPT_TEMPLATE = (resumeText, jobDescription) => `
You are a strict ATS (Applicant Tracking System) evaluation engine.
Your job is to evaluate ONLY the specific resume provided below against the job description.

Resume Text (raw extraction from PDF — evaluate exactly what is written here):
---
${resumeText.substring(0, 6000)}
---

Job Description:
---
${jobDescription.substring(0, 2000)}
---

STRICT RULES — READ CAREFULLY:
1. ONLY reference skills, tools, technologies, companies, and experiences that are LITERALLY PRESENT in the resume text above. Do NOT invent, assume, or hallucinate anything.
2. "matchingSkills" = keywords from the JD that are ALSO explicitly found in THIS resume's text (word-for-word or close synonym). If a skill is not in the resume, it CANNOT be in matchingSkills.
3. "missingKeywords" = important keywords from the JD that are completely ABSENT from this resume.
4. "skillGaps" = broader competency areas mentioned in the JD that this specific resume lacks evidence of.
5. "atsScore" and "matchPercentage" must reflect the ACTUAL overlap between this specific resume and the JD — two different resumes with the same JD MUST produce different scores.
6. "suggestions" = concrete, actionable advice based on what THIS resume is missing.
7. "improvedBulletPoints" = rewrite 3-5 actual bullet points FROM THIS RESUME using stronger action verbs and quantified impact — quote from the resume text.
8. Return ONLY a valid JSON object (no markdown, no backticks, no extra text).

JSON format:
{
  "atsScore": <number 0-100>,
  "matchPercentage": <number 0-100>,
  "matchingSkills": [<ONLY skills literally in this resume AND the JD>],
  "missingKeywords": [<JD keywords absent from this resume>],
  "skillGaps": [<competency areas in JD not evidenced in this resume>],
  "suggestions": [<specific advice for THIS candidate>],
  "improvedBulletPoints": [<3-5 rewritten bullet points from THIS resume>]
}
`;

// ─── Helper: parse & sanitize JSON from AI response ──────────────────────────
const parseAnalysis = (text) => {
  text = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in AI response');
  const analysis = JSON.parse(match[0]);
  if (analysis.atsScore !== undefined)
    analysis.atsScore = parseInt(String(analysis.atsScore).replace(/[^0-9]/g, ''), 10);
  if (analysis.matchPercentage !== undefined)
    analysis.matchPercentage = parseInt(String(analysis.matchPercentage).replace(/[^0-9]/g, ''), 10);
  return analysis;
};

// ─── Groq-only AI Analysis ────────────────────────────────────────────────────
const analyzeWithAI = async (resumeText, jobDescription) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in .env');

  const groq = new Groq({ apiKey });
  const prompt = PROMPT_TEMPLATE(resumeText, jobDescription);

  // Models confirmed live on this account (queried via /v1/models)
  const GROQ_MODELS = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b',
    'allam-2-7b',
  ];

  let lastError;
  for (const model of GROQ_MODELS) {
    try {
      console.log(`🔄 Trying Groq model: ${model}`);
      const completion = await groq.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 2048,
      });
      const text = completion.choices[0]?.message?.content;
      if (!text) throw new Error('Empty response from Groq');
      const analysis = parseAnalysis(text);
      console.log(`✅ Groq succeeded with model: ${model}`);
      return analysis;
    } catch (error) {
      lastError = error;
      const status = error.status || error.response?.status;
      const msg = error.message || error.response?.data?.error?.message;
      console.log(`❌ Groq [${model}] failed [${status || 'error'}]: ${msg}`);
      if (status === 401 || status === 403) {
        console.error('🔑 Groq API key is invalid or unauthorized.');
        break;
      }
    }
  }

  const errMsg = lastError?.message || 'Unknown error';
  throw new Error(`AI Analysis failed. Groq error: ${errMsg}`);
};

module.exports = { analyzeWithAI };
