import { TargetLanguage, LanguageOption } from './types';

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    value: TargetLanguage.KOREAN,
    label: 'Korean',
    flag: '🇰🇷',
    code: 'ko-KR'
  },
  {
    value: TargetLanguage.JAPANESE,
    label: 'Japanese',
    flag: '🇯🇵',
    code: 'ja-JP'
  }
];

export const DEBOUNCE_DELAY_MS = 600;