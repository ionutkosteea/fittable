import { Subscription, Observable } from 'rxjs';

import { implementsTKeys } from 'fittable-core/common';
import {
  CellRange,
  ColFilterExecutor,
  createCellRangeList4Dto,
  Table,
  TableBasics,
  TableColFilters,
  Value,
} from 'fittable-core/model';
import {
  TableChanges,
  OperationExecutor,
  Args,
} from 'fittable-core/operations';
import {
  ColFilters,
  ValueCondition,
  Container,
  Window,
  Control,
  CellEditor,
} from 'fittable-core/view-model';

import { FitControl } from '../common/controls/fit-control.js';
import { FitUIOperationId } from '../operation-executor/operation-args.js';
import { FitToolbarControlId } from '../toolbar/fit-toolbar-factory.js';
import { FitContextMenuControlId } from '../context-menu/fit-context-menu-factory.js';
import {
  bindColFilterOperationFactories,
  ColFilterChange,
} from './col-filter-operation.js';

type FitTable = TableBasics & TableColFilters;

export type ColFilterOperationSubscriptionsArgs = {
  operationExecutor: OperationExecutor;
  colFilters: ColFilters;
  loadTableFn: (table: Table) => void;
  toolbar?: Container;
  contextMenu?: Window;
  cellEditor?: CellEditor;
};

type CellValueDto = {
  cellRanges: unknown[];
  value?: Value;
};
type CellValueChange = Args<'cell-value'> & {
  values: CellValueDto[];
};
type CellValueChanges = Args<'cell-value'> & {
  changes: CellValueChange[];
};

export class ColFilterOperationSubscriptions {
  private readonly subscriptions: Subscription[] = [];

  constructor(private readonly args: ColFilterOperationSubscriptionsArgs) {
    this.addFilterOperationListener();
    this.addCellValueOperationListener();
  }

  private addFilterOperationListener(): void {
    bindColFilterOperationFactories(this.args.operationExecutor);
    this.subscriptions.push(this.applyFilterAfterRun$());
    this.subscriptions.push(this.applyFilterAfterUndo$());
    this.subscriptions.push(this.applyFilterAfterRedo$());
  }

  private applyFilterAfterRun$(): Subscription {
    return this.args.operationExecutor
      .onAfterRun$()
      .subscribe((tableChanges: TableChanges): void => {
        const id: FitUIOperationId = 'column-filter';
        if (tableChanges.id !== id) return;
        const change: ColFilterChange = tableChanges
          .changes[0] as ColFilterChange;
        const condition: ValueCondition | undefined = change.valueCondition;
        if (condition && !this.isSelectAll(condition)) {
          this.args.colFilters.getValueConditions()[change.colId] = condition;
        } else if (change.colId in this.args.colFilters.getValueConditions()) {
          delete this.args.colFilters.getValueConditions()[change.colId];
        }
        this.applyFilter();
      });
  }

  private applyFilterAfterUndo$(): Subscription {
    return this.args.operationExecutor
      .onAfterUndo$()
      .subscribe((tableChanges: TableChanges): void => {
        const id: FitUIOperationId = 'column-filter';
        if (tableChanges.id !== id) return;
        if (!tableChanges.undoChanges) return;
        const change: ColFilterChange = tableChanges
          .changes[0] as ColFilterChange;
        const undoChange: ColFilterChange = tableChanges.undoChanges
          .changes[0] as ColFilterChange;
        const conditions: { [colId: number]: ValueCondition } =
          this.args.colFilters.getValueConditions();
        delete conditions[change.colId];
        if (undoChange.valueCondition) {
          conditions[undoChange.colId] = undoChange.valueCondition;
        }
        this.applyFilter();
      });
  }

  private applyFilterAfterRedo$(): Subscription {
    return this.args.operationExecutor
      .onAfterRedo$()
      .subscribe((tableChanges: TableChanges): void => {
        const id: FitUIOperationId = 'column-filter';
        if (tableChanges.id !== id) return;
        if (!tableChanges.undoChanges) return;
        const changes: ColFilterChange = tableChanges
          .changes[0] as ColFilterChange;
        const undoChanges: ColFilterChange = tableChanges.undoChanges
          .changes[0] as ColFilterChange;
        const conditions: { [colId: number]: ValueCondition } =
          this.args.colFilters.getValueConditions();
        delete conditions[undoChanges.colId];
        const condition: ValueCondition | undefined = changes.valueCondition;
        if (condition && !this.isSelectAll(condition)) {
          conditions[changes.colId] = condition;
        }
        this.applyFilter();
      });
  }

  private readonly isSelectAll = (condition: ValueCondition): boolean =>
    condition.mode === 'Select all' && condition.values.length === 0;

