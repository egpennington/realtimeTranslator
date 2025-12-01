export enum TargetLanguage {
  KOREAN = 'Korean',
  JAPANESE = 'Japanese'
}

export interface TranslationState {
  input: string;
  output: string;
  isLoading: boolean;
  error: string | null;
}

export interface LanguageOption {
  value: TargetLanguage;
  label: string;
  flag: string;
  code: string; // ISO code for TTS
}