import { Observable, Subject } from 'rxjs';

import {
  LanguageDictionary,
  LanguageDictionaryFactory,
  getLanguageDictionary as getCoreLanguageDictionary,
} from 'fittable-core/model';

import { TstLocale, TstTextKey, TstDictionary } from './language-def.js';
import { enUS } from './en-US.js';
import { deDE } from './de-DE.js';

export class TstLanguageDictionary
  implements LanguageDictionary<TstLocale, TstTextKey>
{
  private dictionaries: {
    [locale in TstLocale]?: TstDictionary;
  } = {};
  private locale: TstLocale = 'en-US';
  private afterSetLocale$: Subject<TstLocale> = new Subject();

  public register(locale: TstLocale, dictionary: TstDictionary): this {
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

  public getAllLocales(): TstLocale[] {
    return Reflect.ownKeys(this.dictionaries) as TstLocale[];
  }

  public unregister(locale: TstLocale): this {
    Reflect.deleteProperty(this.dictionaries, locale);
    return this;
  }

  public setLocale(locale: TstLocale): this {
    this.locale = locale;
    this.afterSetLocale$.next(locale);
    return this;
  }

  public onAfterSetLocale$(): Observable<TstLocale> {
    return this.afterSetLocale$.asObservable();
  }

  public getLocale(): TstLocale {
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
