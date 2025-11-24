export enum QuestionCategory {
  GRAMMAR = 'Grammar',
  VOCABULARY = 'Vocabulary',
  PREPOSITIONS = 'Prepositions',
  VERB_TENSE = 'Verb Tense',
  BUSINESS_PHRASE = 'Business Phrases',
  READING_LOGIC = 'Reading Logic',
  // Part 7 Specific
  MAIN_IDEA = 'Main Idea',
  DETAIL = 'Detail',
  INFERENCE = 'Inference',
  VOCAB_IN_CONTEXT = 'Vocabulary in Context'
}

export type ToeicPart = 'Part 5' | 'Part 6' | 'Part 7';

export type Language = 'zh' | 'ja' | 'en';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface MixedModeRatios {
  part5: number;
  part6: number;
  part7: number;
}

export interface Question {
  id: string;
  questionText: string;
  passageText?: string; // For Part 6/7 context
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  category: QuestionCategory;
  difficulty: Difficulty;
  part: ToeicPart;
}

export interface UserAttempt {
  questionId: string;
  timestamp: number;
  isCorrect: boolean;
  selectedOptionIndex: number;
  category: QuestionCategory;
  difficulty: Difficulty;
  part: ToeicPart;
}

export interface SkillScore {
  skill: string;
  score: number; // 0-100
  description: string;
}

export interface AIAnalysisReport {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  studyPlan: string;
  recommendedFocus: string;
  skillRadar: SkillScore[];
  generatedAt: number;
}

export type ViewState = 'home' | 'practice' | 'stats' | 'coach';