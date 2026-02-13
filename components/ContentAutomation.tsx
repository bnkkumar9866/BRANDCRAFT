
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
    alert('Copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-200 space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-3">
          <Sparkles className="text-indigo-600" />
          <span>Content Automation Hub</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">
              Brand Name
              <VoiceInput onTranscript={(t) => setBrandName(t)} />
            </label>
            <input
              type="text"
              placeholder="Enter your brand name"
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-slate-900 font-bold placeholder:text-slate-400 transition-all"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">Content Format</label>
            <select
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none bg-white text-slate-900 font-bold cursor-pointer appearance-none transition-all"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25rem' }}
            >
              {contentTypes.map((type) => (
                <option key={type} value={type} className="text-slate-900 font-semibold py-2">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !brandName}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-black text-xl flex items-center justify-center space-x-2 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 transform active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={24} />}
          <span>Generate Premium Copy</span>
        </button>

        {result && (
          <div className="mt-8 space-y-4 pt-6 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-slate-900 uppercase tracking-tighter text-lg">Optimized Output</h3>
              <button 
                onClick={copyToClipboard}
                className="bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-black transition-all shadow-sm"
              >
                <Copy size={16} />
                <span>Copy Content</span>
              </button>
            </div>
            <div className="p-8 bg-slate-50 border-2 border-slate-200 rounded-2xl whitespace-pre-wrap text-slate-900 font-semibold text-lg leading-relaxed shadow-inner">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAutomation;
