import { OperationExecutorFactory } from './operation-core.js';

export interface OperationConfig {
  operationExecutorFactory: OperationExecutorFactory;
}

let fitOperationConfig: OperationConfig | undefined;

export function registerOperationConfig(config: OperationConfig): void {
  fitOperationConfig = { ...config };
}

export function unregisterOperationConfig(): void {
  fitOperationConfig = undefined;
}

export function getOperationConfig(): OperationConfig {
  if (fitOperationConfig) {
    return fitOperationConfig;
  } else {
    throw new Error(
      'The operation configuration has to be registered via the registerOperationConfig function!'
    );
  }
}
