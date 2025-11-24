import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionCategory, UserAttempt, AIAnalysisReport, Language, ToeicPart, Difficulty, MixedModeRatios } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-3-pro-preview";

// --- Schemas ---

const part5Schema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionText: { type: Type.STRING, description: "The sentence with a blank (________)." },
          options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "4 options." },
          correctAnswerIndex: { type: Type.INTEGER },
          explanation: { type: Type.STRING },
          category: { type: Type.STRING, enum: [QuestionCategory.GRAMMAR, QuestionCategory.VOCABULARY, QuestionCategory.PREPOSITIONS, QuestionCategory.VERB_TENSE] }
        },
        required: ["questionText", "options", "correctAnswerIndex", "explanation", "category"]
      }
    }
  }
};

const part6Schema = {
  type: Type.OBJECT,
  properties: {
    sets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          passageText: { type: Type.STRING, description: "A complete business text (Email, Letter, Memo) approx 120-150 words." },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING, description: "The question asking to fill the blank. Usually 'Select the best word for the blank'." },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                category: { type: Type.STRING, enum: [QuestionCategory.VOCABULARY, QuestionCategory.GRAMMAR, QuestionCategory.BUSINESS_PHRASE] }
              },
              required: ["questionText", "options", "correctAnswerIndex", "explanation", "category"]
            }
          }
        },
        required: ["passageText", "questions"]
      }
    }
  }
};

const part7Schema = {
  type: Type.OBJECT,
  properties: {
    sets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          passageText: { type: Type.STRING, description: "A realistic business document (Email with headers, Article with title, Advertisement). Length: 150-250 words." },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                questionText: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                category: { type: Type.STRING, enum: [QuestionCategory.MAIN_IDEA, QuestionCategory.DETAIL, QuestionCategory.INFERENCE, QuestionCategory.VOCAB_IN_CONTEXT] }
              },
              required: ["questionText", "options", "correctAnswerIndex", "explanation", "category"]
            }
          }
        },
        required: ["passageText", "questions"]
      }
    }
  }
};

// --- Helpers ---

const getLangInstruction = (language: Language) => {
  return language === 'zh' 
    ? "IMPORTANT: Provide the 'explanation' field in Simplified Chinese (简体中文). The 'questionText', 'passageText', and 'options' MUST remain in English."
    : language === 'ja'
    ? "IMPORTANT: Provide the 'explanation' field in Japanese (日本語). The 'questionText', 'passageText', and 'options' MUST remain in English."
    : "Provide the 'explanation' field in English.";
};

// --- Generators ---

const generatePart5Questions = async (count: number, difficulty: Difficulty, language: Language, weakCategories: string[]): Promise<Question[]> => {
  if (count <= 0) return [];
  
  const prompt = `
    Generate ${count} TOEIC Part 5 (Incomplete Sentences) questions.
    Difficulty: ${difficulty}.
    ${getLangInstruction(language)}
    ${weakCategories.length > 0 ? `Focus on: ${weakCategories.join(', ')}.` : ''}
    
    CRITICAL DESIGN RULES:
    1. Context must be strictly GLOBAL BUSINESS (Office, HR, Travel, Marketing, Finance).
    2. Sentences must be formal. No casual slang.
    3. Distractors must be plausible. Use 'Word Families' (e.g. compete, competition, competitive) or 'Similar Meanings' for vocabulary questions.
    4. Focus on high-frequency TOEIC grammar: Gerunds/Infinitives, Pronouns, Conjunctions (Despite/Although), Verb Tenses.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: part5Schema, temperature: 0.7 }
    });
    
    const parsed = JSON.parse(response.text || "{}");
    return (parsed.questions || []).map((q: any) => ({
      ...q,
      id: crypto.randomUUID(),
      part: 'Part 5',
      difficulty
    }));
  } catch (e) {
    console.error("Part 5 Gen Error", e);
    return [];
  }
};

const generatePart6Questions = async (count: number, difficulty: Difficulty, language: Language): Promise<Question[]> => {
  if (count <= 0) return [];

  const setsNeeded = Math.ceil(count / 3); // Approx 3 questions per set
  
  const prompt = `
    Generate ${setsNeeded} TOEIC Part 6 (Text Completion) sets.
    Difficulty: ${difficulty}.
    ${getLangInstruction(language)}

    CRITICAL DESIGN RULES:
    1. Each passage must be a complete Email, Memo, Letter, or Notice (approx 120-150 words).
    2. The text must flow logically. 
    3. Blanks must test: 
       - Context-dependent vocabulary (not just grammar).
       - Verb tenses based on time markers in the text.
       - Linking words (However, Therefore, Furthermore).
    4. Include headers for emails (To: / From: / Subject:).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: part6Schema, temperature: 0.7 }
    });
    
    const parsed = JSON.parse(response.text || "{}");
    const flatQuestions: Question[] = [];
    
    if (parsed.sets) {
      parsed.sets.forEach((set: any) => {
        set.questions.forEach((q: any) => {
          if (flatQuestions.length < count) {
            flatQuestions.push({
              id: crypto.randomUUID(),
              ...q,
              passageText: set.passageText,
              part: 'Part 6',
              difficulty
            });
          }
        });
      });
    }
    return flatQuestions;
  } catch (e) {
    console.error("Part 6 Gen Error", e);
    return [];
  }
};

