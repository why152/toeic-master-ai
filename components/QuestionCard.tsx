import React, { useState } from 'react';
import { Question, Language } from '../types';
import { CheckCircle, XCircle, HelpCircle, BookOpen } from 'lucide-react';
import { getTranslation } from '../translations';

interface QuestionCardProps {
  question: Question;
  onAnswer: (index: number) => void;
  isSubmitting: boolean;
  language: Language;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question, onAnswer, isSubmitting, language }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const t = getTranslation(language);

  const handleSelect = (index: number) => {
    if (hasSubmitted) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null || hasSubmitted) return;
    setHasSubmitted(true);
    onAnswer(selected);
  };

  React.useEffect(() => {
    setSelected(null);
    setHasSubmitted(false);
  }, [question.id]);

  const getOptionStyle = (index: number) => {
    const base = "w-full p-4 text-left border rounded-xl transition-all duration-200 flex justify-between items-center group";
    
    if (hasSubmitted) {
      if (index === question.correctAnswerIndex) {
        return `${base} bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500 dark:bg-green-900/30 dark:text-green-300 dark:border-green-500`;
      }
      if (index === selected && index !== question.correctAnswerIndex) {
        return `${base} bg-red-50 border-red-500 text-red-800 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500`;
      }
      return `${base} bg-white border-slate-200 opacity-60 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500`;
    }

    if (selected === index) {
      return `${base} bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-900 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-400`;
    }

    return `${base} bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 dark:hover:border-slate-500`;
  };

  const isReading = question.part === 'Part 7' && !!question.passageText;

  return (
    <div className={`w-full mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden ${isReading ? 'max-w-7xl' : 'max-w-2xl'}`}>
      
      <div className={`flex flex-col ${isReading ? 'lg:flex-row' : ''}`}>
        
        {/* Left Side: Reading Passage (Only for Part 7/6 if text exists) */}
        {isReading && (
          <div className="lg:w-1/2 bg-slate-50 dark:bg-slate-900/50 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-700">
             <div className="p-6 md:p-8 max-h-[400px] lg:max-h-[650px] overflow-y-auto custom-scrollbar">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.readingPassage}</span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="prose prose-slate dark:prose-invert prose-sm md:prose-base max-w-none font-serif leading-relaxed whitespace-pre-wrap text-slate-800 dark:text-slate-200">
                    {question.passageText}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Right Side: Question & Options */}
        <div className={`p-6 md:p-8 ${isReading ? 'lg:w-1/2 flex flex-col justify-center bg-white dark:bg-slate-800' : 'bg-white dark:bg-slate-800'}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold uppercase tracking-wider rounded-full">
                {question.part}
              </span>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider rounded-full">
                {question.category}
              </span>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full ${
              question.difficulty === 'Hard' ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300' :
              question.difficulty === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300' :
              'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
            }`}>
              {question.difficulty}
            </span>
          </div>

          <h3 className="text-lg md:text-xl font-medium text-slate-900 dark:text-white mb-8 leading-relaxed">
            {question.questionText}
          </h3>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={getOptionStyle(idx)}
                disabled={hasSubmitted || isSubmitting}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className={`w-8 h-8 flex shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    hasSubmitted && idx === question.correctAnswerIndex ? 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100' :
                    hasSubmitted && idx === selected && idx !== question.correctAnswerIndex ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100' :
                    selected === idx ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm md:text-base">{option}</span>
                </div>
                
                {hasSubmitted && idx === question.correctAnswerIndex && (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                )}
                {hasSubmitted && idx === selected && idx !== question.correctAnswerIndex && (
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {!hasSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selected === null}
              className="mt-8 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t.checkAnswer}
            </button>
          ) : (
            <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">{t.explanation}</h4>
                  <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};