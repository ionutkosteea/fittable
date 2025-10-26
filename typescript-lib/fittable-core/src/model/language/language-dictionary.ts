import { Observable } from 'rxjs';

export type Dictionary<Key extends string> = { [key in Key]?: string };

export interface LanguageDictionary<
  Locale extends string,
  TextKey extends string
> {
  register(locale: Locale, dictionary: Dictionary<TextKey>): this;
  getAllLocales(): Locale[];
  unregister(locale: Locale): this;
  setLocale(locale: Locale): this;
  onAfterSetLocale$(): Observable<Locale>;
  getLocale(): Locale;
  setText(key: TextKey, value?: string): this;
  getText(key: TextKey): string;
  clone(): LanguageDictionary<Locale, TextKey>;
}

export interface LanguageDictionaryFactory {
  createLanguageDictionary(): LanguageDictionary<string, string>;
}
