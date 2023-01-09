import { OperationConfig } from 'fit-core/operations/index.js';

import { FitOperationExecutorFactory } from './operation-core/fit-operation-executor-factory.js';

export const FIT_OPERATION_CONFIG: OperationConfig = {
  operationExecutorFactory: new FitOperationExecutorFactory(),
};
