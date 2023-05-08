import {} from 'jasmine';

import {
  createTable,
  registerModelConfig,
  Table,
  TableBasics,
  TableColFilter,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  createOperationExecutor,
  OperationExecutor,
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  asCheckBoxControl,
  asOptionsControl,
  CheckBoxControl,
  ColFilters,
  Control,
  createColFilters,
  createImageRegistry,
  createLanguageDictionary,
  OptionsControl,
  registerViewModelConfig,
  unregisterViewModelConfig,
  Window,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';

import {
  FIT_VIEW_MODEL_CONFIG,
  FitColFiltersControlId,
} from '../../../dist/index.js';

import { ColFilterOperationSubscriptions } from '../../../dist/model/col-filters/col-filter-operation-subscriptions.js';

describe('Column filters', (): void => {
  let colFilters: ColFilters;
  let operationSubscriptions: ColFilterOperationSubscriptions;

  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll(() => {
    colFilters.destroy();
    operationSubscriptions.destroy();
    unregisterModelConfig();
    unregisterOperationConfig();
    unregisterViewModelConfig();
  });

  it('run, undo, redo filter', (): void => {
    const table: Table = createTable()
      .setCellValue(0, 1, 100)
      .setCellValue(1, 1, 200)
      .setCellValue(2, 1, 250);
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    colFilters = createColFilters({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
    });
    operationSubscriptions = new ColFilterOperationSubscriptions({
      operationExecutor,
      colFilters,
      loadTableFn: (): void => {},
    });

    colFilters.loadCol(1);
    const popUpButton: OptionsControl = colFilters.getPopUpButton(1);
    const popUpWindow: Window = popUpButton.getWindow();
    const clearButtonId: FitColFiltersControlId = 'clear-button';
    popUpWindow.getControl(clearButtonId).run();
    const valueCheckListId: FitColFiltersControlId = 'value-check-list';
    const valueCheckList: OptionsControl | undefined = //
      asOptionsControl(popUpWindow.getControl(valueCheckListId));
    if (!valueCheckList) throw Error('Invalid value check list');
    const checkBox: CheckBoxControl | undefined = //
      asCheckBoxControl(valueCheckList.getWindow().getControl('1'));
    if (!checkBox) throw Error('Invalid value check box');
    checkBox.setChecked(true);
    const okButtonId: FitColFiltersControlId = 'ok-button';
    const okButton: Control = popUpWindow.getControl(okButtonId);
    okButton.run();
    const getFilteredTable: () =>
      | (TableColFilter & TableBasics)
      | undefined = () => colFilters.filterExecutor.getFilteredTable();
    expect(getFilteredTable()?.getNumberOfRows() === 1).toBeTruthy();
    expect(getFilteredTable()?.getCellValue(0, 1) === 200).toBeTruthy();
    operationExecutor.undo();
    expect(getFilteredTable()).toBeUndefined();
    operationExecutor.redo();
    expect(getFilteredTable()?.getNumberOfRows() === 1).toBeTruthy();
    expect(getFilteredTable()?.getCellValue(0, 1) === 200).toBeTruthy();
  });
});
