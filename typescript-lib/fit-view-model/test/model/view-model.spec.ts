import {} from 'jasmine';

import {
  CellCoord,
  createCellCoord,
  createTable,
  registerModelConfig,
  Table,
  unregisterModelConfig,
} from 'fit-core/model/index.js';
import {
  createOperationExecutor,
  OperationExecutor,
  registerOperationConfig,
  unregisterOperationConfig,
} from 'fit-core/operations/index.js';
import {
  createViewModel,
  registerViewModelConfig,
  unregisterViewModelConfig,
  ViewModel,
} from 'fit-core/view-model/index.js';

import { FitTable, FIT_MODEL_CONFIG } from '../../../fit-model/dist/index.js';
import { FIT_OPERATION_CONFIG } from '../../../fit-model-operations/dist/index.js';
import {
  FitContextMenuControlId,
  FitToolbarControlId,
  FIT_VIEW_MODEL_CONFIG,
  THIN_VIEW_MODEL_CONFIG,
} from '../../dist/index.js';

describe('fit-view-model.ts', (): void => {
  let viewModel: ViewModel;

  beforeAll((): void => {
    registerModelConfig(FIT_MODEL_CONFIG);
  });
  afterEach((): void => {
    viewModel.destroy();
    unregisterOperationConfig();
    unregisterViewModelConfig();
  });
  afterAll((): void => {
    unregisterModelConfig();
  });

  it('fat view model', (): void => {
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    viewModel = createViewModel(table, operationExecutor);
    viewModel.loadTable(table);

    expect(viewModel.cellEditor).toBeDefined();
    expect(viewModel.cellSelection).toBeDefined();
    expect(viewModel.cellSelectionPainter).toBeDefined();
    expect(viewModel.cellSelectionScroller).toBeDefined();
    expect(viewModel.colFilters).toBeDefined();
    expect(viewModel.contextMenu).toBeDefined();
    expect(viewModel.dictionary).toBeDefined();
    expect(viewModel.imageRegistry).toBeDefined();
    expect(viewModel.mobileLayout).toBeDefined();
    expect(viewModel.operationExecutor).toBeDefined();
    expect(viewModel.settingsBar).toBeDefined();
    expect(viewModel.statusbar).toBeDefined();
    expect(viewModel.table).toBeDefined();
    expect(viewModel.tableScroller).toBeDefined();
    expect(viewModel.tableViewer).toBeDefined();
    expect(viewModel.themeSwitcher).toBeDefined();
    expect(viewModel.toolbar).toBeDefined();
  });

  it('thin view model', (): void => {
    registerViewModelConfig(THIN_VIEW_MODEL_CONFIG);

    const table: Table = createTable();
    viewModel = createViewModel(table);

    expect(viewModel.cellEditor).toBeUndefined();
    expect(viewModel.cellSelection).toBeUndefined();
    expect(viewModel.cellSelectionPainter).toBeUndefined();
    expect(viewModel.cellSelectionScroller).toBeUndefined();
    expect(viewModel.colFilters).toBeUndefined();
    expect(viewModel.contextMenu).toBeUndefined();
    expect(viewModel.dictionary).toBeDefined();
    expect(viewModel.imageRegistry).toBeDefined();
    expect(viewModel.mobileLayout).toBeDefined();
    expect(viewModel.operationExecutor).toBeUndefined();
    expect(viewModel.settingsBar).toBeUndefined();
    expect(viewModel.statusbar).toBeUndefined();
    expect(viewModel.table).toBeDefined();
    expect(viewModel.tableScroller).toBeDefined();
    expect(viewModel.tableViewer).toBeDefined();
    expect(viewModel.themeSwitcher).toBeUndefined();
    expect(viewModel.toolbar).toBeUndefined();
  });

  it('cell value', (): void => {
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: Table = createTable();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    viewModel = createViewModel(table, operationExecutor);

    let cellCoord: CellCoord = createCellCoord(1, 1);
    viewModel.cellSelection?.body
      .removeRanges()
      .createRange()
      .addCell(cellCoord)
      .end();
    viewModel.cellEditor
      ?.setCell(cellCoord)
      .getCellControl()
      .setValue('text')
      .run();
    expect(table.getCellValue(1, 1) === 'text').toBeTruthy();

    cellCoord = createCellCoord(0, 0);
    viewModel.cellSelection?.body
      .removeRanges()
      .createRange()
      .addCell(cellCoord)
      .end();
    viewModel.cellEditor?.setCell(cellCoord);
    operationExecutor.undo();
    cellCoord = createCellCoord(1, 1);
    expect(table.getCellValue(1, 1)).toBeUndefined();
    expect(cellCoord.equals(viewModel.cellEditor?.getCell())).toBeTrue();
    expect(
      cellCoord.equals(viewModel.cellSelection?.body.getRanges()[0].getFrom())
    ).toBeTrue();

    cellCoord = createCellCoord(1, 1);
    operationExecutor.redo();
    expect(table.getCellValue(1, 1) === 'text').toBeTruthy();
    expect(cellCoord.equals(viewModel.cellEditor?.getCell())).toBeTrue();
    expect(
      cellCoord.equals(viewModel.cellSelection?.body.getRanges()[0].getFrom())
    ).toBeTrue();
  });

  it('cell style', (): void => {
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: FitTable = createTable<FitTable>();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    viewModel = createViewModel(table, operationExecutor);

    let cellCoord: CellCoord = createCellCoord(1, 1);
    viewModel.cellSelection?.body
      .removeRanges()
      .createRange()
      .addCell(cellCoord)
      .end();
    viewModel.cellEditor?.setCell(cellCoord);
    const controlId: FitToolbarControlId = 'bold';
    viewModel.toolbar?.getControl(controlId).run();
    expect(table.getStyle('s0')?.get('font-weight') === 'bold').toBeTruthy();
    expect(table.getCellStyleName(1, 1) === 's0').toBeTruthy();

    cellCoord = createCellCoord(0, 0);
    viewModel.cellSelection?.body
      .removeRanges()
      .createRange()
      .addCell(cellCoord)
      .end();
    viewModel.cellEditor?.setCell(cellCoord);
    operationExecutor.undo();
    cellCoord = createCellCoord(1, 1);
    expect(table.getStyle('s0')).toBeUndefined();
    expect(table.getCellStyleName(1, 1)).toBeUndefined();
    expect(cellCoord.equals(viewModel.cellEditor?.getCell())).toBeTrue();
    expect(
      cellCoord.equals(viewModel.cellSelection?.body.getRanges()[0].getFrom())
    ).toBeTrue();

    cellCoord = createCellCoord(1, 1);
    operationExecutor.redo();
    expect(table.getStyle('s0')?.get('font-weight') === 'bold').toBeTruthy();
    expect(table.getCellStyleName(1, 1) === 's0').toBeTruthy();
    expect(cellCoord.equals(viewModel.cellEditor?.getCell())).toBeTrue();
    expect(
      cellCoord.equals(viewModel.cellSelection?.body.getRanges()[0].getFrom())
    ).toBeTrue();
  });

  it('remove all rows', (): void => {
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: FitTable = createTable<FitTable>();
    const operationExecutor: OperationExecutor = createOperationExecutor();
    viewModel = createViewModel(table, operationExecutor);

    viewModel.cellSelection?.rowHeader
      ?.removeRanges()
      .createRange()
      .addCell(createCellCoord(0, 0))
      .addCell(createCellCoord(1, 0))
      .addCell(createCellCoord(2, 0))
      .addCell(createCellCoord(3, 0))
      .addCell(createCellCoord(4, 0))
      .end();
    const controlId: FitContextMenuControlId = 'row-remove';
    viewModel.contextMenu?.getControl(controlId).run();
    expect(table.getNumberOfRows() === 0).toBeTruthy();
    expect(viewModel.cellEditor?.isVisible()).toBeFalsy();
    expect(
      viewModel.cellSelectionPainter?.body.getRectangles().length === 0
    ).toBeTruthy();
  });
});
