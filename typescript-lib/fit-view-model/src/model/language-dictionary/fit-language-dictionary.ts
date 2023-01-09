import {
  LanguageDictionary,
  LanguageDictionaryFactory,
  Dictionary,
} from 'fit-core/view-model/index.js';

import { FitLanguageCode, FitTextKey } from './language-dictionary-keys.js';
import { enUS } from './languages/en-US.js';
import { deDE } from './languages/de-DE.js';

export class FitLanguageDictionary<
  LanguageCode extends string,
  TextKey extends string
> implements LanguageDictionary<LanguageCode, TextKey>
{
  private dictionaries: { [code in LanguageCode]?: Dictionary<TextKey> } = {};
  private currentCode?: LanguageCode;

  public registerLanguage(
    code: LanguageCode,
    dictionary: Dictionary<TextKey>
  ): this {
    this.dictionaries[code] = dictionary;
    return this;
  }

  public getRegisteredLanguages(): LanguageCode[] {
    return Reflect.ownKeys(this.dictionaries) as LanguageCode[];
  }

  public unregisterLanguage(code: LanguageCode): this {
    Reflect.deleteProperty(this.dictionaries, code);
    return this;
  }

  public setCurrentLanguage(code: LanguageCode): this {
    this.currentCode = code;
    return this;
  }

  public getCurrentLanguage(): LanguageCode | undefined {
    return this.currentCode;
  }

  public setText(key: TextKey, value?: string): this {
    const dictionary: Dictionary<TextKey> = this.getDictionary();
    if (value) Reflect.set(dictionary, key, value);
    else Reflect.deleteProperty(dictionary, key);
    return this;
  }

  public getText(key: TextKey): string {
    const dictionary: Dictionary<TextKey> = this.getDictionary();
    return dictionary[key] ?? key;
  }

  private getDictionary(): Dictionary<TextKey> {
    if (this.currentCode) {
      const dictionary: Dictionary<TextKey> | undefined =
        this.dictionaries[this.currentCode];
      if (dictionary) return dictionary;
      else throw new Error('Current language is not registered!');
    } else {
      throw new Error('Current language is not defined!');
    }
  }
}

export class FitLanguageDictionaryFactory implements LanguageDictionaryFactory {
  public createDictionary(): LanguageDictionary<FitLanguageCode, FitTextKey> {
    return new FitLanguageDictionary<FitLanguageCode, FitTextKey>()
      .registerLanguage('en-US', enUS)
      .registerLanguage('de-DE', deDE)
      .setCurrentLanguage('en-US');
  }
}
