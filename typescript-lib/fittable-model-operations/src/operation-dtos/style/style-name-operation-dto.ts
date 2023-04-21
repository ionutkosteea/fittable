import {
  Table,
  CellRange,
  TableStyles,
  Style,
  createDto4CellRangeList,
} from 'fittable-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { countAllCellStyleNames } from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export type StyleNameOperationDtoArgs = OperationId<'style-name'> & {
  selectedCells: CellRange[];
  styleName?: string;
};

export class StyleNameOperationDtoBuilder {
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly operationDto: OperationDto;

  private oldStyleNames: CellRangeAddressObjects<string | undefined>;

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleNameOperationDtoArgs
  ) {
    this.operationDto = {
      id: this.args.id,
      steps: [this.styleStepDto],
      undoOperation: { steps: [this.undoStyleStepDto] },
    };
    this.oldStyleNames = new CellRangeAddressObjects();
  }

  public build(): OperationDto {
    this.markOldStyleNames();
    this.updateCellStyleNames();
    this.updateStyles();
    return this.operationDto;
  }

  private markOldStyleNames(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldStyleName: string | undefined = //
          this.table.getCellStyleName(rowId, colId);
        oldStyleName !== this.args.styleName &&
          this.oldStyleNames.set(oldStyleName, rowId, colId);
      });
    }
  }

  private updateCellStyleNames(): void {
    const cellRanges: CellRange[] = this.oldStyleNames.getAllAddresses();
    this.styleStepDto.cellStyleNames.push({
      cellRanges: createDto4CellRangeList(cellRanges),
      styleName: this.args.styleName,
    });
    this.oldStyleNames.forEach(
      (styleName: string | undefined, address: CellRange[]) => {
        this.undoStyleStepDto.cellStyleNames.push({
          cellRanges: createDto4CellRangeList(address),
          styleName,
        });
      }
    );
  }

  private updateStyles(): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    this.oldStyleNames.forEach(
      (styleName: string | undefined, updatableCells: CellRange[]): void => {
        if (!styleName) return;
        const numOfUndoCells: number =
          this.calculateNumberOfCells(updatableCells);
        const numOfAllCells: number | undefined = allCellsCnt.get(styleName);
        if (numOfUndoCells < (numOfAllCells ?? 0)) return;
        this.styleStepDto.removeStyles.push(styleName);
        const style: Style | undefined = this.table.getStyle(styleName);
        if (!style) return;
        this.undoStyleStepDto.createStyles.push({
          styleName,
          style: style.getDto(),
        });
      }
    );
  }

  private calculateNumberOfCells(cellRanges: CellRange[]): number {
    let numberOfCells = 0;
    cellRanges.forEach((cellRange: CellRange) => {
      numberOfCells += this.calculateNumberOfExistingCells(cellRange);
    });
    return numberOfCells;
  }

  private calculateNumberOfExistingCells(cellRange: CellRange): number {
    let numberOfCells = 0;
    cellRange.forEachCell((rowId: number, colId: number): void => {
      this.table.hasCell(rowId, colId) && numberOfCells++;
    });
    return numberOfCells;
  }
}

export class StyleNameOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableStyles,
    args: StyleNameOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new StyleNameOperationDtoBuilder(table, args).build();
  }
}
