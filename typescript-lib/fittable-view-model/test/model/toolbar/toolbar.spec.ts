import {} from 'jasmine';

import { implementsTKeys } from 'fittable-core/common';
import {
  asTableStyles,
  CellRange,
  createCellCoord,
  createCellRange,
  createStyle,
  createTable,
  registerModelConfig,
  Table,
  TableStyles,
  unregisterModelConfig,
} from 'fittable-core/model';
import {
  createOperationExecutor,
  OperationExecutor,
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fittable-core/operations';
import {
  asPopupControl,
  asValueControl,
  Container,
  Control,
  createImageRegistry,
  createLanguageDictionary,
  createToolbar,
  PopupControl,
  registerViewModelConfig,
  unregisterViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import {
  FitOperationArgs,
  FIT_OPERATION_CONFIG,
} from 'fittable-model-operations';

import {
  FitToolbarControlId,
  FIT_VIEW_MODEL_CONFIG,
} from '../../../dist/index.js';

import { ControlUpdater } from '../../../dist/model/toolbar/controls/common/control-updater.js';

describe('Toolbar', (): void => {
  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
  });
  afterAll((): void => {
    unregisterModelConfig();
    unregisterOperationConfig();
    unregisterViewModelConfig();
  });

  it('undo / redo', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });

    const operationArgs: FitOperationArgs = {
      id: 'cell-value',
      selectedCells: [createCellRange(createCellCoord(0, 0))],
      value: 1000,
    };
    operationExecutor.run(operationArgs);
    expect(table.getCellValue(0, 0) === 1000).toBeTruthy();
    const undoId: FitToolbarControlId = 'undo';
    toolbar.getControl(undoId).run();
    expect(table.getCellValue(0, 0)).toBeUndefined();
    const redoId: FitToolbarControlId = 'redo';
    toolbar.getControl(redoId).run();
    expect(table.getCellValue(0, 0) === 1000).toBeTruthy();
  });

  it('paint format', (): void => {
    const table: Table = createTable();
    const tbl: (Table & TableStyles) | undefined = asTableStyles(table)
      ?.addStyle('s0', createStyle().set('font-weight', 'bold'))
      .setCellStyleName(0, 0, 's0');
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    let selectedCells: CellRange[] = [createCellRange(createCellCoord(0, 0))];
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => selectedCells,
    });
    const controlId: FitToolbarControlId = 'paint-format';
    const button: Control = toolbar.getControl(controlId);
    button.run();
    if (implementsTKeys<ControlUpdater>(button, ['updateByCellSelection'])) {
      selectedCells = [createCellRange(createCellCoord(0, 1))];
      button.updateByCellSelection();
    }

    expect(tbl?.getCellStyleName(0, 1) === 's0').toBeTruthy();
  });

  it('bold', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'bold';
    toolbar.getControl(controlId).run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(tbl?.getStyle('s0')?.get('font-weight') === 'bold').toBeTruthy();
  });

  it('italic', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'italic';
    toolbar.getControl(controlId).run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(tbl?.getStyle('s0')?.get('font-style') === 'italic').toBeTruthy();
  });

  it('underline', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'underline';
    toolbar.getControl(controlId).run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(
      tbl?.getStyle('s0')?.get('text-decoration') === 'underline'
    ).toBeTruthy();
  });

  it('strike', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'strike';
    toolbar.getControl(controlId).run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(
      tbl?.getStyle('s0')?.get('text-decoration') === 'line-through'
    ).toBeTruthy();
  });

  it('fomt family', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'font-family';
    const control: Control = toolbar.getControl(controlId);
    const fontCombo: PopupControl | undefined = asPopupControl(control);
    fontCombo?.setSelectedControl('Fantasy').run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(tbl?.getStyle('s0')?.get('font-family') === 'fantasy').toBeTruthy();
  });

  it('fomt size', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'font-size';
    const control: Control = toolbar.getControl(controlId);
    asValueControl(control)?.setValue(26).run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(tbl?.getStyle('s0')?.get('font-size.px') === 26).toBeTruthy();
  });

  it('color', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'color';
    const control: Control = toolbar.getControl(controlId);
    const fontCombo: PopupControl | undefined = asPopupControl(control);
    fontCombo?.setSelectedControl('#d9d9d9').run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(tbl?.getStyle('s0')?.get('color') === '#d9d9d9').toBeTruthy();
  });

  it('background color', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'background-color';
    const control: Control = toolbar.getControl(controlId);
    const fontCombo: PopupControl | undefined = asPopupControl(control);
    fontCombo?.setSelectedControl('#d9d9d9').run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(
      tbl?.getStyle('s0')?.get('background-color') === '#d9d9d9'
    ).toBeTruthy();
  });

  it('horizontal align', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'horizontal-align';
    const control: Control = toolbar.getControl(controlId);
    const fontCombo: PopupControl | undefined = asPopupControl(control);
    fontCombo?.setSelectedControl('align-center').run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(tbl?.getStyle('s0')?.get('text-align') === 'center').toBeTruthy();
  });

  it('vertical align', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'vertical-align';
    const control: Control = toolbar.getControl(controlId);
    const fontCombo: PopupControl | undefined = asPopupControl(control);
    fontCombo?.setSelectedControl('align-middle').run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(
      tbl?.getStyle('s0')?.get('place-items') === 'center normal'
    ).toBeTruthy();
  });

  it('border bottom', (): void => {
    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    operationExecutor.setTable(table);
    const toolbar: Container = createToolbar({
      operationExecutor,
      dictionary: createLanguageDictionary(),
      imageRegistry: createImageRegistry(),
      getSelectedCells: (): CellRange[] => [
        createCellRange(createCellCoord(0, 0)),
      ],
    });
    const controlId: FitToolbarControlId = 'border';
    const control: Control = toolbar.getControl(controlId);
    const fontCombo: PopupControl | undefined = asPopupControl(control);
    fontCombo?.getWindow().getControl('Bottom').run();

    const tbl: (Table & TableStyles) | undefined = asTableStyles(table);
    expect(tbl?.getCellStyleName(0, 0) === 's0').toBeTruthy();
    expect(
      tbl?.getStyle('s0')?.get('border-bottom') === '1px solid #000000'
    ).toBeTruthy();
  });
});