const generatePart7Questions = async (count: number, difficulty: Difficulty, language: Language): Promise<Question[]> => {
  if (count <= 0) return [];
  
  const setsNeeded = Math.max(1, Math.ceil(count / 3)); // Approx 2-3 questions per passage

  const prompt = `
    Generate ${setsNeeded} TOEIC Part 7 (Reading Comprehension) sets.
    Difficulty: ${difficulty}.
    ${getLangInstruction(language)}

    CRITICAL DESIGN RULES:
    1. PASSAGE TYPE: Mix of Emails, Internal Memos, Advertisements, Articles, or Text Message Chains.
    2. LENGTH: Passages must be substantial (approx 150-250 words). NOT short paragraphs.
    3. FORMATTING: Include visual cues in the text like "Subject: New Policy", "Date: March 10", "Article Title".
    4. QUESTIONS:
       - 1 Question on MAIN PURPOSE ("What is the purpose of the email?").
       - 1-2 Questions on DETAILS ("When will the event take place?").
       - 1 Question on INFERENCE ("What is suggested about Ms. Tanaka?").
    5. DISTRACTORS: Must use "synonyms" in the text vs "keywords" in the wrong answers to trick the user (Paraphrasing is key in TOEIC).
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: { responseMimeType: "application/json", responseSchema: part7Schema, temperature: 0.7 }
    });
    
    const parsed = JSON.parse(response.text || "{}");
    const flatQuestions: Question[] = [];
    
    if (parsed.sets) {
      parsed.sets.forEach((set: any) => {
        set.questions.forEach((q: any) => {
          if (flatQuestions.length < count) {
            flatQuestions.push({
              id: crypto.randomUUID(),
              ...q,
              passageText: set.passageText,
              part: 'Part 7',
              difficulty
            });
          }
        });
      });
    }
    return flatQuestions;
  } catch (e) {
    console.error("Part 7 Gen Error", e);
    return [];
  }
};

// --- Main Export ---

export const generateQuestions = async (
  totalCount: number = 5,
  weakCategories: string[] = [],
  language: Language = 'zh',
  targetPart: ToeicPart | 'mixed' = 'mixed',
  difficulty: Difficulty = 'Medium',
  mixedRatios: MixedModeRatios = { part5: 40, part6: 30, part7: 30 }
): Promise<Question[]> => {

  let p5Count = 0;
  let p6Count = 0;
  let p7Count = 0;

  if (targetPart === 'mixed') {
    // Calculate distribution based on percentages
    p5Count = Math.round(totalCount * (mixedRatios.part5 / 100));
    p6Count = Math.round(totalCount * (mixedRatios.part6 / 100));
    // Assign remainder to Part 7 to ensure total matches (handling rounding)
    p7Count = totalCount - p5Count - p6Count;
    // Safety check if ratios are weird or count is small
    if (p7Count < 0) p7Count = 0;
  } else if (targetPart === 'Part 5') {
    p5Count = totalCount;
  } else if (targetPart === 'Part 6') {
    p6Count = totalCount;
  } else if (targetPart === 'Part 7') {
    p7Count = totalCount;
  }

  // Parallel Execution
  const promises = [];
  if (p5Count > 0) promises.push(generatePart5Questions(p5Count, difficulty, language, weakCategories));
  if (p6Count > 0) promises.push(generatePart6Questions(p6Count, difficulty, language));
  if (p7Count > 0) promises.push(generatePart7Questions(p7Count, difficulty, language));

  const results = await Promise.all(promises);
  
  return results.flat();
};

export const generateCoachingReport = async (attempts: UserAttempt[], language: Language = 'zh'): Promise<AIAnalysisReport> => {
  const recentAttempts = attempts.slice(-50);
  
  const langInstruction = language === 'zh' 
    ? "Generate output in Simplified Chinese."
    : language === 'ja'
    ? "Generate output in Japanese."
    : "Generate output in English.";

  const prompt = `
    Analyze TOEIC practice data.
    Data: ${JSON.stringify(recentAttempts)}
    ${langInstruction}
    Provide:
    1. Overall score (0-100).
    2. Top 3 Strengths & Weaknesses.
    3. Study plan (max 3 sentences).
    4. Recommended focus.
    5. Skill Radar (0-100) for: Grammar, Vocabulary, Reading, Time Management, Business Logic.
  `;

  const reportSchema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.INTEGER },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      studyPlan: { type: Type.STRING },
      recommendedFocus: { type: Type.STRING },
      skillRadar: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            skill: { type: Type.STRING },
            score: { type: Type.INTEGER },
            description: { type: Type.STRING }
          }
        }
      }
    }
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: reportSchema
      }
    });
    const parsed = JSON.parse(response.text || "{}");
    return { ...parsed, generatedAt: Date.now() };
  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("Failed to generate coaching report");
  }
};