  private applyFilter(): void {
    const filterExecutor: ColFilterExecutor =
      this.args.colFilters.filterExecutor.clearConditions();
    for (const key of Object.keys(this.args.colFilters.getValueConditions())) {
      const colId = Number(key);
      filterExecutor.addCondition(colId, this.getValueCondition);
    }
    const table: FitTable | undefined = filterExecutor.run().getFilteredTable();
    this.args.loadTableFn(table ?? filterExecutor.table);
    const isTableFiltered: boolean = table !== undefined;
    this.toggleToolbarItems(isTableFiltered);
    this.toggleContextMenuItems(isTableFiltered);
  }

  private getValueCondition = (
    rowId: number,
    colId: number,
    value?: Value
  ): boolean => {
    if (colId === undefined) return false;
    const condition: ValueCondition | undefined =
      this.args.colFilters.getValueConditions()[colId];
    if (condition) {
      const valueAsString: string | undefined = this.getValueAsString(value);
      const hasValue: boolean = condition.values.includes(valueAsString);
      return condition.mode === 'Select all' ? !hasValue : hasValue;
    } else {
      return true;
    }
  };

  private readonly getValueAsString = (value?: Value): string | undefined =>
    value === undefined ? undefined : '' + value;

  private toggleToolbarItems(isTableFiltered: boolean): void {
    const enabledControlIds: Set<string> = //
      new Set<FitToolbarControlId>(['undo', 'redo']);
    for (const id of this.args.toolbar?.getControlIds() ?? []) {
      if (enabledControlIds.has(id)) continue;
      const control: Control | undefined = this.args.toolbar?.getControl(id);
      if (!implementsTKeys<FitControl>(control, ['setDisabled'])) continue;
      control.setDisabled(isTableFiltered);
    }
  }

  private toggleContextMenuItems(isTableFiltered: boolean): void {
    const enabledControlIds: Set<string> = new Set<FitContextMenuControlId>(['copy', 'paste']);
    for (const id of this.args.contextMenu?.getControlIds() ?? []) {
      if (enabledControlIds.has(id)) continue;
      const control: Control | undefined = this.args.contextMenu?.getControl(id);
      if (!implementsTKeys<FitControl>(control, ['setDisabled'])) continue;
      control.setDisabled(isTableFiltered);
    }
  }

  private addCellValueOperationListener(): void {
    const oe: OperationExecutor = this.args.operationExecutor;
    this.updateValueConditions(oe.onBeforeRun$(), this.getCellValues);
    this.updateValueConditions(oe.onBeforeUndo$(), this.getUndoCellValues);
    this.updateValueConditions(oe.onBeforeRedo$(), this.getCellValues);
  }

  private updateValueConditions(
    operation$: Observable<TableChanges>,
    cellValuesFn: (tableChanges: TableChanges) => CellValueDto[]
  ): void {
    const subscription: Subscription = operation$.subscribe(
      (tableChanges: TableChanges): void => {
        const id: FitUIOperationId = 'cell-value';
        if (tableChanges.id !== id) return;
        const filterExecutor: ColFilterExecutor =
          this.args.colFilters.filterExecutor;
        const table: Table | undefined = filterExecutor.getFilteredTable();
        if (!table) return;
        for (const valueDto of cellValuesFn(tableChanges)) {
          this.updateValueConditionsFromCellValueDto(table, valueDto);
        }
      }
    );
    this.subscriptions.push(subscription);
  }

  private readonly getCellValues = (
    tableChanges: TableChanges
  ): CellValueDto[] => {
    const changes: CellValueChanges = tableChanges as CellValueChanges;
    return changes.changes[0].values;
  };

  private readonly getUndoCellValues = (
    tableChanges: TableChanges
  ): CellValueDto[] => {
    const changes: CellValueChanges =
      tableChanges.undoChanges as CellValueChanges;
    return changes.changes[0].values;
  };

  private updateValueConditionsFromCellValueDto(
    table: Table,
    valueDto: CellValueDto
  ): void {
    const cellRanges: CellRange[] = //
      createCellRangeList4Dto(valueDto.cellRanges);
    if (cellRanges.length <= 0) return;
    for (const cellRange of cellRanges) {
      const rowId: number = cellRange.getFrom().getRowId();
      const fromColId: number = cellRange.getFrom().getColId();
      const toColId: number = cellRange.getTo().getColId();
      for (let colId = fromColId; colId <= toColId; colId++) {
        const oldValue: Value | undefined = table.getCellValue(rowId, colId);
        const condition: ValueCondition | undefined = //
          this.args.colFilters.getValueConditions()[colId];
        const oldValueString: string | undefined = //
          oldValue ? '' + oldValue : undefined;
        if (!condition || !condition.values.includes(oldValueString)) continue;
        const i: number = condition.values.indexOf(oldValueString);
        if (i < 0) continue;
        const newValueString: string | undefined = //
          valueDto.value ? '' + valueDto.value : undefined;
        condition.values.splice(i, 1, newValueString);
      }
    }
  }

  public destroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}
