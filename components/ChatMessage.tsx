
import React from 'react';
import { Message, Sender } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.sender === Sender.AI;

  return (
    <div className={`flex w-full mb-6 ${isAi ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4 duration-300'}`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isAi ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAi ? 'bg-indigo-100 text-indigo-700 mr-2' : 'bg-slate-200 text-slate-600 ml-2'}`}>
          {isAi ? 'AI' : 'ME'}
        </div>
        <div className={`px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm ${
          isAi 
            ? 'bg-white text-slate-800 border border-slate-100 rounded-tl-none' 
            : 'bg-indigo-600 text-white rounded-tr-none'
        }`}>
          <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          <span className={`text-[10px] mt-1 block opacity-60 ${isAi ? 'text-slate-400' : 'text-indigo-100'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
