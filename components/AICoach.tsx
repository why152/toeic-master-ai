import React, { useState } from 'react';
import { UserAttempt, AIAnalysisReport, Language } from '../types';
import { generateCoachingReport } from '../services/geminiService';
import { Button } from './Button';
import { Brain, Target, TrendingUp, AlertTriangle, RefreshCw, Zap, ArrowRight } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getTranslation } from '../translations';

interface AICoachProps {
  attempts: UserAttempt[];
  onStartTargetedPractice: (weaknesses: string[]) => void;
  language: Language;
  isDarkMode: boolean;
}

export const AICoach: React.FC<AICoachProps> = ({ attempts, onStartTargetedPractice, language, isDarkMode }) => {
  const [report, setReport] = useState<AIAnalysisReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const t = getTranslation(language);

  const handleGenerateReport = async () => {
    if (attempts.length < 5) {
      setError(t.errorLessAttempts);
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const data = await generateCoachingReport(attempts, language);
      setReport(data);
    } catch (e) {
      setError("Failed to connect to AI Coach.");
    } finally {
      setLoading(false);
    }
  };

  const handleTargetedPractice = () => {
    if (report && report.weaknesses.length > 0) {
      onStartTargetedPractice(report.weaknesses);
    }
  };
  
  const textColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-indigo-950 dark:to-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Brain className="w-64 h-64 text-white" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-500/20 rounded-xl backdrop-blur-sm border border-indigo-500/30">
              <Brain className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{t.coachTitle}</h2>
              <p className="text-slate-400">{t.coachSubtitle}</p>
            </div>
          </div>

          <p className="mb-8 text-slate-300 max-w-2xl text-lg leading-relaxed">
            {t.coachDesc}
          </p>

          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={handleGenerateReport} 
              isLoading={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white border-none px-6 py-3 shadow-lg shadow-indigo-900/50"
            >
              {report ? <><RefreshCw className="w-4 h-4" /> {t.refreshReport}</> : t.generateReport}
            </Button>
            
            {report && (
              <Button 
                onClick={handleTargetedPractice}
                className="bg-white text-slate-900 hover:bg-slate-100 px-6 py-3"
              >
                <Zap className="w-4 h-4 text-amber-500" /> 
                {t.trainNow}
              </Button>
            )}
          </div>
          
          {error && <p className="mt-4 text-red-300 bg-red-900/30 py-2 px-4 rounded-lg text-sm inline-block border border-red-800/50">{error}</p>}
        </div>
      </div>

      {report && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Radar Chart Section */}
          <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col">
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {t.radarTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{t.coachSubtitle}</p>
            
            <div className="flex-1 min-h-[300px] flex items-center justify-center -ml-4">
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={report.skillRadar}>
                  <PolarGrid stroke={gridColor} />
                  <PolarAngleAxis dataKey="skill" tick={{ fill: textColor, fontSize: 10, fontWeight: 600 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="Skill Level"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: tooltipBg }}
                    itemStyle={{ color: '#4338ca', fontWeight: 'bold' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-2">
              {report.skillRadar.map((s, i) => (
                <div key={i} className="text-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{s.skill}</div>
                  <div className={`font-bold ${s.score > 70 ? 'text-green-600 dark:text-green-400' : s.score > 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    {s.score}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis & Plan Section */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Overall Score */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
               <div className="relative">
                 <h3 className="text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider text-xs mb-4">{t.overallMastery}</h3>
                 <div className="flex items-end gap-2">
                   <span className="text-5xl font-extrabold text-slate-900 dark:text-white">{report.overallScore}</span>
                   <span className="text-xl font-medium text-slate-400 mb-2">/ 100</span>
                 </div>
                 <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden">
                   <div 
                      className="h-full rounded-full transition-all duration-1000 ease-out bg-gradient-to-r from-indigo-500 to-purple-500"
                      style={{ width: `${report.overallScore}%` }}
                   ></div>
                 </div>
                 <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                   {report.studyPlan}
                 </p>
               </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{t.strengths}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {report.strengths.map((str, i) => (
                    <span key={i} className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium border border-green-100 dark:border-green-800">
                      {str}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">{t.weaknesses}</h3>
                </div>
                <div className="space-y-3">
                  {report.weaknesses.map((weak, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
                      <span className="text-sm text-amber-900 dark:text-amber-300 font-medium">{weak}</span>
                      <Button 
                        variant="secondary" 
                        className="h-8 px-3 text-xs bg-white dark:bg-amber-900/50 text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900 border-none"
                        onClick={() => onStartTargetedPractice([weak])}
                      >
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommended Focus */}
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg flex items-center justify-between">
               <div>
                 <h4 className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">{t.recommendedFocus}</h4>
                 <p className="text-xl font-bold">{report.recommendedFocus}</p>
               </div>
               <Button 
                 className="bg-white text-indigo-700 hover:bg-indigo-50 border-none whitespace-nowrap"
                 onClick={handleTargetedPractice}
               >
                 {t.startSession}
               </Button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
};