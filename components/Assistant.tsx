
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatMessage } from '../types';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import VoiceInput from './VoiceInput';

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hello! I am your BrandCraft Branding Assistant. How can I help you build your brand today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: 'You are BrandCraft AI, a world-class brand strategist and marketing expert. You help entrepreneurs create names, logos, strategies, and content. Be professional, creative, and concise. Use bold text for key points and structured lists to ensure maximum legibility.',
        }
      });

      const response = await chat.sendMessage({ message: textToSend });
      const botMessage: ChatMessage = { role: 'model', text: response.text || 'Sorry, I encountered an error.' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'An error occurred while connecting to the AI.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <Bot size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-xl tracking-tight">Brand Strategist</h3>
            <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">Active • Gemini 3.0 Pro</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex items-start space-x-4 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                m.role === 'user' ? 'bg-indigo-100 text-indigo-700' : 'bg-white border-2 border-slate-100 text-slate-700'
              }`}>
                {m.role === 'user' ? <User size={20} strokeWidth={3} /> : <Bot size={20} strokeWidth={3} />}
              </div>
              <div className={`p-6 rounded-3xl text-base leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none font-bold' 
                  : 'bg-white text-slate-900 border-2 border-slate-100 rounded-tl-none font-semibold'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-3 bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-indigo-600" size={20} />
              <span className="text-sm text-slate-700 font-black uppercase tracking-widest">Strategizing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-white border-t border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full pl-6 pr-6 py-5 rounded-2xl border-2 border-slate-200 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none font-black text-slate-900 text-lg shadow-sm transition-all"
              placeholder="Ask anything about your brand strategy..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <VoiceInput 
            onTranscript={(t) => handleSend(t)} 
            className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-sm hover:border-indigo-200 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-xl shadow-indigo-100 transform active:scale-95"
          >
            <Send size={28} strokeWidth={3} />
          </button>
        </div>
        <p className="text-[11px] text-center text-slate-400 mt-4 font-black uppercase tracking-widest">
          BrandCraft Intelligence • Professional Grade Advisor
        </p>
      </div>
    </div>
  );
};

export default Assistant;
