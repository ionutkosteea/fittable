import {
  CellRange,
  MergedRegion,
  TableBasics,
  TableMergedRegions,
} from 'fit-core/model/index.js';
import {
  Id,
  OperationDto,
  OperationDtoFactory,
} from 'fit-core/operations/index.js';

import { MergedRegionsOperationStepDto } from '../../operation-steps/merged-regions/merged-regions-operation-step.js';

export type CellUnmergeOperationDtoArgs = Id<'cell-unmerge'> & {
  selectedCells: CellRange[];
};

export class CellUnmergeOperationDtoBuilder {
  private readonly mergedRegionsStep: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    create4CellRanges: [],
    remove4CellCoords: [],
  };
  private readonly undoMergedRegionsStep: MergedRegionsOperationStepDto = {
    id: 'merged-regions',
    create4CellRanges: [],
    remove4CellCoords: [],
  };

  constructor(
    private readonly table: TableBasics & TableMergedRegions,
    private readonly args: CellUnmergeOperationDtoArgs
  ) {}

  public build(): OperationDto {
    this.updateMergedRegions();
    return {
      id: this.args.id,
      steps: [this.mergedRegionsStep],
      undoOperation: { steps: [this.undoMergedRegionsStep] },
    };
  }

  private updateMergedRegions(): void {
    for (const cellRange of this.args.selectedCells) {
      this.table
        .getMergedRegions()
        ?.forEachRegion((region: MergedRegion): void => {
          const rowId: number = region.getFrom().getRowId();
          const colId: number = region.getFrom().getColId();
          cellRange.hasCell(rowId, colId) && this.removeRegion(region);
        });
    }
  }

  private removeRegion(region: CellRange): void {
    this.mergedRegionsStep.remove4CellCoords.push(region.getFrom().getDto());
    this.undoMergedRegionsStep.create4CellRanges.push(region.getDto());
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
