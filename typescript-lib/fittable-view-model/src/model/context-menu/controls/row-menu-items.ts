import {
  asTableRows,
  CellRange,
  createLineRange,
  LineRange,
  LineRangeList,
  Table,
  Value,
} from 'fittable-core/model';
import { ViewModelConfig, getViewModelConfig } from 'fittable-core/view-model';

import { FitControl } from '../../common/controls/fit-control.js';
import { FitInputControl } from '../../common/controls/fit-input-control.js';
import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { FitControlArgs } from '../../toolbar/controls/common/fit-control-args.js';

export function createRowResizeMenuItem(args: FitControlArgs): FitInputControl {
  return new RowResizeMenuItem(args);
}

class RowResizeMenuItem extends FitInputControl {
  private readonly config: ViewModelConfig = getViewModelConfig();
  private height?: number;

  constructor(private readonly args: FitControlArgs) {
    super();
    this.setType('menu-item');
    this.setLabel((): string => args.dictionary.getText('Resize rows'));
    this.setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('height')
    );
    this.setValid((): boolean =>
      this.height === undefined
        ? true
        : this.height > 0 && this.height < 1000 && Number.isInteger(this.height)
    );
    this.setRun(this.createRunFn);
  }

  private readonly createRunFn = (): void => {
    if (this.isValid()) {
      this.args.operationExecutor.run(this.getArgs());
      this.height = undefined;
    } else {
      const oldValue: number | undefined = this.height;
      this.height = undefined;
      throw new Error('Invalid control value ' + oldValue);
    }
  };

  private readonly getArgs = (): FitUIOperationArgs => ({
    id: 'row-height',
    selectedLines: getSelectedRows(this.args.getSelectedCells()),
    dimension: this.height === this.config.rowHeights ? undefined : this.height,
  });

  public override getValue(): number | undefined {
    return this.height ?? this.getRowHeight();
  }

  private getRowHeight(): number | undefined {
    const cellRange: CellRange | undefined = this.args.getSelectedCells()[0];
    if (!cellRange) return undefined;
    const rowId: number = cellRange.getFrom().getRowId();
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const rowHeight: number | undefined =
      asTableRows(table)?.getRowHeight(rowId);
    return rowHeight ?? this.config.rowHeights;
  }

  public override setValue(value?: number): this {
    this.height = value;
    return this;
  }
}

export function createRowInsertAboveMenuItem(
  args: FitControlArgs
): FitInputControl {
  const control: FitInputControl = new FitInputControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Insert rows above'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('insertAbove')
    )
    .setValueFn(() => 1);
  control.setValid((): boolean => isPositiveInteger(control.getValue()));
  control.setRun((): void => {
    if (control.isValid()) {
      const operationArgs: FitUIOperationArgs = {
        id: 'row-insert',
        selectedLines: getFirstLine(getSelectedRows(args.getSelectedCells())),
        numberOfNewLines: control.getValue() as number,
      };
      args.operationExecutor.run(operationArgs);
      control.setValue(1);
    } else {
      const oldValue: Value | undefined = control.getValue();
      control.setValue(1);
      throw new Error('Invalid control value ' + oldValue);
    }
  });
  return control;
}

export function createRowInsertBelowMenuItem(
  args: FitControlArgs
): FitInputControl {
  const control: FitInputControl = new FitInputControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Insert rows below'))
    .setIcon((): string | undefined =>
      args.imageRegistry.getImageUrl('insertBelow')
    )
    .setValueFn(() => 1);
  control.setValid((): boolean => isPositiveInteger(control.getValue()));
  control.setRun((): void => {
    if (control.isValid()) {
      const operationArgs: FitUIOperationArgs = {
        id: 'row-insert',
        selectedLines: getFirstLine(getSelectedRows(args.getSelectedCells())),
        numberOfNewLines: control.getValue() as number,
        insertAfter: true,
      };
      args.operationExecutor.run(operationArgs);
      control.setValue(1);
    } else {
      const oldValue: Value | undefined = control.getValue();
      control.setValue(1);
      throw new Error('Invalid control value ' + oldValue);
    }
  });
  return control;
}

export function createRowRemoveMenuItem(args: FitControlArgs): FitControl {
  return new FitControl()
    .setType('menu-item')
    .setLabel((): string => args.dictionary.getText('Remove rows'))
    .setIcon((): string | undefined => args.imageRegistry.getImageUrl('remove'))
    .setRun((): void => {
      const operationArgs: FitUIOperationArgs = {
        id: 'row-remove',
        selectedLines: getSelectedRows(args.getSelectedCells()),
      };
      args.operationExecutor.run(operationArgs);
    });
}

function getSelectedRows(selectedCells: CellRange[]): LineRange[] {
  const lineRangeList: LineRangeList = new LineRangeList();
  selectedCells.forEach((cellRange: CellRange): void => {
    lineRangeList.add(
      createLineRange(
        cellRange.getFrom().getRowId(),
        cellRange.getTo().getRowId()
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
        (value as number) <= 400000;
}
