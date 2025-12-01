import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
            LF
          </div>
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">LinguaFlash</h1>
        </div>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
          Gemini 2.5 Flash
        </div>
      </div>
    </header>
  );
};

export default Header;