import { MissingFactoryError } from '../../../dist/common/index.js';

export function throwsMethodNotImplemented(fn: () => void): boolean {
  let throwsError = false;
  try {
    fn();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Method not implemented.') {
        throwsError = true;
      }
    }
  }
  return throwsError;
}

export function throwsMissingFactory(fn: () => void): boolean {
  let throwsError = false;
  try {
    fn();
  } catch (error) {
    if (error instanceof MissingFactoryError) {
      throwsError = true;
    }
  }
  return throwsError;
}
