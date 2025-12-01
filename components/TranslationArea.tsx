import React from 'react';

interface TranslationAreaProps {
  title: string;
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  actionButton?: React.ReactNode;
}

const TranslationArea: React.FC<TranslationAreaProps> = ({
  title,
  value,
  onChange,
  readOnly = false,
  placeholder,
  isLoading = false,
  actionButton
}) => {
  return (
    <div className="flex-1 flex flex-col min-h-[250px] bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group transition-colors focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</span>
        {actionButton && (
          <div className="flex items-center">
             {actionButton}
          </div>
        )}
      </div>
      
      <div className="relative flex-1">
        <textarea
          className={`
            w-full h-full p-4 resize-none outline-none bg-transparent text-lg leading-relaxed text-gray-800
            placeholder:text-gray-300
            ${isLoading ? 'animate-pulse text-gray-400' : ''}
          `}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          readOnly={readOnly}
          placeholder={placeholder}
          spellCheck={false}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px]">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationArea;