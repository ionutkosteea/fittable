import {
  LanguageDictionary,
  LanguageDictionaryFactory,
} from 'fittable-core/view-model/index.js';

import {
  FitDictionary,
  FitLanguageCode,
  FitTextKey,
} from './language-dictionary-keys.js';
import { enUS } from './languages/en-US.js';
import { deDE } from './languages/de-DE.js';

export class FitLanguageDictionary implements LanguageDictionary {
  private dictionaries: { [FitLanguageCode in string]?: FitDictionary } = {};
  private currentCode?: FitLanguageCode;

  public registerLanguage(
    code: FitLanguageCode,
    dictionary: FitDictionary
  ): this {
    this.dictionaries[code] = dictionary;
    return this;
  }

  public getRegisteredLanguages(): FitLanguageCode[] {
    return Reflect.ownKeys(this.dictionaries) as FitLanguageCode[];
  }

  public unregisterLanguage(code: FitLanguageCode): this {
    Reflect.deleteProperty(this.dictionaries, code);
    return this;
  }

  public setCurrentLanguage(code: FitLanguageCode): this {
    this.currentCode = code;
    return this;
  }

  public getCurrentLanguage(): FitLanguageCode | undefined {
    return this.currentCode;
  }

  public setText(key: FitTextKey, value?: string): this {
    const dictionary: FitDictionary = this.getDictionary();
    if (value) Reflect.set(dictionary, key, value);
    else Reflect.deleteProperty(dictionary, key);
    return this;
  }

  public getText(key: FitTextKey): string {
    const dictionary: FitDictionary = this.getDictionary();
    return dictionary[key] ?? key;
  }

  private getDictionary(): FitDictionary {
    if (this.currentCode) {
      const dictionary: FitDictionary | undefined =
        this.dictionaries[this.currentCode];
      if (dictionary) return dictionary;
      else throw new Error('Current language is not registered!');
    } else {
      throw new Error('Current language is not defined!');
    }
  }
}

export class FitLanguageDictionaryFactory implements LanguageDictionaryFactory {
  public createDictionary(): LanguageDictionary {
    return new FitLanguageDictionary()
      .registerLanguage('en-US', enUS)
      .registerLanguage('de-DE', deDE)
      .setCurrentLanguage('en-US');
  }
}
