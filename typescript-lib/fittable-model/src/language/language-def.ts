export type FitLocale = 'en-US' | 'de-DE';

export type FitTextKey =
  | 'thousandSeparator'
  | 'decimalPoint'
  | 'TRUE'
  | 'FALSE';

export type FitDictionary = { [key in FitTextKey]?: string };
