
import React, { useState } from 'react';
import { generateBrandNames, generateLogo } from '../services/gemini';
import { Loader2, Check, Wand2, Image as ImageIcon } from 'lucide-react';
import VoiceInput from './VoiceInput';

const BrandGenerator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState('');
  const [values, setValues] = useState('');
  const [audience, setAudience] = useState('');
  const [loadingNames, setLoadingNames] = useState(false);
  const [loadingLogo, setLoadingLogo] = useState(false);
  const [names, setNames] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState('');
  const [logo, setLogo] = useState<string | null>(null);

  const handleGenerateNames = async () => {
    setLoadingNames(true);
    try {
      const res = await generateBrandNames(industry, values.split(','), audience);
      setNames(res);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingNames(false);
    }
  };

  const handleGenerateLogo = async () => {
    if (!selectedName) return;
    setLoadingLogo(true);
    try {
      const res = await generateLogo(selectedName, industry, 'modern minimalist');
      setLogo(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Brand Identity Creator</h2>
        <p className="text-slate-600 mt-2 text-xl font-semibold">Let's craft your brand from scratch with generative intelligence.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 py-6 text-center text-base font-black transition-all ${
                step >= s ? 'text-indigo-800 border-b-4 border-indigo-700' : 'text-slate-400'
              }`}
            >
              STEP {s}: {s === 1 ? 'CONCEPT' : s === 2 ? 'NAMING' : 'VISUALS'}
            </div>
          ))}
        </div>

        <div className="p-10">
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">
                  Industry / Niche
                  <VoiceInput onTranscript={(t) => setIndustry(prev => prev ? prev + ' ' + t : t)} />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sustainable Fashion, AI Tech"
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-slate-900 font-bold text-lg"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">
                  Brand Values
                  <VoiceInput onTranscript={(t) => setValues(prev => prev ? prev + ', ' + t : t)} />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Innovation, Trust, Minimalist"
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-slate-900 font-bold text-lg"
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                />
              </div>
              <div>
                <label className="flex items-center justify-between text-sm font-bold text-slate-800 mb-2 uppercase tracking-widest">
                  Target Audience
                  <VoiceInput onTranscript={(t) => setAudience(prev => prev ? prev + ' ' + t : t)} />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gen Z environmentalists"
                  className="w-full px-5 py-4 rounded-xl border-2 border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none text-slate-900 font-bold text-lg"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerateNames}
                disabled={loadingNames || !industry}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center space-x-3 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100"
              >
                {loadingNames ? <Loader2 className="animate-spin" /> : <Wand2 size={24} />}
                <span>Generate Brand Names</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {names.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedName(name)}
                    className={`p-8 rounded-2xl border-2 text-left transition-all group ${
                      selectedName === name 
                        ? 'border-indigo-600 bg-indigo-50 ring-4 ring-indigo-50' 
                        : 'border-slate-200 hover:border-indigo-300 bg-white shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-2xl font-black tracking-tight transition-colors ${selectedName === name ? 'text-indigo-800' : 'text-slate-900 group-hover:text-indigo-700'}`}>{name}</span>
                      {selectedName === name && <Check className="text-indigo-600" size={28} strokeWidth={3} />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-5 rounded-2xl font-bold text-slate-800 border-2 border-slate-300 hover:bg-slate-50 transition-all"
                >
                  Back to Concept
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedName}
                  className="flex-[2] bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xl shadow-indigo-100"
                >
                  Continue to Visual Identity
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-10 flex flex-col items-center py-6">
              <div className="text-center">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">Master Brand Identity</p>
                <h3 className="text-6xl font-black text-indigo-700 tracking-tighter italic">{selectedName}</h3>
              </div>

              {logo ? (
                <div className="relative group">
                  <img src={logo} alt="Generated Logo" className="w-80 h-80 rounded-3xl shadow-2xl border-4 border-white" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-3xl transition-all backdrop-blur-sm">
                    <button 
                      onClick={handleGenerateLogo}
                      className="bg-white text-slate-900 px-8 py-3 rounded-xl font-black flex items-center space-x-2 transform scale-90 group-hover:scale-100 transition-transform"
                    >
                      <Loader2 className={loadingLogo ? 'animate-spin' : ''} size={20} />
                      <span>Regenerate Visuals</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-80 h-80 border-4 border-dashed border-slate-300 rounded-3xl flex flex-col items-center justify-center bg-slate-50 text-slate-400">
                  <ImageIcon size={64} className="mb-4 opacity-20" />
                  <p className="font-bold text-lg">No visual asset generated</p>
                </div>
              )}

              <button
                onClick={handleGenerateLogo}
                disabled={loadingLogo}
                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-2xl flex items-center space-x-3 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-2xl shadow-indigo-200"
              >
                {loadingLogo ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={32} />}
                <span>{logo ? 'Refine Master Logo' : 'Generate AI Visuals'}</span>
              </button>

              <div className="grid grid-cols-2 gap-6 w-full pt-12 border-t border-slate-100">
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Industry</span>
                  <p className="font-black text-slate-900 text-xl mt-1 tracking-tight">{industry}</p>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Style System</span>
                  <p className="font-black text-slate-900 text-xl mt-1 tracking-tight">Modern Minimalist</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrandGenerator;
