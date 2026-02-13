
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import BrandGenerator from './components/BrandGenerator';
import ContentAutomation from './components/ContentAutomation';
import SentimentAnalysis from './components/SentimentAnalysis';
import Assistant from './components/Assistant';
import { View } from './types';
import { Github, ExternalLink, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard onGetStarted={() => setCurrentView(View.IDENTITY)} />;
      case View.IDENTITY:
        return <BrandGenerator />;
      case View.CONTENT:
        return <ContentAutomation />;
      case View.SENTIMENT:
        return <SentimentAnalysis />;
      case View.ASSISTANT:
        return <Assistant />;
      default:
        return <Dashboard onGetStarted={() => setCurrentView(View.IDENTITY)} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              BrandCraft System
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-semibold text-slate-500">Global API Mesh Active</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Github size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-900">John Doe</p>
                <p className="text-[10px] text-slate-500">Founder Account</p>
              </div>
              <img src="https://picsum.photos/seed/brandcraft/100/100" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="Avatar" />
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
};

const Dashboard: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="space-y-12 py-12">
      <div className="max-w-3xl">
        <h1 className="text-6xl font-black text-slate-900 leading-tight">
          Your brand, <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            accelerated by AI.
          </span>
        </h1>
        <p className="text-xl text-slate-500 mt-6 leading-relaxed">
          BrandCraft automates the entire lifecycle of brand creation—from naming and visual identity to marketing content and sentiment analysis.
        </p>
        <div className="flex space-x-4 mt-10">
          <button 
            onClick={onGetStarted}
            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold flex items-center space-x-2 hover:bg-indigo-700 transition-all transform hover:scale-105"
          >
            <Sparkles size={20} />
            <span>Create New Brand</span>
          </button>
          <button className="border border-slate-200 bg-white text-slate-600 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center space-x-2">
            <span>View Documentation</span>
            <ExternalLink size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: 'Brand Identity', desc: 'Generate unique names and high-fidelity logos in seconds.', stat: '2.4s Avg.', color: 'indigo' },
          { title: 'Social Content', desc: 'Craft engaging captions and emails tailored to your brand voice.', stat: 'Unlimited', color: 'purple' },
          { title: 'Sentiment Analysis', desc: 'Real-time analysis of customer feedback and social presence.', stat: '99.2% Acc.', color: 'emerald' },
        ].map((feat) => (
          <div key={feat.title} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 bg-${feat.color}-50 text-${feat.color}-600 rounded-xl flex items-center justify-center mb-6`}>
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h3>
            <p className="text-slate-500 text-sm mb-6">{feat.desc}</p>
            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance</span>
              <span className={`text-sm font-bold text-${feat.color}-600`}>{feat.stat}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-12 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Integrate with your workflow</h2>
            <p className="text-slate-400">Export your brand assets directly to Figma, Shopify, or WordPress with our seamless API connectors.</p>
          </div>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold whitespace-nowrap">
            Connect Integrations
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />
      </div>
    </div>
  );
};

export default App;
