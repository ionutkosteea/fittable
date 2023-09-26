import {
  CellFormatter,
  CellFormatterFactory,
  getLanguageDictionary,
  Value,
} from 'fittable-core/model';

export class FitCellBooleanFormatter implements CellFormatter {
  public formatValue(value: Value): string {
    if (typeof value !== 'boolean') {
      throw new Error(`Invalid boolean value '${value}'!`);
    }
    const stringValue: string = value.toString().toUpperCase();
    return getLanguageDictionary().getText(stringValue);
  }
}

export class FitCellBooleanFormatterFactory implements CellFormatterFactory {
  public createCellFormatter(): CellFormatter {
    return new FitCellBooleanFormatter();
  }
}
