import { getViewModelConfig } from '../view-model-config.js';

export type Dictionary = { [key in string]?: string };

export interface LanguageDictionary {
  registerLanguage(code: string, dictionary: Dictionary): this;
  getRegisteredLanguages(): string[];
  unregisterLanguage(code: string): this;
  setCurrentLanguage(code: string): this;
  getCurrentLanguage(): string | undefined;
  setText(key: string, value?: string): this;
  getText(key: string): string;
}

export interface LanguageDictionaryFactory {
  createDictionary(): LanguageDictionary;
}

export function createLanguageDictionary(): LanguageDictionary {
  return getViewModelConfig().languageDictionaryFactory.createDictionary();
}
