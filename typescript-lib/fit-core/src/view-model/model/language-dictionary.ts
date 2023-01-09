import { getViewModelConfig } from '../view-model-config.js';

export type Dictionary<TextKey extends string> = { [key in TextKey]?: string };

export interface LanguageDictionary<
  LanguageCode extends string,
  TextKey extends string
> {
  registerLanguage(code: LanguageCode, dictionary: Dictionary<TextKey>): this;
  getRegisteredLanguages(): LanguageCode[];
  unregisterLanguage(code: LanguageCode): this;
  setCurrentLanguage(code: LanguageCode): this;
  getCurrentLanguage(): LanguageCode | undefined;
  setText(key: TextKey, value?: string): this;
  getText(key: TextKey): string;
}

export interface LanguageDictionaryFactory {
  createDictionary(): LanguageDictionary<string, string>;
}

export function createLanguageDictionary<
  LanguageCode extends string,
  TextKey extends string
>(): LanguageDictionary<LanguageCode, TextKey> {
  const dictionary: LanguageDictionary<string, string> =
    getViewModelConfig().languageDictionaryFactory.createDictionary();
  return dictionary as LanguageDictionary<LanguageCode, TextKey>;
}
