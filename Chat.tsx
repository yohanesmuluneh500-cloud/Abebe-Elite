import React, { useState, useRef, useEffect } from 'react';
import { chatWithCoach, generateSpeech } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { ChatMessage } from '../types';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'I am Abebe. What is holding you back from your goals? Ask me about form, recovery, or adjustments. Remember: I was forged by Yohanes Muluneh.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isVocalizing, setIsVocalizing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading, isVocalizing]);

  // Setup Web Speech API for Voice-In
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition not supported in this browser.");
        return;
      }
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = async (text: string) => {
    setIsVocalizing(true);
    try {
      const pcmData = await generateSpeech(text);
      if (pcmData) {
        await audioService.playPcm(pcmData);
      }
    } catch (err) {
      console.error("Vocalization failed", err);
    } finally {
      setIsVocalizing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const response = await chatWithCoach(currentInput, messages);
      const coachReply = response || 'Coach is thinking...';
      setMessages(prev => [...prev, { role: 'model', text: coachReply }]);
      
      if (isVoiceMode) {
        speakText(coachReply);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: 'Error in transmission. Keep pushing, try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto glass rounded-xl overflow-hidden animate-in zoom-in duration-300">
      <div className="bg-zinc-800/80 p-4 border-b border-zinc-700 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
          <span className="font-oswald font-bold tracking-widest text-white">COACH ABEBE ONLINE</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsVoiceMode(!isVoiceMode)}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
              isVoiceMode ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
            }`}
            title="Auto-speak responses"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.85 14,18.71V20.77C18.03,19.86 21,16.28 21,12C21,7.72 18.03,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16.02C15.5,15.29 16.5,13.77 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
            </svg>
            VOICE MODE: {isVoiceMode ? 'ON' : 'OFF'}
          </button>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="text-zinc-500 hover:text-white text-[10px] font-bold uppercase tracking-widest"
          >
            RESET LOG
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`relative max-w-[85%] p-4 rounded-xl text-sm leading-relaxed group ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-900/10' 
                : 'bg-zinc-900 text-blue-50 border border-zinc-800 rounded-bl-none'
            }`}>
              {m.text}
              
              {m.role === 'model' && (
                <button 
                  onClick={() => speakText(m.text)}
                  className="absolute -right-10 top-2 p-2 text-blue-200/40 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all"
                  title="Listen to Abebe"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
        {isVocalizing && (
          <div className="flex justify-start">
            <span className="text-[10px] font-bold text-cyan-500 tracking-[0.2em] animate-pulse uppercase">Abebe is vocalizing...</span>
          </div>
        )}
      </div>

      <div className="p-4 bg-zinc-900/50 border-t border-zinc-800">
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? "Listening..." : "Ask Abebe a question..."}
              className={`w-full bg-zinc-900 border ${isListening ? 'border-cyan-500 ring-1 ring-cyan-500/20' : 'border-zinc-800'} rounded-lg pl-4 pr-12 py-3 text-white focus:border-blue-600 outline-none transition-all`}
            />
            <button
              onClick={toggleListening}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-zinc-500 hover:text-cyan-500'
              }`}
              title="Speak to coach"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-20a3 3 0 013 3v8a3 3 0 01-3 33 3 0 01-3-3V5a3 3 0 013-3z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 px-6 py-3 rounded-lg font-bold text-white transition-all shadow-lg shadow-blue-900/20"
          >
            SEND
          </button>
        </div>
        {isListening && <p className="text-[9px] text-cyan-500 font-bold mt-2 tracking-widest uppercase animate-pulse">Recording voice... Click mic to stop.</p>}
      </div>
    </div>
  );
};

export default Chat;