
import React, { useState } from 'react';
import { analyzeSentiment } from '../services/gemini';
import { SentimentResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, Search, BarChart4 } from 'lucide-react';
import VoiceInput from './VoiceInput';

const SentimentAnalysis: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SentimentResult | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await analyzeSentiment(text);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result ? [
    { name: 'Positive', value: result.breakdown.positive, color: '#10b981' },
    { name: 'Neutral', value: result.breakdown.neutral, color: '#64748b' },
    { name: 'Negative', value: result.breakdown.negative, color: '#ef4444' },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-slate-200">
        <div className="flex items-center space-x-4 mb-10">
          <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-700 shadow-sm">
            <BarChart4 size={32} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sentiment Intelligence</h2>
            <p className="text-slate-600 font-semibold text-lg">Decode the emotional pulse of your brand communication.</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <label className="flex items-center justify-between text-sm font-bold text-slate-800 uppercase tracking-widest">
            Brand Mentions or Feedback
            <VoiceInput onTranscript={(t) => setText(prev => prev ? prev + ' ' + t : t)} />
          </label>
          <textarea
            className="w-full p-8 h-56 rounded-3xl border-2 border-slate-200 focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none resize-none font-bold text-slate-900 text-xl shadow-inner bg-slate-50/30 leading-relaxed"
            placeholder="Paste your brand reviews or social mentions here for deep analysis..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            onClick={handleAnalyze}
            disabled={loading || !text.trim()}
            className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black text-2xl flex items-center justify-center space-x-3 hover:bg-black disabled:opacity-50 transition-all shadow-xl"
          >
            {loading ? <Loader2 className="animate-spin" size={28} /> : <Search size={28} strokeWidth={3} />}
            <span>Initiate Analysis</span>
          </button>
        </div>

        {result && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center border-t border-slate-100 pt-16">
            <div className="space-y-10">
              <div>
                <span className={`px-6 py-2 rounded-xl text-sm font-black uppercase tracking-widest shadow-md ${
                  result.label.toLowerCase().includes('pos') ? 'bg-emerald-100 text-emerald-800' : 
                  result.label.toLowerCase().includes('neg') ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-800'
                }`}>
                  Signal: {result.label}
                </span>
                <p className="mt-10 text-slate-900 text-2xl font-black leading-tight border-l-8 border-indigo-600 pl-10 italic tracking-tight">
                  "{result.explanation}"
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100">
                  <p className="text-xs text-emerald-600 font-black uppercase tracking-widest mb-1">Pos</p>
                  <p className="text-4xl font-black text-emerald-800">{result.breakdown.positive}%</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                  <p className="text-xs text-slate-500 font-black uppercase tracking-widest mb-1">Neu</p>
                  <p className="text-4xl font-black text-slate-900">{result.breakdown.neutral}%</p>
                </div>
                <div className="p-6 bg-rose-50 rounded-2xl border-2 border-rose-100">
                  <p className="text-xs text-rose-600 font-black uppercase tracking-widest mb-1">Neg</p>
                  <p className="text-4xl font-black text-rose-800">{result.breakdown.negative}%</p>
                </div>
              </div>
            </div>

            <div className="h-80 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: '900', fontSize: '14px' }}
                  />
                  <Legend verticalAlign="bottom" height={40} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</span>
                <span className="text-5xl font-black text-slate-900 tracking-tighter">{result.score.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SentimentAnalysis;
