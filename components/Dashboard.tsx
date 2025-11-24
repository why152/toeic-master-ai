import React, { useMemo } from 'react';
import { UserAttempt, QuestionCategory, Language } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { getTranslation } from '../translations';

interface DashboardProps {
  attempts: UserAttempt[];
  language: Language;
  isDarkMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ attempts, language, isDarkMode }) => {
  const t = getTranslation(language);
  
  const stats = useMemo(() => {
    const total = attempts.length;
    const correct = attempts.filter(a => a.isCorrect).length;
    const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100);

    // Category breakdown
    const categoryData = Object.values(QuestionCategory).map(cat => {
      const catAttempts = attempts.filter(a => a.category === cat);
      const catTotal = catAttempts.length;
      const catCorrect = catAttempts.filter(a => a.isCorrect).length;
      const catAccuracy = catTotal === 0 ? 0 : Math.round((catCorrect / catTotal) * 100);
      return {
        name: cat,
        accuracy: catAccuracy,
        total: catTotal
      };
    }).filter(d => d.total > 0);

    // Recent trend (last 10 sessions/chunks)
    // Group attempts into chunks of 5 for smoothing
    const chunkSize = 5;
    const trendData = [];
    for (let i = 0; i < attempts.length; i += chunkSize) {
      const chunk = attempts.slice(i, i + chunkSize);
      const chunkCorrect = chunk.filter(a => a.isCorrect).length;
      trendData.push({
        name: `${Math.floor(i / chunkSize) + 1}`,
        accuracy: Math.round((chunkCorrect / chunk.length) * 100)
      });
    }

    return { total, correct, accuracy, categoryData, trendData: trendData.slice(-10) };
  }, [attempts]);

  const textColor = isDarkMode ? '#cbd5e1' : '#475569';
  const gridColor = isDarkMode ? '#334155' : '#e2e8f0';
  const tooltipBg = isDarkMode ? '#1e293b' : '#ffffff';
  const tooltipText = isDarkMode ? '#f1f5f9' : '#1e293b';

  if (attempts.length === 0) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        <p className="text-lg">{t.noData}</p>
        <p className="text-sm">{t.startToSeeStats}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase">{t.totalAnswered}</p>
          <p className="text-4xl font-bold text-slate-900 dark:text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase">{t.accuracy}</p>
          <p className={`text-4xl font-bold mt-2 ${
            stats.accuracy >= 80 ? 'text-green-600 dark:text-green-400' : stats.accuracy >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'
          }`}>{stats.accuracy}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase">{t.correctAnswers}</p>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.correct}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Performance */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">{t.performanceByCategory}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData} layout="vertical" margin={{ left: 40, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: textColor}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText }}
                   itemStyle={{ color: tooltipText }}
                   formatter={(value: number) => [`${value}%`, t.accuracy]}
                />
                <Bar dataKey="accuracy" radius={[0, 4, 4, 0]} barSize={20}>
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.accuracy > 70 ? '#22c55e' : entry.accuracy > 40 ? '#eab308' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Trend */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-6">{t.trend}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                <XAxis dataKey="name" tick={{fontSize: 10, fill: textColor}} tickLine={false} axisLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{fontSize: 12, fill: textColor}} tickLine={false} axisLine={false} />
                <Tooltip 
                   contentStyle={{ borderRadius: '8px', backgroundColor: tooltipBg, borderColor: gridColor, color: tooltipText }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};