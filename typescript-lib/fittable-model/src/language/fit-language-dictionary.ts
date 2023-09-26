import { Observable, Subject } from 'rxjs';

import {
  LanguageDictionary,
  LanguageDictionaryFactory,
  getLanguageDictionary as getCoreLanguageDictionary,
} from 'fittable-core/model';

import { FitLocale, FitTextKey, FitDictionary } from './language-def.js';
import { enUS } from './en-US.js';
import { deDE } from './de-DE.js';

export class FitLanguageDictionary
  implements LanguageDictionary<FitLocale, FitTextKey>
{
  private dictionaries: {
    [code in FitLocale]?: FitDictionary;
  } = {};
  private locale: FitLocale = 'en-US';
  private afterSetLocale$: Subject<FitLocale> = new Subject();

  public register(locale: FitLocale, dictionary: FitDictionary): this {
    if (this.dictionaries[locale] === undefined) {
      this.dictionaries[locale] = dictionary;
    } else {
      for (const key of Object.keys(dictionary)) {
        const textKey: FitTextKey = key as FitTextKey;
        const codes: FitDictionary | undefined = this.dictionaries[locale];
        if (codes) codes[textKey] = dictionary[textKey];
      }
    }
    return this;
  }

  public getAllLocales(): FitLocale[] {
    return Reflect.ownKeys(this.dictionaries) as FitLocale[];
  }

  public unregister(code: FitLocale): this {
    Reflect.deleteProperty(this.dictionaries, code);
    return this;
  }

  public setLocale(locale: FitLocale): this {
    this.locale = locale;
    this.afterSetLocale$.next(locale);
    return this;
  }

  public onAfterSetLocale$(): Observable<FitLocale> {
    return this.afterSetLocale$.asObservable();
  }

  public getLocale(): FitLocale {
    return this.locale;
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
    const dictionary: FitDictionary | undefined =
      this.dictionaries[this.locale];
    if (dictionary) return dictionary;
    else throw new Error('Current locale is not registered!');
  }

  public clone(): FitLanguageDictionary {
    const clone = new FitLanguageDictionary();
    clone.dictionaries = { ...this.dictionaries };
    clone.locale = this.locale;
    return clone;
  }
}

export class FitLanguageDictionaryFactory implements LanguageDictionaryFactory {
  public createLanguageDictionary(): FitLanguageDictionary {
    return new FitLanguageDictionary()
      .register('en-US', enUS)
      .register('de-DE', deDE);
  }
}

export function getLanguageDictionary(): FitLanguageDictionary {
  return getCoreLanguageDictionary() as FitLanguageDictionary;
}
