import { Observable } from 'rxjs';

export type Dictionary<TextKey extends string> = { [key in TextKey]?: string };

export interface LanguageDictionary<TextKey extends string> {
  register(locale: string, dictionary: Dictionary<TextKey>): this;
  getAllLocales(): string[];
  unregister(locale: string): this;
  setLocale(locale: string): this;
  onAfterSetLocale$(): Observable<string>;
  getLocale(): string;
  setText(key: TextKey, value?: string): this;
  getText(key: TextKey): string;
  clone(): LanguageDictionary<TextKey>;
}

export interface LanguageDictionaryFactory {
  createLanguageDictionary(): LanguageDictionary<string>;
}
