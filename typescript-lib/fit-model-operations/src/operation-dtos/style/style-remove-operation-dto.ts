import {
  Table,
  CellRange,
  Style,
  TableStyles,
  createDto4CellRangeList,
  asCellStyle,
  Cell,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  Id,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
} from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export type StyleRemoveOperationDtoArgs = Id<'style-remove'> & {
  selectedCells: CellRange[];
};

export class StyleRemoveOperationDtoBuilder {
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style',
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
      cellRange.forEachCell((rowId: number, colId: number) => {
        const styleName: string | undefined = this.getStyleName(rowId, colId);
        styleName && removableStyles.set(styleName, rowId, colId);
      });
    }
    return removableStyles;
  }

  private getStyleName(rowId: number, colId: number): string | undefined {
    const cell: Cell | undefined = this.table.getCell(rowId, colId);
    return asCellStyle(cell)?.getStyleName();
  }

  private removeStyles(styleNameMap: CellRangeAddressObjects<string>): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      this.table,
      this.args.selectedCells
    );
    styleNameMap.forEach((styleName: string, address: CellRange[]) => {
      const updatableCellRanges: unknown[] = createDto4CellRangeList(address);
      this.styleStepDto.cellStyleNames.push({ updatableCellRanges });
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
    styleNameMap.forEach((styleName: string, address: CellRange[]) => {
      this.undoStyleStepDto.cellStyleNames.push({
        updatableCellRanges: createDto4CellRangeList(address),
        styleName,
      });
    });
    this.styleStepDto.removeStyles.forEach((styleName: string) => {
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
