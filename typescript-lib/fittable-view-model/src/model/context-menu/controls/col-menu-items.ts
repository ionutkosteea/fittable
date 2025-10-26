import {
  asTableCols,
  CellRange,
  createLineRange,
  getLanguageDictionary,
  LineRange,
  LineRangeList,
  Table,
  Value,
} from 'fittable-core/model';
import {
  ControlArgs,
  ViewModelConfig,
  getViewModelConfig,
} from 'fittable-core/view-model';

import { FitControl } from '../../common/controls/fit-control.js';
import { FitInputControl } from '../../common/controls/fit-input-control.js';
import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createColResizeMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitInputControl {
  return new ColResizeMenuItem(hideWindowFn, args);
}

class ColResizeMenuItem extends FitInputControl {
  private readonly config: ViewModelConfig = getViewModelConfig();
  private width?: number;

  constructor(
    private readonly hideWindowFn: () => void,
    private readonly args: ControlArgs
  ) {
    super();
    this.setType('menu-item');
    this.setLabel((): string =>
      getLanguageDictionary().getText('Resize columns')
    );
    this.setIcon((): string | undefined => getImageRegistry().getUrl('width'));
    this.setValid((): boolean =>
      this.width === undefined
        ? true
        : this.width > 0 && this.width < 1000 && Number.isInteger(this.width)
    );
    this.setRun(this.createRunFn);
  }

  private readonly createRunFn = (): void => {
    if (this.isValid()) {
      this.args.operationExecutor.run(this.getArgs());
      this.width = undefined;
      this.hideWindowFn();
    } else {
      const oldValue: number | undefined = this.width;
      this.width = undefined;
      throw new Error('Invalid control value ' + oldValue);
    }
  };

  private readonly getArgs = (): FitUIOperationArgs => ({
    id: 'column-width',
    selectedLines: getSelectedCols(this.args.getSelectedCells()),
    dimension: this.width === this.config.colWidths ? undefined : this.width,
  });

  public override getValue(): number | undefined {
    return this.width ?? this.getColWidth();
  }

  private getColWidth(): number | undefined {
    const cellRange: CellRange | undefined = this.args.getSelectedCells()[0];
    if (!cellRange) return undefined;
    const colId: number = cellRange.getFrom().getColId();
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const colWidth: number | undefined = asTableCols(table)?.getColWidth(colId);
    return colWidth ?? this.config.colWidths;
  }

  public override setValue(value?: number): this {
    this.width = value;
    return this;
  }
}

export function createColInsertLeftMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitInputControl {
  const control: FitInputControl = new FitInputControl()
    .setType('menu-item')
    .setLabel((): string =>
      getLanguageDictionary().getText('Insert columns left')
    )
    .setIcon((): string | undefined => getImageRegistry().getUrl('insertLeft'))
    .setValueFn(() => 1);
  control.setValid((): boolean => isPositiveInteger(control.getValue()));
  control.setRun((): void => {
    if (control.isValid()) {
      const operationArgs: FitUIOperationArgs = {
        id: 'column-insert',
        selectedLines: getFirstLine(getSelectedCols(args.getSelectedCells())),
        numberOfNewLines: control.getValue() as number,
      };
      args.operationExecutor.run(operationArgs);
      control.setValue(1);
      hideWindowFn();
    } else {
      const oldValue: Value | undefined = control.getValue();
      control.setValue(1);
      throw new Error('Invalid control value ' + oldValue);
    }
  });
  return control;
}

export function createColInsertRightMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitInputControl {
  const control: FitInputControl = new FitInputControl()
    .setType('menu-item')
    .setLabel((): string =>
      getLanguageDictionary().getText('Insert columns right')
    )
    .setIcon((): string | undefined => getImageRegistry().getUrl('insertRight'))
    .setValueFn(() => 1);
  control.setValid((): boolean => isPositiveInteger(control.getValue()));
  control.setRun((): void => {
    if (control.isValid()) {
      const operationArgs: FitUIOperationArgs = {
        id: 'column-insert',
        selectedLines: getFirstLine(getSelectedCols(args.getSelectedCells())),
        numberOfNewLines: control.getValue() as number,
        insertAfter: true,
      };
      args.operationExecutor.run(operationArgs);
      control.setValue(1);
      hideWindowFn();
    } else {
      const oldValue: Value | undefined = control.getValue();
      control.setValue(1);
      throw new Error('Invalid control value ' + oldValue);
    }
  });
  return control;
}

export function createColRemoveMenuItem(
  hideWindowFn: () => void,
  args: ControlArgs
): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => getLanguageDictionary().getText('Remove columns'))
    .setIcon((): string | undefined => getImageRegistry().getUrl('remove'))
    .setRun((): void => {
      const operationArgs: FitUIOperationArgs = {
        id: 'column-remove',
        selectedLines: getSelectedCols(args.getSelectedCells()),
      };
      args.operationExecutor.run(operationArgs);
      hideWindowFn();
    });
}

function getSelectedCols(selectedCells: CellRange[]): LineRange[] {
  const lineRangeList: LineRangeList = new LineRangeList();
  selectedCells.forEach((cellRange: CellRange): void => {
    lineRangeList.add(
      createLineRange(
        cellRange.getFrom().getColId(),
        cellRange.getTo().getColId()
      )
    );
  });
  return lineRangeList.getRanges();
}

function getFirstLine(lineRanges: LineRange[]): LineRange[] {
  const resultLine: LineRange[] = [];
  const firstRange: LineRange | undefined = lineRanges[0];
  firstRange && resultLine.push(createLineRange(firstRange.getFrom()));
  return resultLine;
}

function isPositiveInteger(value?: Value): boolean {
  return value === undefined
    ? false
    : Number.isInteger(value) &&
        (value as number) > 0 &&
        (value as number) <= 80000;
}
