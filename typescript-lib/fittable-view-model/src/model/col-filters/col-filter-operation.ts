import { Table } from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  OperationExecutor,
  Args,
  TableChangeWritter,
  TableChangeWritterFactory,
} from 'fittable-core/operations';
import { ValueCondition } from 'fittable-core/view-model';

export type ColFilterChange = Args<'column-filter'> & {
  colId: number;
  valueCondition?: ValueCondition;
};

class ColFilterChangeWritter implements TableChangeWritter {
  public run(): void {
    // The operation is used just for handling filters through the operation execution stack. The actual filtering is done via specific listeners.
  }
}

class ColFilterChangeWritterFactory implements TableChangeWritterFactory {
  public createTableChangeWritter(): TableChangeWritter {
    return new ColFilterChangeWritter();
  }
}

export type ColFilterArgs = Args<'column-filter'> & {
  changes: ColFilterChange;
  undoChanges: ColFilterChange;
};

class ColFilterChangesFactory implements TableChangesFactory {
  public createTableChanges(table: Table, args: ColFilterArgs): TableChanges {
    return {
      id: args.id,
      changes: [args.changes],
      undoChanges: {
        changes: [args.undoChanges],
      },
    };
  }
}

export function bindColFilterOperationFactories(
  operationExecutor: OperationExecutor
): void {
  const changeId: ColFilterChange['id'] = 'column-filter';
  const operationId: ColFilterArgs['id'] = 'column-filter';
  operationExecutor
    .bindTableChangesFactory(operationId, ColFilterChangesFactory)
    .bindTableChangeWritterFactory(changeId, ColFilterChangeWritterFactory);
}
