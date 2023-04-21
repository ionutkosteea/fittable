import {
  CellRange,
  TableBasics,
  TableMergedRegions,
} from 'fittable-core/model/index.js';
import {
  OperationId,
  OperationDto,
  OperationDtoFactory,
} from 'fittable-core/operations/index.js';

import { MergedRegionsOperationStepDto } from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

export type CellUnmergeOperationDtoArgs = OperationId<'cell-unmerge'> & {
  selectedCells: CellRange[];
};

export class CellUnmergeOperationDtoBuilder {
  private readonly mergedRegionsStep: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    removeRegions: [],
  };
  private readonly undoMergedRegionsStep: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    createRegions: [],
  };

  constructor(
    private readonly table: TableBasics & TableMergedRegions,
    private readonly args: CellUnmergeOperationDtoArgs
  ) {}

  public build(): OperationDto {
    this.removeExistingRegions();
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
}

export class CellUnmergeOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: TableBasics & TableMergedRegions,
    args: CellUnmergeOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new CellUnmergeOperationDtoBuilder(table, args).build();
  }
}
