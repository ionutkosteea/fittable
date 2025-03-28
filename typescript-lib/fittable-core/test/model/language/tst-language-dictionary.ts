import { Observable, Subject } from 'rxjs';

import {
  LanguageDictionary,
  LanguageDictionaryFactory,
  getLanguageDictionary as getCoreLanguageDictionary,
} from 'fittable-core/model';

import { TstTextKey, TstDictionary } from './language-def.js';
import { enUS } from './en-US.js';
import { deDE } from './de-DE.js';

export class TstLanguageDictionary
  implements LanguageDictionary<TstTextKey> {
  private locale = 'en-US';
  private dictionaries: { [locale: string]: TstDictionary } = {};
  private afterSetLocale$: Subject<string> = new Subject();

  public register(locale: string, dictionary: TstDictionary): this {
    if (this.dictionaries[locale] === undefined) {
      this.dictionaries[locale] = dictionary;
    } else {
      for (const key of Object.keys(dictionary)) {
        const textKey: TstTextKey = key as TstTextKey;
        this.dictionaries[locale]![textKey] = dictionary[textKey];
      }
    }
    return this;
  }

  public getAllLocales(): string[] {
    return Reflect.ownKeys(this.dictionaries) as string[];
  }

  public unregister(locale: string): this {
    Reflect.deleteProperty(this.dictionaries, locale);
    return this;
  }

  public setLocale(locale: string): this {
    this.locale = locale;
    this.afterSetLocale$.next(locale);
    return this;
  }

  public onAfterSetLocale$(): Observable<string> {
    return this.afterSetLocale$.asObservable();
  }

  public getLocale(): string {
    return this.locale;
  }

  public setText(key: TstTextKey, value?: string): this {
    const dictionary: TstDictionary = this.getDictionary();
    if (value) Reflect.set(dictionary, key, value);
    else Reflect.deleteProperty(dictionary, key);
    return this;
  }

  public getText(key: TstTextKey): string {
    const dictionary: TstDictionary = this.getDictionary();
    return dictionary[key] ?? key;
  }

  private getDictionary(): TstDictionary {
    if (this.locale) {
      const dictionary: TstDictionary | undefined =
        this.dictionaries[this.locale];
      if (dictionary) return dictionary;
      else throw new Error('Current locale is not registered!');
    } else {
      throw new Error('Current locale is not defined!');
    }
  }

  public clone(): TstLanguageDictionary {
    const clone = new TstLanguageDictionary();
    clone.dictionaries = { ...this.dictionaries };
    clone.locale = this.locale;
    return clone;
  }
}

export class TstLanguageDictionaryFactory implements LanguageDictionaryFactory {
  public createLanguageDictionary(): TstLanguageDictionary {
    return new TstLanguageDictionary()
      .register('en-US', enUS)
      .register('de-DE', deDE);
  }
}

export function getLanguageDictionary(): TstLanguageDictionary {
  return getCoreLanguageDictionary() as TstLanguageDictionary;
}
