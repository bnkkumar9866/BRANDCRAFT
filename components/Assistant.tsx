
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
    <div className="max-w-4xl mx-auto h-[calc(100vh-14rem)] flex flex-col bg-white rounded-[2.5rem] shadow-2xl border-4 border-slate-100 overflow-hidden">
      <div className="p-8 border-b-4 border-slate-50 flex items-center justify-between bg-white">
        <div className="flex items-center space-x-6">
          <div className="w-14 h-14 bg-indigo-700 rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <Bot size={32} strokeWidth={3} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-2xl tracking-tighter">Strategist v3.0</h3>
            <p className="text-[10px] text-emerald-600 font-black uppercase tracking-[0.2em]">Neural Engine Online</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-10 space-y-10 bg-slate-50/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] flex items-start gap-6 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                m.role === 'user' ? 'bg-indigo-700 text-white' : 'bg-white border-4 border-white text-slate-900'
              }`}>
                {m.role === 'user' ? <User size={24} strokeWidth={3} /> : <Bot size={24} strokeWidth={3} />}
              </div>
              <div className={`p-8 rounded-[2rem] text-xl leading-relaxed shadow-xl ${
                m.role === 'user' 
                  ? 'bg-indigo-700 text-white rounded-tr-none font-bold' 
                  : 'bg-white text-slate-900 rounded-tl-none font-bold'
              }`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-4 bg-white px-8 py-5 rounded-3xl shadow-xl border-4 border-slate-50">
              <Loader2 className="animate-spin text-indigo-700" size={24} strokeWidth={4} />
              <span className="text-sm text-slate-900 font-black uppercase tracking-widest">Processing Intelligence...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-8 bg-white border-t-4 border-slate-50">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              className="w-full px-8 py-6 rounded-3xl border-4 border-slate-200 focus:border-indigo-700 outline-none font-black text-slate-900 text-2xl shadow-inner bg-slate-50/50 transition-all placeholder:text-slate-200"
              placeholder="Query Strategy Engine..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          <VoiceInput 
            onTranscript={(t) => handleSend(t)} 
            className="w-20 h-20 rounded-3xl bg-slate-50 border-4 border-slate-100 shadow-xl hover:border-indigo-700 transition-all"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !input.trim()}
            className="w-20 h-20 bg-indigo-700 text-white rounded-3xl flex items-center justify-center hover:bg-black transition-all disabled:opacity-50 shadow-2xl transform active:scale-90"
          >
            <Send size={32} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
