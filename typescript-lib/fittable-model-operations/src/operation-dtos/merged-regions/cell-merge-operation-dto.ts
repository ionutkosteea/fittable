import {
  CellRange,
  TableBasics,
  TableMergedRegions,
} from 'fittable-core/model';
import {
  OperationId,
  OperationDto,
  OperationDtoFactory,
} from 'fittable-core/operations';

import { MergedRegionsOperationStepDto } from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

export type CellMergeOperationDtoArgs = OperationId<'cell-merge'> & {
  selectedCells: CellRange[];
};

export class CellMergeOperationDtoBuilder {
  private readonly mergedRegionsStep: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    createRegions: [],
    removeRegions: [],
  };
  private readonly undoMergedRegionsStep: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    createRegions: [],
    removeRegions: [],
  };

  constructor(
    private readonly table: TableBasics & TableMergedRegions,
    private readonly args: CellMergeOperationDtoArgs
  ) {}

  public build(): OperationDto {
    this.removeExistingRegions();
    this.createRegions();
    return {
      id: this.args.id,
      steps: [this.mergedRegionsStep],
      undoOperation: { steps: [this.undoMergedRegionsStep] },
    };
  }

  private removeExistingRegions(): void {
    for (const cellRange of this.args.selectedCells) {
      this.table.forEachMergedCell((rowId: number, colId: number): void => {
        if (!cellRange.hasCell(rowId, colId)) return;
        this.mergedRegionsStep.removeRegions?.push({ rowId, colId });
        this.undoMergedRegionsStep.createRegions?.push({
          rowId,
          colId,
          rowSpan: this.table.getRowSpan(rowId, colId),
          colSpan: this.table.getColSpan(rowId, colId),
        });
      });
    }
  }

  private createRegions(): void {
    for (const cellRange of this.args.selectedCells) {
      const rowId: number = cellRange.getFrom().getRowId();
      const colId: number = cellRange.getFrom().getColId();
      let rowSpan: number | undefined = cellRange.getTo().getRowId() - rowId;
      rowSpan = rowSpan === 0 ? undefined : rowSpan + 1;
      let colSpan: number | undefined = cellRange.getTo().getColId() - colId;
      colSpan = colSpan === 0 ? undefined : colSpan + 1;
      this.mergedRegionsStep.createRegions?.push({
        rowId,
        colId,
        rowSpan,
        colSpan,
      });
      this.undoMergedRegionsStep.removeRegions?.push({ rowId, colId });
    }
  }
}

export class CellMergeOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: TableBasics & TableMergedRegions,
    args: CellMergeOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new CellMergeOperationDtoBuilder(table, args).build();
  }
}
