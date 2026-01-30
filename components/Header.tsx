
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 py-4 px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
          IL
        </div>
        <div>
          <h1 className="serif text-xl md:text-2xl text-indigo-900 font-bold leading-tight">Iron Lady</h1>
          <p className="text-xs text-indigo-600 uppercase tracking-widest font-semibold">Empowerment Assistant</p>
        </div>
      </div>
      <div className="hidden md:block">
        <span className="text-slate-500 text-sm italic italic">"Empowering 10 Million Women to Lead"</span>
      </div>
    </header>
  );
};

export default Header;
