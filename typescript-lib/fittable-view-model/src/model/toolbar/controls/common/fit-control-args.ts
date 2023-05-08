import { CellRange } from 'fittable-core/model';
import { OperationExecutor } from 'fittable-core/operations';
import { ControlArgs } from 'fittable-core/view-model';

import { FitImageRegistry } from '../../../image-registry/fit-image-registry.js';
import { FitLanguageDictionary } from '../../../language-dictionary/fit-language-dictionary.js';

export interface FitControlArgs extends ControlArgs {
  dictionary: FitLanguageDictionary;
  imageRegistry: FitImageRegistry;
  operationExecutor: OperationExecutor;
  getSelectedCells: () => CellRange[];
}
