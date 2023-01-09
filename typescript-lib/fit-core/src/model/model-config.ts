import { CellCoordFactory } from './cell-coord.js';
import { CellFactory } from './cell.js';
import { RowHeaderFactory, ColumnHeaderFactory } from './header.js';
import { RowFactory, ColumnFactory } from './line.js';
import { MergedRegionsFactory } from './merged-regions.js';
import { CellRangeFactory } from './cell-range.js';
import { LineRangeFactory } from './line-range.js';
import { StyleFactory } from './style.js';
import { TableFactory } from './table.js';

export type ModelConfig = {
  tableFactory: TableFactory;
  cellFactory: CellFactory;
  cellCoordFactory: CellCoordFactory;
  cellRangeFactory: CellRangeFactory;
  lineRangeFactory: LineRangeFactory;
  rowFactory?: RowFactory;
  columnFactory?: ColumnFactory;
  rowHeaderFactory?: RowHeaderFactory;
  columnHeaderFactory?: ColumnHeaderFactory;
  styleFactory?: StyleFactory;
  mergedRegionsFactory?: MergedRegionsFactory;
};

declare global {
  var fitModelConfig: ModelConfig | undefined;
}

export function registerModelConfig(config: ModelConfig): void {
  globalThis.fitModelConfig = { ...config };
}

export function unregisterModelConfig(): void {
  globalThis.fitModelConfig = undefined;
}

export function getModelConfig(): ModelConfig {
  if (globalThis.fitModelConfig) {
    return globalThis.fitModelConfig;
  } else {
    throw new Error(
      'The model configuration has to be registered via the registerModelConfig function!'
    );
  }
}
