import {
  Table,
  CellRange,
  Style,
  TableStyles,
  createDto4CellRangeList,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export type StyleRemoveOperationDtoArgs = OperationId<'style-remove'> & {
  selectedCells: CellRange[];
};

export class StyleRemoveOperationDtoBuilder {
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

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleRemoveOperationDtoArgs
  ) {
    this.operationDto = {
      id: args.id,
      steps: [this.styleStepDto],
      undoOperation: { steps: [this.undoStyleStepDto] },
    };
  }

  public build(): OperationDto {
    const removableStyles: CellRangeAddressObjects<string> =
      this.getRemovableStyles();
    this.removeStyles(removableStyles);
    this.undoRemovedStyles(removableStyles);
    return this.operationDto;
  }

  private getRemovableStyles(): CellRangeAddressObjects<string> {
    const removableStyles: CellRangeAddressObjects<string> =
      new CellRangeAddressObjects();
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const styleName: string | undefined = //
          this.table.getCellStyleName(rowId, colId);
        styleName && removableStyles.set(styleName, rowId, colId);
      });
    }
    return removableStyles;
  }

  private removeStyles(styleNameMap: CellRangeAddressObjects<string>): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      this.table,
      this.args.selectedCells
    );
    styleNameMap.forEach((styleName: string, address: CellRange[]): void => {
      const cellRanges: unknown[] = createDto4CellRangeList(address);
      this.styleStepDto.cellStyleNames.push({ cellRanges });
      const numOfAllCells: number = allCellsCnt.get(styleName) ?? 0;
      const numOfSelectedCells: number = selectedCellsCnt.get(styleName) ?? 0;
      if (numOfAllCells === numOfSelectedCells) {
        this.styleStepDto.removeStyles.push(styleName);
      }
    });
  }

  private undoRemovedStyles(
    styleNameMap: CellRangeAddressObjects<string>
  ): void {
    styleNameMap.forEach((styleName: string, address: CellRange[]): void => {
      this.undoStyleStepDto.cellStyleNames.push({
        cellRanges: createDto4CellRangeList(address),
        styleName,
      });
    });
    this.styleStepDto.removeStyles.forEach((styleName: string): void => {
      const style: Style | undefined = this.table.getStyle(styleName);
      style &&
        this.undoStyleStepDto.createStyles.push({
          styleName,
          style: style.getDto(),
        });
    });
  }
}

export class StyleRemoveOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableStyles,
    args: StyleRemoveOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new StyleRemoveOperationDtoBuilder(table, args).build();
  }
}
