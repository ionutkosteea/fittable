import {
  CellCoord,
  CellRange,
  createCellCoord4Dto,
  createCellRange4Dto,
  MergedRegions,
  Table,
  TableMergedRegions,
} from 'fit-core/model/index.js';
import {
  Id,
  OperationStep,
  OperationStepFactory,
} from 'fit-core/operations/index.js';

export type MergedRegionsOperationStepDto = Id<'merged-regions'> & {
  create4CellRanges: unknown[];
  remove4CellCoords: unknown[];
};

export class MergedRegionsOperationStep implements OperationStep {
  private mergedRegions: MergedRegions;

  constructor(
    private readonly table: Table & TableMergedRegions,
    private readonly stepDto: MergedRegionsOperationStepDto
  ) {
    this.mergedRegions = this.table.getMergedRegions();
  }

  public run(): void {
    this.removeRegions();
    this.createRegions();
  }

  private removeRegions(): void {
    for (const cellCoordDto of this.stepDto.remove4CellCoords) {
      const cellCoord: CellCoord = createCellCoord4Dto(cellCoordDto);
      this.mergedRegions.removeRegion(cellCoord);
    }
  }

  private createRegions(): void {
    for (const cellRangeDto of this.stepDto.create4CellRanges) {
      const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
      this.mergedRegions.addRegion(cellRange.getFrom(), cellRange.getTo());
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
