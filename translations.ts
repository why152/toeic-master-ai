import { Language } from './types';

export const TRANSLATIONS = {
  zh: {
    title: "TOEIC 大师 AI",
    subtitle: "AI 驱动的托业真题模拟与专项训练平台",
    startPractice: "开始刷题",
    viewStats: "查看统计",
    aiCoach: "AI 教练",
    practiceMode: "练习模式",
    practiceDesc: "覆盖 Part 5, 6 & 7，AI 持续生成适配您水平的练习题。",
    stats: "统计",
    statsDesc: "通过详细的正确率和分类数据分析，可视化您的学习进度。",
    coach: "教练",
    question: "问题",
    totalAnswered: "已答题数",
    checkAnswer: "提交答案",
    explanation: "解析",
    nextQuestion: "下一题",
    generateNewSet: "生成新题组",
    loading: "AI 正在生成题目...",
    generatingTargeted: "正在生成专项强化题目...",
    retry: "重试",
    noQuestions: "暂无题目",
    
    // Config
    configTitle: "练习设置",
    selectPart: "选择题型",
    selectDifficulty: "选择难度",
    questionCount: "题目数量",
    mixedRatios: "混合模式比例设置",
    ratioTotalError: "比例总和必须为 100%",
    partSelector: {
      mixed: "混合模式",
      'Part 5': "Part 5 (句子填空)",
      'Part 6': "Part 6 (段落填空)",
      'Part 7': "Part 7 (阅读理解)"
    },
    difficultySelector: {
      Easy: "简单",
      Medium: "中等",
      Hard: "困难"
    },
    theme: {
      light: "浅色",
      dark: "深色",
      toggle: "切换主题"
    },

    // Reading
    readingPassage: "阅读文章",

    // Stats
    overview: "概览",
    accuracy: "正确率",
    correctAnswers: "回答正确",
    performanceByCategory: "各题型表现",
    trend: "近期趋势 (最近 10 组)",
    noData: "暂无数据",
    startToSeeStats: "开始练习以查看分析数据！",

    // Coach
    coachTitle: "能力分析报告",
    coachSubtitle: "基于 AI 的托业能力深度解析",
    coachDesc: "我们的 AI 引擎会分析您的答题习惯，生成多维度的能力雷达图，帮您精准定位薄弱环节。",
    generateReport: "生成能力报告",
    refreshReport: "刷新分析",
    trainWeakness: "专项训练：",
    trainNow: "立即特训",
    radarTitle: "能力雷达",
    overallMastery: "综合掌握度",
    strengths: "优势",
    weaknesses: "待提升",
    recommendedFocus: "建议重点",
    startSession: "开始训练",
    errorLessAttempts: "请至少完成 5 道题以生成准确的分析报告。",
    
    // Footer
    disclaimer: "免责声明：本网站所有题目与解析均由人工智能 (Gemini 3.0 Pro) 生成，仅供练习参考。TOEIC® 是美国教育考试服务中心 (ETS) 的注册商标。本产品未经 ETS 审核或批准。",
    poweredBy: "Powered by Google Gemini",
  },
  ja: {
    title: "TOEIC マスター AI",
    subtitle: "AIによるTOEIC実戦問題・弱点分析プラットフォーム",
    startPractice: "練習開始",
    viewStats: "統計を見る",
    aiCoach: "AIコーチ",
    practiceMode: "練習モード",
    practiceDesc: "Part 5、6、7に対応。AIがあなたのレベルに合わせて無限に問題を生成します。",
    stats: "統計",
    statsDesc: "正答率や分野別の詳細な分析で、学習の進捗を可視化します。",
    coach: "コーチ",
    question: "問題",
    totalAnswered: "回答数",
    checkAnswer: "回答する",
    explanation: "解説",
    nextQuestion: "次の問題",
    generateNewSet: "新しい問題を作成",
    loading: "AIが問題を生成中...",
    generatingTargeted: "弱点克服問題を生成中...",
    retry: "再試行",
    noQuestions: "問題がありません",
    
    // Config
    configTitle: "練習設定",
    selectPart: "パート選択",
    selectDifficulty: "難易度選択",
    questionCount: "問題数",
    mixedRatios: "ミックスモード配分設定",
    ratioTotalError: "合計は100%である必要があります",
    partSelector: {
      mixed: "ミックス",
      'Part 5': "Part 5 (短文穴埋め)",
      'Part 6': "Part 6 (長文穴埋め)",
      'Part 7': "Part 7 (読解問題)"
    },
    difficultySelector: {
      Easy: "初級",
      Medium: "中級",
      Hard: "上級"
    },
    theme: {
      light: "ライト",
      dark: "ダーク",
      toggle: "テーマ切替"
    },

    // Reading
    readingPassage: "読解テキスト",

    // Stats
    overview: "概要",
    accuracy: "正答率",
    correctAnswers: "正解数",
    performanceByCategory: "分野別成績",
    trend: "最近の傾向 (過去10セット)",
    noData: "データがありません",
    startToSeeStats: "練習を始めてデータを分析しましょう！",

    // Coach
    coachTitle: "能力分析レポート",
    coachSubtitle: "AIによるTOEICスコアアップ戦略",
    coachDesc: "AIがあなたの回答パターンを分析し、多角的な能力レーダーチャートを作成。弱点を特定し、効率的にスコアアップを目指します。",
    generateReport: "レポート作成",
    refreshReport: "分析を更新",
    trainWeakness: "弱点克服：",
    trainNow: "今すぐ特訓",
    radarTitle: "能力レーダー",
    overallMastery: "総合習熟度",
    strengths: "強み",
    weaknesses: "弱点",
    recommendedFocus: "推奨学習エリア",
    startSession: "セッション開始",
    errorLessAttempts: "正確な分析のため、少なくとも5問回答してください。",

    // Footer
    disclaimer: "免責事項：当サイトの問題および解説はAI (Gemini 3.0 Pro) によって生成されたものであり、練習のみを目的としています。TOEIC®はETSの登録商標です。この製品はETSによって検討または承認されたものではありません。",
    poweredBy: "Powered by Google Gemini",
  },
  en: {
    title: "TOEIC Master AI",
    subtitle: "AI-Powered TOEIC Practice & Analysis Platform",
    startPractice: "Start Practice",
    viewStats: "View Statistics",
    aiCoach: "AI Coach",
    practiceMode: "Practice",
    practiceDesc: "Target Part 5, 6 & 7 with endless AI-generated questions tailored to your level.",
    stats: "Stats",
    statsDesc: "Visualize your progress with detailed analytics on accuracy and category performance.",
    coach: "Coach",
    question: "Question",
    totalAnswered: "Total Answered",
    checkAnswer: "Check Answer",
    explanation: "Explanation",
    nextQuestion: "Next Question",
    generateNewSet: "Generate New Set",
    loading: "AI is generating questions...",
    generatingTargeted: "Generating targeted practice...",
    retry: "Retry",
    noQuestions: "No questions available",
    
    // Config
    configTitle: "Configuration",
    selectPart: "Select Part",
    selectDifficulty: "Select Difficulty",
    questionCount: "Number of Questions",
    mixedRatios: "Mixed Mode Distribution",
    ratioTotalError: "Total must equal 100%",
    partSelector: {
      mixed: "Mixed Mode",
      'Part 5': "Part 5 (Incomplete Sentences)",
      'Part 6': "Part 6 (Text Completion)",
      'Part 7': "Part 7 (Reading Comprehension)"
    },
    difficultySelector: {
      Easy: "Easy",
      Medium: "Medium",
      Hard: "Hard"
    },
    theme: {
      light: "Light",
      dark: "Dark",
      toggle: "Toggle Theme"
    },

    // Reading
    readingPassage: "Reading Passage",

    // Stats
    overview: "Overview",
    accuracy: "Accuracy",
    correctAnswers: "Correct Answers",
    performanceByCategory: "Performance by Category",
    trend: "Recent Trend (Last 10 Sets)",
    noData: "No data yet",
    startToSeeStats: "Start practicing to see your analytics!",

    // Coach
    coachTitle: "Proficiency Analysis",
    coachSubtitle: "AI-driven insights into your performance",
    coachDesc: "Our AI engine analyzes your response patterns to generate a multi-dimensional capability map. Identify your blind spots and fix them instantly.",
    generateReport: "Generate Report",
    refreshReport: "Refresh Analysis",
    trainWeakness: "Train Weakness:",
    trainNow: "Train Now",
    radarTitle: "Ability Radar",
    overallMastery: "Overall Mastery",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    recommendedFocus: "Recommended Focus",
    startSession: "Start Session",
    errorLessAttempts: "Please complete at least 5 questions to generate an accurate analysis.",

    // Footer
    disclaimer: "Disclaimer: All content is generated by AI (Gemini 3.0 Pro) for practice purposes only. TOEIC® is a registered trademark of ETS. This product is not endorsed or approved by ETS.",
    poweredBy: "Powered by Google Gemini",
  }
};

export const getTranslation = (lang: Language) => {
  return TRANSLATIONS[lang] || TRANSLATIONS['en'];
};