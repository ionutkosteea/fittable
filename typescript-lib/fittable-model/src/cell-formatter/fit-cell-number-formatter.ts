import {
  CellFormatter,
  CellFormatterFactory,
  Value,
} from 'fittable-core/model';

import { getLanguageDictionary } from '../language/fit-language-dictionary.js';

export class FitCellNumberFormatter implements CellFormatter {
  private currencyPattern: string;
  private valuePattern: string;
  private percentPattern: string;
  private resultPattern: string;

  constructor() {
    this.currencyPattern = `([^0-9#%., ]{1,3}[ ]?)|([ ]?[^0-9#%., ]{1,3})`;
    this.valuePattern = `(0|#)(${this.getThousandSeparator()}(0|#))?(0|#)*(${this.getDecimalPoint()}(0|#))?(0|#)*`;
    this.percentPattern = `[ ]?%`;
    this.resultPattern = `(^((${this.currencyPattern})?${this.valuePattern})$)|(^(${this.valuePattern}(${this.percentPattern}|${this.currencyPattern}))$)`;
  }

  private getThousandSeparator(): string {
    return getLanguageDictionary().getText('thousandSeparator');
  }

  private getDecimalPoint(): string {
    return getLanguageDictionary().getText('decimalPoint');
  }

  public formatValue(value: Value, format?: string): string {
    if (typeof value !== 'number') {
      throw new Error(`Invalid number value '${value}'.`);
    }
    if (format) return this.getValueWithFormat(value, format);
    else return this.getValueWithNoFormat(value);
  }

  private getValueWithFormat(value: number, format: string): string {
    if (!new RegExp(this.resultPattern).test(format)) {
      throw new Error(
        `Format '${format}' does not respect corresponding pattern '${this.resultPattern}'.`
      );
    }
    const currency: string = this.formatCurrency(format);
    let currencyPrefix = '';
    let currencySuffix = '';
    if (currency.startsWith(' ')) currencySuffix = currency;
    else currencyPrefix = currency;
    const percent: string = this.formatPercent(format);
    const valueString: string = //
      percent ? (value * 100).toString() : value.toString();
    const valuePatternArray: RegExpMatchArray | null = //
      format.match(this.valuePattern);
    if (!valuePatternArray) return '';
    const valueFormat: string = valuePatternArray[0];
    const integerPart: string = //
      this.formatIntegerPart(valueString, valueFormat);
    const decimalPart: string = //
      this.formatDecimalPart(valueString, valueFormat);
    return (
      currencyPrefix + integerPart + decimalPart + percent + currencySuffix
    );
  }

  private formatCurrency(format: string): string {
    const currencyFormat: RegExpMatchArray | null = //
      format.match(this.currencyPattern);
    return currencyFormat ? currencyFormat[0] : '';
  }

  private formatIntegerPart(value: string, format: string): string {
    let result = '';
    const formatIntegerPart: string = //
      format.split(this.getDecimalPoint())[0];
    const decimalPointIndex: number = value.search(/[^\d]/);
    const integerPart: string =
      decimalPointIndex > -1 ? value.substring(0, decimalPointIndex) : value;
    if (formatIntegerPart.length > integerPart.length) {
      const dif: number = formatIntegerPart.length - integerPart.length;
      const count0: number =
        formatIntegerPart.substring(0, dif).split('0').length - 1;
      result = '0'.repeat(count0) + integerPart;
    } else {
      result = integerPart;
    }
    return this.insertThousandSeparator(result, formatIntegerPart);
  }

  private insertThousandSeparator(value: string, format: string): string {
    let result = '';
    if (format.charAt(1) === this.getThousandSeparator()) {
      const revertedValue: string = value.split('').reverse().join('');
      for (let i = 0; i < revertedValue.length; i++) {
        if (i !== 0 && i % 3 === 0) result += this.getThousandSeparator();
        result += revertedValue.charAt(i);
      }
      result = result.split('').reverse().join('');
    } else {
      result = value;
    }
    return result;
  }

  private formatDecimalPart(value: string, format: string): string {
    let result = '';
    const decimalPointIndex: number = value.search(/[^\d]/);
    const decimalPart =
      decimalPointIndex > -1 ? value.substring(decimalPointIndex + 1) : '';
    const formatDecimalPointIndex = format.indexOf(this.getDecimalPoint());
    const formatDecimalPart =
      formatDecimalPointIndex > -1
        ? format.substring(formatDecimalPointIndex + 1)
        : '';
    if (formatDecimalPart.length > decimalPart.length) {
      const count0: number =
        formatDecimalPart.substring(decimalPart.length).split('0').length - 1;
      result = (decimalPart ?? '') + '0'.repeat(count0);
    } else if (formatDecimalPart.length < decimalPart.length) {
      result = formatDecimalPart.length
        ? decimalPart.substring(0, formatDecimalPart.length)
        : '';
    } else {
      result = decimalPart;
    }
    return result ? this.getDecimalPoint() + result : '';
  }

  private formatPercent(format: string): string {
    const percentFormat: RegExpMatchArray | null = //
      format.match(this.percentPattern);
    return percentFormat ? percentFormat[0] : '';
  }

  private getValueWithNoFormat(value: number): string {
    return value.toString().replace(/[^\d]/, this.getDecimalPoint());
  }
}

export class FitCellNumberFormatterFactory implements CellFormatterFactory {
  public createCellFormatter(): CellFormatter {
    return new FitCellNumberFormatter();
  }
}
