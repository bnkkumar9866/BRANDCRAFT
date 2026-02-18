
import React, { useState } from 'react';
import { generateMarketingContent } from '../services/gemini';
import { Loader2, Copy, Send, Sparkles } from 'lucide-react';
import VoiceInput from './VoiceInput';

const ContentAutomation: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [contentType, setContentType] = useState('Instagram Post Caption');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const contentTypes = [
    'Instagram Post Caption',
    'LinkedIn Thought Leadership Post',
    'Product Launch Email',
    'Brand Tagline Ideas',
    'Blog Post Outline',
    'Press Release Summary',
    'TikTok Script (Trending Style)',
    'YouTube Video Description',
    'Slogan & Catchphrase',
    'Brand Mission Statement',
    'Core Values Manifest',
    'Facebook Ad Copy',
    'Google Search Ad Text',
    'Twitter Thread (Educational)',
    'Weekly Newsletter Template',
    'Company About Us Page',
    'FAQ Page Content',
    'Customer Welcome Series'
  ];

  const handleGenerate = async () => {
    if (!brandName) return;
    setLoading(true);
    try {
      const res = await generateMarketingContent(brandName, contentType);
      setResult(res || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 space-y-10">
        <h2 className="text-4xl font-black text-slate-900 flex items-center space-x-4 tracking-tighter">
          <div className="p-3 bg-indigo-100 text-indigo-700 rounded-2xl">
            <Sparkles size={32} />
          </div>
          <span>Content Hub</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="flex items-center justify-between text-xs font-black text-slate-500 mb-3 uppercase tracking-widest">
              Brand Identifier
              <VoiceInput onTranscript={(t) => setBrandName(t)} />
            </label>
            <input
              type="text"
              placeholder="e.g. Acme Corp"
              className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none text-slate-900 font-black text-2xl placeholder:text-slate-200 bg-slate-50/30 transition-all"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-500 mb-3 uppercase tracking-widest">Asset Format</label>
            <div className="relative">
              <select
                className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none bg-slate-50/30 text-slate-900 font-black text-2xl cursor-pointer appearance-none transition-all pr-12"
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
              >
                {contentTypes.map((type) => (
                  <option key={type} value={type} className="text-slate-900 font-bold">
                    {type}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !brandName}
          className="w-full bg-indigo-700 text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center space-x-3 hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-indigo-100"
        >
          {loading ? <Loader2 className="animate-spin" size={28} /> : <Send size={28} />}
          <span>Generate Copy</span>
        </button>

        {result && (
          <div className="mt-12 space-y-6 pt-10 border-t-4 border-slate-50">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-xl">Generated Intelligence</h3>
              <button 
                onClick={copyToClipboard}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-700 hover:text-white px-6 py-3 rounded-2xl flex items-center space-x-2 text-sm font-black transition-all"
              >
                <Copy size={20} />
                <span>Copy to Clipboard</span>
              </button>
            </div>
            <div className="p-10 bg-slate-900 text-indigo-50 rounded-[2rem] whitespace-pre-wrap font-bold text-2xl leading-relaxed shadow-2xl selection:bg-indigo-500 selection:text-white">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAutomation;
