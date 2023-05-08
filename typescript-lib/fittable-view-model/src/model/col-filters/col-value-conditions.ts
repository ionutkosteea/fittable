import { ValueCondition } from 'fittable-core/view-model';

export type ColValueCondition = {
  mode: 'Select all' | 'Clear';
  values: Set<string | undefined>;
};

export class ColValueConditions {
  public current: ColValueCondition = { mode: 'Select all', values: new Set() };
  public readonly store: { [colId: number]: ValueCondition } = {};

  public loadCol(colId: number): void {
    if (colId in this.store) {
      const condition: ValueCondition = this.store[colId];
      this.current = {
        mode: condition.mode,
        values: new Set(condition.values),
      };
    } else {
      this.current = { mode: 'Select all', values: new Set() };
    }
  }
}
