export type TstLocale = 'en-US' | 'de-DE';

export type TstTextKey = 'thousandSeparator' | 'decimalPoint';

export type TstDictionary = { [key in TstTextKey]?: string };
