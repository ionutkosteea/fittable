import { CellRange } from 'fittable-core/model/index.js';
import { OperationExecutor } from 'fittable-core/operations/index.js';
import { ControlArgs } from 'fittable-core/view-model/index.js';

import { FitImageRegistry } from '../../../image-registry/fit-image-registry.js';
import { FitLanguageDictionary } from '../../../language-dictionary/fit-language-dictionary.js';

export interface FitControlArgs extends ControlArgs {
  dictionary: FitLanguageDictionary;
  imageRegistry: FitImageRegistry;
  operationExecutor: OperationExecutor;
  getSelectedCells: () => CellRange[];
}
