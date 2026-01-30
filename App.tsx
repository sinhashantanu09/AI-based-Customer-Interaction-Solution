
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import { Message, Sender } from './types';
import { ironLadyAI } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      setIsLoading(true);
      try {
        const initialGreeting = await ironLadyAI.initChat();
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          sender: Sender.AI,
          text: initialGreeting,
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error("Initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const currentInput = inputValue.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: currentInput,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ironLadyAI.sendMessage(currentInput);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: "I'm sorry, I'm experiencing some connectivity issues. Could you please try again?",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    // Submit using the current value immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: Sender.USER,
      text: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    ironLadyAI.sendMessage(text).then(response => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: Sender.AI,
        text: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <Header />
      
      <main className="flex-1 overflow-hidden flex flex-col items-center">
        <div className="w-full max-w-3xl flex-1 flex flex-col relative bg-white md:my-4 md:rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          
          {/* Message List */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-2 scroll-smooth"
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="flex flex-row items-center gap-2 px-4 py-3 bg-indigo-50 rounded-2xl rounded-tl-none border border-indigo-100 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.15s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                  </div>
                  <span className="text-xs font-medium text-indigo-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Replies for initial step ONLY to get started */}
          {messages.length === 1 && !isLoading && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-wrap gap-2 justify-center animate-in fade-in slide-in-from-bottom-2 duration-500">
              {['Student', 'Working Professional', 'Homemaker', 'Entrepreneur', 'Career Break'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleQuickReply(role)}
                  className="px-4 py-2 bg-white hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-sm font-medium border border-slate-200 rounded-full transition-all hover:border-indigo-200 shadow-sm"
                >
                  {role}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <form 
            onSubmit={handleSendMessage}
            className="p-4 md:p-6 bg-white border-t border-slate-100 sticky bottom-0"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Share your thoughts with me..."
                className="w-full pl-4 pr-14 py-3 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 outline-none"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className={`absolute right-2 p-2 rounded-lg transition-colors ${
                  !inputValue.trim() || isLoading 
                    ? 'text-slate-300' 
                    : 'text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-tighter">
              A private and safe space for your growth journey
            </p>
          </form>
        </div>
      </main>

      {/* Background decoration */}
      <div className="fixed -bottom-32 -left-32 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
      <div className="fixed -top-32 -right-32 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default App;
