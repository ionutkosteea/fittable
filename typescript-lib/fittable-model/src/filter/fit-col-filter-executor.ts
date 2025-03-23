import {
  ColFilterExecutor,
  ColConditionFn,
  ColFilterExecutorFactory,
} from 'fittable-core/model';
import { FitTable } from '../table/fit-table.js';

export type FitColCondition = {
  table: FitTable;
  conditionFn: ColConditionFn;
};

export class FitColFilterExecutor implements ColFilterExecutor {
  private readonly conditions: Map<number, FitColCondition> = new Map();
  private filteredTable?: FitTable;

  constructor(public readonly table: FitTable) { }

  public addCondition(colId: number, conditionFn: ColConditionFn): this {
    this.conditions.set(colId, {
      table: this.filteredTable ?? this.table,
      conditionFn,
    });
    return this;
  }

  public removeCondition(colId: number): this {
    this.conditions.delete(colId);
    return this;
  }

  public hasCondition(colId: number): boolean {
    return this.conditions.has(colId);
  }

  public clearConditions(): this {
    this.conditions.clear();
    return this;
  }

  public getTable(colId: number): FitTable | undefined {
    return this.conditions.get(colId)?.table;
  }

  public run(): this {
    if (this.conditions.size > 0) {
      let table: FitTable = this.table;
      for (const entry of this.conditions.entries()) {
        const colId: number = entry[0];
        const filter: FitColCondition = entry[1];
        filter.table = table;
        table = table.filterByCol(colId, filter.conditionFn);
      }
      this.filteredTable = table;
    } else {
      this.filteredTable = undefined;
    }
    return this;
  }

  public getFilteredTable(): FitTable | undefined {
    return this.filteredTable;
  }
}

export class FitColFilterExecutorFactory implements ColFilterExecutorFactory {
  public createColFilterExecutor(table: FitTable): ColFilterExecutor {
    return new FitColFilterExecutor(table);
  }
}
