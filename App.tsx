import React, { useState, useEffect, useCallback } from 'react';
import { TargetLanguage } from './types';
import { LANGUAGE_OPTIONS, DEBOUNCE_DELAY_MS } from './constants';
import { useDebounce } from './hooks/useDebounce';
import { translateText } from './services/gemini';
import Header from './components/Header';
import LanguageToggle from './components/LanguageToggle';
import TranslationArea from './components/TranslationArea';

// Icons
const SpeakIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
);
const StopIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect x="6" y="6" width="12" height="12" rx="2"></rect></svg>
);
const CopyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [targetLang, setTargetLang] = useState<TargetLanguage>(TargetLanguage.KOREAN);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Debounce the input to avoid API spam
  const debouncedInput = useDebounce(inputText, DEBOUNCE_DELAY_MS);

  const performTranslation = useCallback(async (text: string, lang: TargetLanguage) => {
    if (!text.trim()) {
      setOutputText("");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    // Stop speaking if we start a new translation
    window.speechSynthesis.cancel();
    setIsSpeaking(false);

    try {
      const result = await translateText(text, lang);
      setOutputText(result);
    } catch (err) {
      console.error(err);
      setError("Failed to translate. Check connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect for translation when text or language changes
  useEffect(() => {
    performTranslation(debouncedInput, targetLang);
  }, [debouncedInput, targetLang, performTranslation]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Handle TTS
  const handleReadAloud = (text: string, langCode: string) => {
    if (!('speechSynthesis' in window) || !text) return;
    
    // If currently speaking, stop it
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = 0.9; // Slightly slower for clarity
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error("TTS Error:", e);
      setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setError(null);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const currentLangConfig = LANGUAGE_OPTIONS.find(l => l.value === targetLang);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-sans">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        
        {/* Language Selector */}
        <LanguageToggle 
          selected={targetLang} 
          onChange={setTargetLang} 
          disabled={isLoading && !debouncedInput} // Only disable if initial loading stuck
        />

        {/* Translation Content */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 relative">
          
          {/* Input Area */}
          <TranslationArea 
            title="English"
            value={inputText}
            onChange={setInputText}
            placeholder="Type here to translate..."
            actionButton={
              <button 
                onClick={() => handleCopy(inputText)} 
                className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
                title="Copy original"
              >
                <CopyIcon />
              </button>
            }
          />

          {/* Divider / Arrow for Desktop */}
          <div className="hidden md:flex flex-col justify-center items-center text-gray-300">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-300">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
          </div>

          {/* Output Area */}
          <TranslationArea 
            title={targetLang}
            value={outputText}
            readOnly
            isLoading={isLoading}
            placeholder={isLoading ? "Translating..." : "Translation will appear here"}
            actionButton={
              <div className="flex space-x-1">
                <button 
                  onClick={() => handleReadAloud(outputText, currentLangConfig?.code || 'en-US')} 
                  className={`p-1.5 rounded-md transition-all duration-200 ${
                    isSpeaking 
                      ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                      : 'text-gray-400 hover:text-primary hover:bg-blue-50'
                  }`}
                  title={isSpeaking ? "Stop speaking" : "Read aloud"}
                >
                  {isSpeaking ? <StopIcon /> : <SpeakIcon />}
                </button>
                <button 
                  onClick={() => handleCopy(outputText)} 
                  className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-md transition-colors"
                  title="Copy translation"
                >
                  <CopyIcon />
                </button>
              </div>
            }
          />

        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center justify-center">
            {error}
          </div>
        )}

        {/* Sticky Controls */}
        <div className="sticky bottom-6 mt-6 flex justify-center z-20">
          <button
            onClick={handleClear}
            disabled={!inputText && !outputText}
            className={`
              flex items-center space-x-2 px-6 py-3 rounded-full shadow-lg font-medium transition-all transform hover:scale-105 active:scale-95
              ${(!inputText && !outputText) 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-red-500 hover:bg-red-50 ring-1 ring-red-100'}
            `}
          >
            <TrashIcon />
            <span>Clear All</span>
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-400 text-xs">
        <p>&copy; {new Date().getFullYear()} penningtonProgramming. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
