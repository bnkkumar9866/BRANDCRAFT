
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  className?: string;
  isTextArea?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, className = "", isTextArea = false }) => {
  const [isListening, setIsListening] = useState(false);
  const [browserSupportsSpeech, setBrowserSupportsSpeech] = useState(true);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupportsSpeech(false);
    }
  }, []);

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.start();
  };

  if (!browserSupportsSpeech) return null;

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`p-2 transition-all rounded-lg flex items-center justify-center ${
        isListening 
          ? 'bg-red-100 text-red-600 animate-pulse' 
          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
      } ${className}`}
      title={isListening ? "Listening..." : "Speak input"}
    >
      {isListening ? <MicOff size={18} /> : <Mic size={18} />}
    </button>
  );
};

export default VoiceInput;
