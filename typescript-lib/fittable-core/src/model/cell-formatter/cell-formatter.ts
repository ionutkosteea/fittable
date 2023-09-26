import { MissingFactoryError } from '../../common/factory-error.js';
import { Value } from '../table/table.js';
import { getModelConfig } from '../model-config.js';

export interface CellFormatter {
  formatValue(value: Value, format?: string): string;
}

export interface CellFormatterFactory {
  createCellFormatter(): CellFormatter;
}

export function createCellNumberFormatter(): CellFormatter {
  const factory: CellFormatterFactory | undefined =
    getModelConfig().cellNumberFormatterFactory;
  if (factory) return factory.createCellFormatter();
  else throw new MissingFactoryError();
}

export function createCellDateFormatter(): CellFormatter {
  const factory: CellFormatterFactory | undefined =
    getModelConfig().cellDateFormatterFactory;
  if (factory) return factory.createCellFormatter();
  else throw new MissingFactoryError();
}

export function createCellBooleanFormatter(): CellFormatter {
  const factory: CellFormatterFactory | undefined =
    getModelConfig().cellBooleanFormatterFactory;
  if (factory) return factory.createCellFormatter();
  else throw new MissingFactoryError();
}
