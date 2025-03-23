export type FitTextKey =
  | 'thousandSeparator'
  | 'decimalPoint'
  | 'TRUE'
  | 'FALSE';

export type FitDictionary = { [key in FitTextKey]?: string };
