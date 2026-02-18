
import React, { useState, useEffect } from 'react';
import { generateBrandNames, generateLogo } from '../services/gemini';
import { Loader2, Check, Wand2, Image as ImageIcon, Key } from 'lucide-react';
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
  const [logoSvg, setLogoSvg] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      }
    };
    checkKey();
  }, []);

  const handleOpenKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

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
      const res = await generateLogo(selectedName, industry, 'modern minimalist vector');
      setLogoSvg(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingLogo(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {!hasKey && (
        <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
              <Key size={24} />
            </div>
            <div>
              <p className="font-black text-amber-900">API Key Selection Required</p>
              <p className="text-sm text-amber-700 font-medium leading-relaxed">
                Premium generation features require a selected API key. 
                <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline ml-1 font-bold">Learn about billing</a>
              </p>
            </div>
          </div>
          <button 
            onClick={handleOpenKey}
            className="bg-amber-600 text-white px-6 py-3 rounded-xl font-black shadow-lg hover:bg-amber-700 transition-all whitespace-nowrap"
          >
            Select API Key
          </button>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Brand Identity Creator</h2>
        <p className="text-slate-600 mt-3 text-xl font-bold italic opacity-80">Forging unique identities through vector-perfect intelligence.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-100 overflow-hidden">
        <div className="flex border-b-4 border-slate-100 bg-slate-50/50">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`flex-1 py-8 text-center text-sm font-black transition-all tracking-widest ${
                step >= s ? 'text-indigo-800 bg-white border-b-8 border-indigo-700' : 'text-slate-400'
              }`}
            >
              STEP {s}: {s === 1 ? 'CONCEPT' : s === 2 ? 'NAMING' : 'VISUALS'}
            </div>
          ))}
        </div>

        <div className="p-12">
          {step === 1 && (
            <div className="space-y-10">
              <div className="group">
                <label className="flex items-center justify-between text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">
                  Industry / Niche
                  <VoiceInput onTranscript={(t) => setIndustry(prev => prev ? prev + ' ' + t : t)} />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sustainable Fashion, AI Tech"
                  className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none text-slate-900 font-black text-2xl transition-all placeholder:text-slate-200 bg-slate-50/30"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div className="group">
                <label className="flex items-center justify-between text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">
                  Brand Values
                  <VoiceInput onTranscript={(t) => setValues(prev => prev ? prev + ', ' + t : t)} />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Innovation, Trust, Minimalist"
                  className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none text-slate-900 font-black text-2xl transition-all placeholder:text-slate-200 bg-slate-50/30"
                  value={values}
                  onChange={(e) => setValues(e.target.value)}
                />
              </div>
              <div className="group">
                <label className="flex items-center justify-between text-xs font-black text-slate-500 mb-3 uppercase tracking-[0.2em]">
                  Target Audience
                  <VoiceInput onTranscript={(t) => setAudience(prev => prev ? prev + ' ' + t : t)} />
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gen Z environmentalists"
                  className="w-full px-6 py-5 rounded-2xl border-4 border-slate-200 focus:border-indigo-600 outline-none text-slate-900 font-black text-2xl transition-all placeholder:text-slate-200 bg-slate-50/30"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <button
                onClick={handleGenerateNames}
                disabled={loadingNames || !industry}
                className="w-full bg-indigo-700 text-white py-6 rounded-3xl font-black text-2xl flex items-center justify-center space-x-3 hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-indigo-200 transform active:scale-95"
              >
                {loadingNames ? <Loader2 className="animate-spin" /> : <Wand2 size={28} />}
                <span>Forge Identity Concepts</span>
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {names.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedName(name)}
                    className={`p-10 rounded-3xl border-4 text-left transition-all ${
                      selectedName === name 
                        ? 'border-indigo-700 bg-indigo-50 shadow-xl' 
                        : 'border-slate-100 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`text-3xl font-black tracking-tighter ${selectedName === name ? 'text-indigo-900' : 'text-slate-900'}`}>{name}</span>
                      {selectedName === name && <div className="bg-indigo-700 p-1 rounded-full"><Check className="text-white" size={24} strokeWidth={4} /></div>}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-6 pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-6 rounded-3xl font-black text-slate-900 border-4 border-slate-200 hover:bg-slate-50 transition-all text-xl"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!selectedName}
                  className="flex-[2] bg-indigo-700 text-white py-6 rounded-3xl font-black text-2xl hover:bg-black disabled:opacity-50 transition-all shadow-xl shadow-indigo-200"
                >
                  Confirm & Visualize
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-12 flex flex-col items-center py-6">
              <div className="text-center">
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4">Master Identity System</p>
                <h3 className="text-7xl font-black text-indigo-800 tracking-tighter italic border-b-8 border-indigo-100 inline-block">{selectedName}</h3>
              </div>

              <div className="w-full max-w-md aspect-square bg-slate-50 rounded-[3rem] border-4 border-slate-200 flex items-center justify-center p-12 overflow-hidden shadow-inner relative group">
                {loadingLogo ? (
                   <div className="flex flex-col items-center space-y-4">
                     <Loader2 className="animate-spin text-indigo-600" size={64} strokeWidth={3} />
                     <p className="font-black text-indigo-900 uppercase tracking-widest text-xs">Vectorizing...</p>
                   </div>
                ) : logoSvg ? (
                  <div 
                    className="w-full h-full flex items-center justify-center svg-container"
                    dangerouslySetInnerHTML={{ __html: logoSvg }}
                  />
                ) : (
                  <div className="text-center opacity-20">
                    <ImageIcon size={120} className="mx-auto mb-4" />
                    <p className="font-black text-2xl">Awaiting Assets</p>
                  </div>
                )}
                
                {logoSvg && !loadingLogo && (
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm rounded-[3rem]">
                    <button 
                      onClick={handleGenerateLogo}
                      className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xl shadow-2xl transform scale-90 group-hover:scale-100 transition-all"
                    >
                      Regenerate SVG
                    </button>
                  </div>
                )}
              </div>

              {!logoSvg && (
                <button
                  onClick={handleGenerateLogo}
                  disabled={loadingLogo}
                  className="bg-indigo-700 text-white px-16 py-7 rounded-3xl font-black text-3xl flex items-center space-x-4 hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-indigo-200 transform hover:scale-105 active:scale-95"
                >
                  {loadingLogo ? <Loader2 className="animate-spin" size={32} /> : <Wand2 size={40} />}
                  <span>Generate Vector Logo</span>
                </button>
              )}

              <div className="grid grid-cols-2 gap-8 w-full pt-16 border-t-4 border-slate-50">
                <div className="p-8 bg-slate-50 rounded-3xl border-4 border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Core Domain</span>
                  <p className="font-black text-slate-900 text-2xl mt-2">{industry}</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-3xl border-4 border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset Format</span>
                  <p className="font-black text-slate-900 text-2xl mt-2 tracking-tighter">Scalable Vector (SVG)</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .svg-container svg {
          width: 100%;
          height: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
};

export default BrandGenerator;
