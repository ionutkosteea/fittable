import { Table, TableMergedRegions } from 'fittable-core/model';
import {
  OperationId,
  OperationStep,
  OperationStepFactory,
} from 'fittable-core/operations';

export type RemoveRegion = { rowId: number; colId: number };
export type CreateRegion = RemoveRegion & {
  rowSpan?: number;
  colSpan?: number;
};
export type MoveRegion = RemoveRegion & {
  moveRow: number;
  moveCol: number;
};
export type IncreaseRegion = RemoveRegion & {
  increaseRow: number;
  increaseCol: number;
};

export type MergedRegionsOperationStepDto = OperationId<'merged-regions'> & {
  createRegions?: CreateRegion[];
  removeRegions?: RemoveRegion[];
  moveRegions?: MoveRegion[];
  increaseRegions?: IncreaseRegion[];
};

export class MergedRegionsOperationStep implements OperationStep {
  private removedRegionRowIds: Set<number> = new Set();

  constructor(
    private readonly table: Table & TableMergedRegions,
    private readonly stepDto: MergedRegionsOperationStepDto
  ) {}

  public run(): void {
    this.removeRegions();
    this.createRegions();
    this.increaseRegions();
    this.moveRegions();
    this.removeEmptyRowRegions();
  }

  private createRegions(): void {
    for (const r of this.stepDto?.createRegions ?? []) {
      this.table
        .setRowSpan(r.rowId, r.colId, r.rowSpan)
        .setColSpan(r.rowId, r.colId, r.colSpan);
    }
  }

  private removeRegions(): void {
    for (const r of this.stepDto?.removeRegions ?? []) {
      this.table.setRowSpan(r.rowId, r.colId).setColSpan(r.rowId, r.colId);
      this.removedRegionRowIds.add(r.rowId);
    }
  }

  private moveRegions(): void {
    for (const r of this.stepDto?.moveRegions ?? []) {
      this.table.moveRegion(r.rowId, r.colId, r.moveRow, r.moveCol);
      this.removedRegionRowIds.add(r.rowId);
    }
  }

  private increaseRegions(): void {
    for (const r of this.stepDto?.increaseRegions ?? []) {
      this.table.increaseRegion(r.rowId, r.colId, r.increaseRow, r.increaseCol);
    }
  }

  private removeEmptyRowRegions(): void {
    for (const rowId of this.removedRegionRowIds) {
      let isRowWithoutRegions = true;
      for (let colId = 0; colId < this.table.getNumberOfCols(); colId++) {
        const rowSpan: number | undefined = this.table.getRowSpan(rowId, colId);
        const colSpan: number | undefined = this.table.getColSpan(rowId, colId);
        if (rowSpan || colSpan) {
          isRowWithoutRegions = false;
          break;
        }
      }
      isRowWithoutRegions && this.table.removeRowRegions(rowId);
    }
  }
}

export class MergedRegionsOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableMergedRegions,
    stepDto: MergedRegionsOperationStepDto
  ): MergedRegionsOperationStep {
    return new MergedRegionsOperationStep(table, stepDto);
  }
}
