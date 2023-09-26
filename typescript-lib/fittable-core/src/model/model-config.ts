import {
  LanguageDictionary,
  LanguageDictionaryFactory,
} from './language/language-dictionary.js';
import { CellCoordFactory } from './table/cell-coord.js';
import { CellRangeFactory } from './table/cell-range.js';
import { LineRangeFactory } from './table/line-range.js';
import { StyleFactory } from './table/style.js';
import { TableFactory } from './table/table.js';
import { ColFilterExecutorFactory } from './filter/col-filter-executor.js';
import { CellFormatterFactory } from './cell-formatter/cell-formatter.js';

export type ModelConfig = {
  languageDictionaryFactory: LanguageDictionaryFactory;
  tableFactory: TableFactory;
  cellCoordFactory: CellCoordFactory;
  cellRangeFactory: CellRangeFactory;
  lineRangeFactory: LineRangeFactory;
  styleFactory?: StyleFactory;
  colFilterExecutorFactory?: ColFilterExecutorFactory;
  cellNumberFormatterFactory?: CellFormatterFactory;
  cellDateFormatterFactory?: CellFormatterFactory;
  cellBooleanFormatterFactory?: CellFormatterFactory;
};

let fitModelConfig: ModelConfig | undefined;
let languageDictionary: LanguageDictionary<string, string> | undefined;

export function registerModelConfig(config: ModelConfig): void {
  fitModelConfig = { ...config };
  languageDictionary = undefined;
}

export function unregisterModelConfig(): void {
  fitModelConfig = undefined;
  languageDictionary = undefined;
}

export function getModelConfig(): ModelConfig {
  if (fitModelConfig) {
    return fitModelConfig;
  } else {
    throw new Error(
      'The model configuration has to be registered via the registerModelConfig function!'
    );
  }
}

export function getLanguageDictionary<
  LanguageCode extends string,
  TextKey extends string
>(): LanguageDictionary<LanguageCode, TextKey> {
  if (!languageDictionary) {
    languageDictionary =
      getModelConfig().languageDictionaryFactory.createLanguageDictionary();
  }
  return languageDictionary as LanguageDictionary<LanguageCode, TextKey>;
}
