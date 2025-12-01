import React from 'react';
import { TargetLanguage } from '../types';
import { LANGUAGE_OPTIONS } from '../constants';

interface LanguageToggleProps {
  selected: TargetLanguage;
  onChange: (lang: TargetLanguage) => void;
  disabled?: boolean;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ selected, onChange, disabled }) => {
  return (
    <div className="flex justify-center my-6">
      <div className="bg-gray-200 p-1 rounded-xl flex space-x-1 shadow-inner relative">
        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = selected === option.value;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              disabled={disabled}
              className={`
                relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200
                flex items-center space-x-2 outline-none focus-visible:ring-2 focus-visible:ring-primary
                ${isActive 
                  ? 'bg-white text-primary shadow-sm scale-100' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span className="text-lg">{option.flag}</span>
              <span>{option.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LanguageToggle;