import { CellCoordFactory } from './cell-coord.js';
import { CellRangeFactory } from './cell-range.js';
import { LineRangeFactory } from './line-range.js';
import { StyleFactory } from './style.js';
import { TableFactory } from './table.js';
import { ColFilterExecutorFactory } from './col-filter-executor.js';

export type ModelConfig = {
  tableFactory: TableFactory;
  cellCoordFactory: CellCoordFactory;
  cellRangeFactory: CellRangeFactory;
  lineRangeFactory: LineRangeFactory;
  styleFactory?: StyleFactory;
  colFilterExecutorFactory?: ColFilterExecutorFactory;
};

let fitModelConfig: ModelConfig | undefined;

export function registerModelConfig(config: ModelConfig): void {
  fitModelConfig = { ...config };
}

export function unregisterModelConfig(): void {
  fitModelConfig = undefined;
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
