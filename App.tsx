import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Question, UserAttempt, Language, ToeicPart, Difficulty, MixedModeRatios } from './types';
import { generateQuestions } from './services/geminiService';
import { QuestionCard } from './components/QuestionCard';
import { Dashboard } from './components/Dashboard';
import { AICoach } from './components/AICoach';
import { Button } from './components/Button';
import { LayoutDashboard, PenTool, BrainCircuit, ChevronRight, GraduationCap, Settings2, Moon, Sun, Sliders } from 'lucide-react';
import { getTranslation } from './translations';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('home');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<UserAttempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [targetCategories, setTargetCategories] = useState<string[]>([]);
  const [language, setLanguage] = useState<Language>('zh');
  
  // Configuration State
  const [selectedPart, setSelectedPart] = useState<ToeicPart | 'mixed'>('mixed');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [mixedRatios, setMixedRatios] = useState<MixedModeRatios>({ part5: 40, part6: 30, part7: 30 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const t = getTranslation(language);

  // Dark Mode Initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('toeic-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newVal = !prev;
      if (newVal) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('toeic-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('toeic-theme', 'light');
      }
      return newVal;
    });
  };

  // Load attempts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('toeic-attempts');
    if (saved) {
      try {
        setAttempts(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history");
      }
    }
  }, []);

  // Save attempts whenever they change
  useEffect(() => {
    localStorage.setItem('toeic-attempts', JSON.stringify(attempts));
  }, [attempts]);

  const loadQuestions = useCallback(async (forcedCategories: string[] = []) => {
    setLoading(true);
    setQuestions([]); 
    
    // Validate ratios sum to 100 if mixed (soft check, handled in service mostly but good for UI)
    const totalRatio = mixedRatios.part5 + mixedRatios.part6 + mixedRatios.part7;
    // Normalize if user messed up sliders, or just trust service logic (service handles normalization)
    
    const newQuestions = await generateQuestions(
      questionCount, 
      forcedCategories, 
      language, 
      selectedPart, 
      difficulty,
      mixedRatios
    );
    
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0);
    setLoading(false);
  }, [attempts, language, selectedPart, difficulty, questionCount, mixedRatios]);

  const startPractice = () => {
    setTargetCategories([]); // Reset targets for general practice
    setView('practice');
    // Only load if we don't have questions or if we are starting fresh from home
    loadQuestions([]);
  };

  const handleTargetedPractice = (categories: string[]) => {
    setTargetCategories(categories);
    setView('practice');
    loadQuestions(categories);
  };

  const handleAnswer = (selectedIndex: number) => {
    const currentQ = questions[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correctAnswerIndex;
    
    const attempt: UserAttempt = {
      questionId: currentQ.id,
      timestamp: Date.now(),
      isCorrect,
      selectedOptionIndex: selectedIndex,
      category: currentQ.category,
      difficulty: currentQ.difficulty,
      part: currentQ.part
    };

    setAttempts(prev => [...prev, attempt]);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      loadQuestions(targetCategories);
    }
  };

  const handleRatioChange = (part: keyof MixedModeRatios, val: number) => {
    setMixedRatios(prev => {
      const next = { ...prev, [part]: val };
      return next;
    });
  };

  const renderContent = () => {
    switch (view) {
      case 'home':
        const ratioSum = mixedRatios.part5 + mixedRatios.part6 + mixedRatios.part7;
        const isRatioValid = ratioSum === 100;

        return (
          <div className="max-w-5xl mx-auto pt-16 px-4 text-center animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="mb-6 inline-flex items-center justify-center p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30">
              <GraduationCap className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
              {t.title}
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              {t.subtitle}
            </p>

            {/* Configuration Panel */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 max-w-3xl mx-auto mb-10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
              
              <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-white font-bold border-b border-slate-100 dark:border-slate-700 pb-4">
                 <Settings2 className="w-5 h-5 text-indigo-500" />
                 <span>{t.configTitle}</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Part Selection */}
                <div>
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">{t.selectPart}</label>
                  <div className="flex flex-col gap-2">
                    {['mixed', 'Part 5', 'Part 6', 'Part 7'].map((p) => (
                      <button 
                        key={p}
                        onClick={() => setSelectedPart(p as any)}
                        className={`px-4 py-3 rounded-xl text-sm font-medium border text-left transition-all ${selectedPart === p ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:border-indigo-300'}`}
                      >
                        {t.partSelector[p as keyof typeof t.partSelector]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Difficulty Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">{t.selectDifficulty}</label>
                    <div className="flex flex-wrap gap-2">
                       {['Easy', 'Medium', 'Hard'].map((d) => (
                         <button
                           key={d}
                           onClick={() => setDifficulty(d as Difficulty)}
                           className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${difficulty === d ? 
                             (d === 'Hard' ? 'bg-red-500 text-white border-red-500' : d === 'Medium' ? 'bg-amber-500 text-white border-amber-500' : 'bg-green-500 text-white border-green-500') 
                             : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'}`}
                         >
                           {t.difficultySelector[d as keyof typeof t.difficultySelector]}
                         </button>
                       ))}
                    </div>
                  </div>

                  {/* Question Count Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">{t.questionCount}</label>
                    <div className="flex gap-2">
                       {[5, 10, 15, 20].map((c) => (
                         <button
                           key={c}
                           onClick={() => setQuestionCount(c)}
                           className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${questionCount === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700'}`}
                         >
                           {c}
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mixed Mode Ratios */}
              {selectedPart === 'mixed' && (
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 relative z-10 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-4">
                     <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-2">
                       <Sliders className="w-4 h-4" /> {t.mixedRatios}
                     </label>
                     <span className={`text-xs font-bold ${isRatioValid ? 'text-green-500' : 'text-red-500'}`}>
                        {ratioSum}% / 100%
                     </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {['part5', 'part6', 'part7'].map((p) => (
                      <div key={p}>
                        <div className="flex justify-between mb-2">
                           <span className="text-xs font-medium text-slate-700 dark:text-slate-300 uppercase">{p.replace('part', 'Part ')}</span>
                           <span className="text-xs text-slate-500">{mixedRatios[p as keyof MixedModeRatios]}%</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="100" 
                          step="10"
                          value={mixedRatios[p as keyof MixedModeRatios]}
                          onChange={(e) => handleRatioChange(p as keyof MixedModeRatios, parseInt(e.target.value))}
                          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                      </div>
                    ))}
                  </div>
                  {!isRatioValid && <p className="text-xs text-red-500 mt-2 text-center">{t.ratioTotalError}</p>}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={startPractice} 
                disabled={selectedPart === 'mixed' && !isRatioValid}
                className="py-4 px-10 text-lg shadow-xl shadow-blue-500/30 w-full sm:w-auto rounded-2xl hover:scale-105 transition-transform"
              >
                {t.startPractice}
              </Button>
              <Button variant="outline" onClick={() => setView('stats')} className="py-4 px-10 text-lg w-full sm:w-auto rounded-2xl bg-white dark:bg-transparent">
                {t.viewStats}
              </Button>
            </div>
            
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <PenTool className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{t.practiceMode}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.practiceDesc}</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{t.stats}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.statsDesc}</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">{t.aiCoach}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{t.coachDesc}</p>
              </div>
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="max-w-7xl mx-auto pt-6 px-4 pb-20">
            {targetCategories.length > 0 && (
              <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 px-4 py-3 rounded-xl flex items-center gap-2 text-sm font-medium max-w-3xl mx-auto animate-in slide-in-from-top-2">
                 <BrainCircuit className="w-5 h-5" />
                 {t.trainWeakness} {targetCategories.join(', ')}
              </div>
            )}

            {loading ? (
              <div className="text-center py-32 animate-in fade-in duration-700">
                <div className="relative w-16 h-16 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t.loading}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {t.poweredBy}
                </p>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                  <span>{t.question} {currentQuestionIndex + 1} / {questions.length}</span>
                  <span>{t.totalAnswered}: {attempts.length}</span>
                </div>
                
                <QuestionCard 
                  question={questions[currentQuestionIndex]} 
                  onAnswer={handleAnswer}
                  isSubmitting={false}
                  language={language}
                />
                
                <div className="max-w-7xl mx-auto flex justify-end pt-6">
                  <Button onClick={nextQuestion} variant="secondary" className="px-8 py-3 text-base shadow-sm">
                    {currentQuestionIndex === questions.length - 1 ? t.generateNewSet : t.nextQuestion} 
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">{t.noQuestions}</p>
                <Button onClick={() => loadQuestions(targetCategories)}>{t.retry}</Button>
              </div>
            )}
          </div>
        );

      case 'stats':
        return <Dashboard attempts={attempts} language={language} isDarkMode={isDarkMode} />;
        
      case 'coach':
        return <AICoach attempts={attempts} onStartTargetedPractice={handleTargetedPractice} language={language} isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300`}>
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setView('home')}>
            <div className="bg-blue-600 group-hover:bg-blue-700 transition-colors text-white p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
               <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white tracking-tight hidden sm:inline">TOEIC Master</span>
          </div>
          
          <div className="flex items-center gap-3 md:gap-4">
            <nav className="flex gap-1">
              <button 
                onClick={() => startPractice()}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'practice' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {t.practiceMode}
              </button>
              <button 
                onClick={() => setView('stats')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'stats' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {t.stats}
              </button>
              <button 
                onClick={() => setView('coach')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'coach' ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
              >
                {t.coach}
              </button>
            </nav>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>

            {/* Language Switcher */}
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
               <button onClick={() => setLanguage('zh')} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${language === 'zh' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>中</button>
               <button onClick={() => setLanguage('ja')} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${language === 'ja' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>JP</button>
               <button onClick={() => setLanguage('en')} className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${language === 'en' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}>EN</button>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={t.theme.toggle}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-xs mb-2">
            &copy; {new Date().getFullYear()} TOEIC Master AI. {t.poweredBy}.
          </p>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] leading-relaxed max-w-2xl mx-auto">
            {t.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;