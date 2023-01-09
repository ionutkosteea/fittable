import { OperationExecutorFactory } from './operation-core.js';

export interface OperationConfig {
  operationExecutorFactory: OperationExecutorFactory;
}

declare global {
  var fitOperationConfig: OperationConfig | undefined;
}

export function registerOperationConfig(config: OperationConfig): void {
  globalThis.fitOperationConfig = { ...config };
}

export function unregisterOperationConfig(): void {
  globalThis.fitOperationConfig = undefined;
}

export function getOperationConfig(): OperationConfig {
  if (globalThis.fitOperationConfig) {
    return globalThis.fitOperationConfig;
  } else {
    throw new Error(
      'The operation configuration has to be registered via the registerOperationConfig function!'
    );
  }
}
