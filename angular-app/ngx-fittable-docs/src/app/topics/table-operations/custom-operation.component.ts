import { Component, OnInit } from '@angular/core';

import {
  CellCoord,
  createCellCoord,
  createTable,
  registerModelConfig,
  Table,
  Value,
} from 'fittable-core/model';
import {
  Args,
  TableChanges,
  TableChangesFactory,
  TableChangeWritter,
  TableChangeWritterFactory,
  registerOperationConfig,
} from 'fittable-core/operations';
import {
  createFittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { createFitViewModelConfig } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'custom-operation',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
})
export class CustomOperationComponent extends ConsoleTopic implements OnInit {
  public readonly title: TopicTitle = 'Custom operation';
  public readonly buttonText = 'Add value to cell B2';

  constructor() {
    super();
    this.typescriptCode = [
      { image: 'custom-operation-ts-01.jpg' },
      { image: 'custom-operation-ts-02.jpg' },
      { image: 'custom-operation-ts-03.jpg' },
      { image: 'custom-operation-ts-04.jpg' },
    ];
  }

  public override ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(
      createFitViewModelConfig({ rowHeader: true, colHeader: true })
    );

    this.fit = createFittableDesigner(createTable()); // FitTable default: 5 rows, 5 cols

    this.fit.operationExecutor
      ?.bindTableChangesFactory('dummy-operation', DummyChangesFactory)
      .bindTableChangeWritterFactory('dummy-change', DummyChangeWritterFactory);
  }

  public runOperation(): void {
    const args: DummyArgs = {
      id: 'dummy-operation',
      cellCoord: createCellCoord(1, 1),
      value: 'Dummy value',
    };
    const changes: TableChanges = this.fit.operationExecutor //
      ?.calculateTableChanges(args) as TableChanges;
    this.consoleText = JSON.stringify(changes, null, 2);
    this.fit.operationExecutor?.writeTableChanges(changes);
  }
}

type DummyChange = Args<'dummy-change'> & {
  rowId?: number;
  colId?: number;
  value?: Value;
};
class DummyChangeWritter implements TableChangeWritter {
  constructor(private table: Table, private change: DummyChange) {}
  run(): void {
    const rowId: number | undefined = this.change.rowId;
    const colId: number | undefined = this.change.colId;
    if (!rowId || !colId) return;
    this.table.setCellValue(rowId, colId, this.change.value);
  }
}
class DummyChangeWritterFactory implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table,
    change: DummyChange
  ): TableChangeWritter {
    return new DummyChangeWritter(table, change);
  }
}

type DummyArgs = Args<'dummy-operation'> & {
  cellCoord: CellCoord;
  value: Value;
};
class DummyChangesBuilder {
  private dummyChange: DummyChange = {
    id: 'dummy-change',
  };
  private dummyUndoChange: DummyChange = {
    id: 'dummy-change',
  };
  private changes: TableChanges;
  constructor(private table: Table, private args: DummyArgs) {
    this.changes = {
      id: args.id,
      changes: [this.dummyChange],
      undoChanges: { changes: [this.dummyUndoChange] },
    };
  }
  build(): TableChanges {
    if (this.getOldValue() !== this.args.value) {
      this.prepareUpdate();
      this.prepareUndo();
    }
    return this.changes;
  }
  private prepareUpdate(): void {
    this.dummyChange.rowId = this.args.cellCoord.getRowId();
    this.dummyChange.colId = this.args.cellCoord.getColId();
    this.dummyChange.value = this.args.value;
  }
  private prepareUndo(): void {
    const rowId: number = this.args.cellCoord.getRowId();
    const colId: number = this.args.cellCoord.getColId();
    this.dummyUndoChange.rowId = rowId;
    this.dummyUndoChange.colId = colId;
    this.dummyUndoChange.value = this.getOldValue();
  }
  private getOldValue(): Value | undefined {
    const rowId: number = this.args.cellCoord.getRowId();
    const colId: number = this.args.cellCoord.getColId();
    return this.table.getCellValue(rowId, colId);
  }
}
class DummyChangesFactory implements TableChangesFactory {
  createTableChanges(
    table: Table,
    args: DummyArgs
  ): TableChanges | Promise<TableChanges> {
    return new DummyChangesBuilder(table, args).build();
  }
}
