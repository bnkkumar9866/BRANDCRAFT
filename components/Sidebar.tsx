
import React from 'react';
import { View } from '../types';
import { LayoutDashboard, Sparkles, FileText, BarChart3, MessageSquareText } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.IDENTITY, label: 'Brand Identity', icon: Sparkles },
    { id: View.CONTENT, label: 'Content Hub', icon: FileText },
    { id: View.SENTIMENT, label: 'Sentiment AI', icon: BarChart3 },
    { id: View.ASSISTANT, label: 'AI Assistant', icon: MessageSquareText },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          BrandCraft
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-100">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider mb-1">Power User</p>
          <p className="text-sm opacity-90">Gemini 3.0 Enabled</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
