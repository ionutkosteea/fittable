import { } from 'jasmine';

import {
  Dictionary,
  LanguageDictionary,
  getLanguageDictionary,
  registerModelConfig,
  unregisterModelConfig,
} from '../../dist/model/index.js';

import { TST_MODEL_CONFIG } from '../model/table/tst-model-config.js';

describe('tst-language-dictionary.spec.ts', () => {
  beforeAll(() => registerModelConfig(TST_MODEL_CONFIG));
  afterAll(() => unregisterModelConfig());

  it('getLanguageDictionary', () => {
    const ld: LanguageDictionary<string> = getLanguageDictionary();
    expect(ld).toBeDefined();
    expect(ld.getLocale() === 'en-US').toBeTruthy();
  });

  it('registerLanguage, setCurrentLanguage, getCurrentLanguage, getText', () => {
    const textKey = 'Key1';
    const dictionary: Dictionary<typeof textKey> = { Key1: 'Value1' };
    const ld: LanguageDictionary<string> = getLanguageDictionary();
    ld.register('de-DE', dictionary).setLocale('de-DE');
    expect(ld.getLocale() === 'de-DE').toBeTruthy();
    expect(ld.getText('Key1') === 'Value1').toBeTruthy();

    ld.setLocale('en-US');
    expect(ld.getText('Key1') === 'Key1').toBeTruthy();
  });
});
