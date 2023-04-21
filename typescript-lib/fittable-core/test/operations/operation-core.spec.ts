import {} from 'jasmine';

import { MissingFactoryError } from '../../dist/common/index.js';
import {
  createOperationExecutor,
  getOperationConfig,
  registerOperationConfig,
  unregisterOperationConfig,
} from '../../dist/operations/index.js';

import { TstOperationExecutor } from './model/tst-operation-executor.js';

describe('operation-core.ts', () => {
  it('missing operation config', () => {
    let noError = false;
    let wrongError = false;
    try {
      createOperationExecutor();
      noError = true;
    } catch (error) {
      if (error instanceof MissingFactoryError) {
        wrongError = true;
      }
    }

    expect(noError).toBeFalse();
    expect(wrongError).toBeFalse();
  });

  it('createOperationExecutor', () => {
    registerOperationConfig({
      operationExecutorFactory: {
        createOperationExecutor: () => new TstOperationExecutor(),
      },
    });

    expect(getOperationConfig()).toBeDefined();

    unregisterOperationConfig();
  });
});
