import { OperationConfig } from 'fittable-core/operations';

import { FitOperationExecutorFactory } from './operation-executor/fit-operation-executor-factory.js';

export const FIT_OPERATION_CONFIG: OperationConfig = {
  operationExecutorFactory: new FitOperationExecutorFactory(),
};
