import {
  Dictionary,
  LanguageDictionary,
} from '../../../dist/view-model/index.js';

export class TstLanguageDictionary implements LanguageDictionary {
  registerLanguage(code: string, dictionary: Dictionary): this {
    throw new Error('Method not implemented.');
  }
  getRegisteredLanguages(): string[] {
    throw new Error('Method not implemented.');
  }
  unregisterLanguage(code: string): this {
    throw new Error('Method not implemented.');
  }
  setCurrentLanguage(code: string): this {
    throw new Error('Method not implemented.');
  }
  getCurrentLanguage(): string | undefined {
    throw new Error('Method not implemented.');
  }
  setText(key: string, value?: string | undefined): this {
    throw new Error('Method not implemented.');
  }
  getText(key: string): string {
    throw new Error('Method not implemented.');
  }
}
