import {
  Table,
  Style,
  TableStyles,
  createCellRange4Dto,
  createStyle4Dto,
  CellRange,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  OperationId,
} from 'fit-core/operations/index.js';

export type CellStyleNameDto = {
  cellRanges: unknown[];
  styleName?: string;
};

export type StyleEntryDto = { styleName: string; style: unknown };

export type StyleOperationStepDto = OperationId<'style-changes'> & {
  cellStyleNames: CellStyleNameDto[];
  createStyles: StyleEntryDto[];
  updateStyles: StyleEntryDto[];
  removeStyles: string[];
};

export class StyleOperationStep implements OperationStep {
  constructor(
    private readonly table: Table & TableStyles,
    public readonly stepDto: StyleOperationStepDto
  ) {}

  public run(): void {
    this.updateCellStyleNames();
    this.createStyles();
    this.updateStyles();
    this.removeStyles();
  }

  private updateCellStyleNames(): void {
    for (const cellStyleNameDto of this.stepDto.cellStyleNames) {
      if (cellStyleNameDto.styleName) {
        this.updateDefinedStyleName(
          cellStyleNameDto.cellRanges,
          cellStyleNameDto.styleName
        );
      } else {
        this.updateUndefinedStyleName(cellStyleNameDto.cellRanges);
      }
    }
  }

  private updateDefinedStyleName(
    updatableCells: unknown[],
    styleName: string
  ): void {
    for (const cellRangeDto of updatableCells) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number): void => {
          this.table.setCellStyleName(rowId, colId, styleName);
        }
      );
    }
  }

  private updateUndefinedStyleName(updatableCells: unknown[]): void {
    for (const cellRangeDto of updatableCells) {
      const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
      const fromRowId: number = cellRange.getFrom().getRowId();
      const toRowId: number = cellRange.getTo().getRowId();
      const fromColId: number = cellRange.getFrom().getColId();
      const toColId: number = cellRange.getTo().getColId();
      for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
        for (let colId: number = fromColId; colId <= toColId; colId++) {
          this.table.setCellStyleName(rowId, colId);
        }
        this.removeRowIfEmpty(rowId);
      }
    }
  }

  private removeRowIfEmpty(rowId: number): void {
    let isEmptyRow = true;
    for (let colId = 0; colId < this.table.getNumberOfCols(); colId++) {
      if (this.table.hasCell(rowId, colId)) {
        isEmptyRow = false;
        break;
      }
    }
    if (isEmptyRow) this.table.removeRowCells(rowId);
  }

  private createStyles(): void {
    for (const createStyleDto of this.stepDto.createStyles) {
      const style: Style = createStyle4Dto(createStyleDto.style).clone();
      style.forEach((name: string, value?: string | number) => {
        !value && style.remove(name);
        return true;
      });
      style.hasProperties() &&
        this.table.addStyle(createStyleDto.styleName, style);
    }
  }

  private updateStyles(): void {
    for (const updateStyleDto of this.stepDto.updateStyles) {
      const styleName: string = updateStyleDto.styleName;
      const style: Style | undefined = this.table.getStyle(styleName);
      if (!style) throw new Error('Invalid style name ' + styleName);
      createStyle4Dto(updateStyleDto.style).forEach(
        (name: string, value?: string | number) => {
          style.set(name, value);
          return true;
        }
      );
    }
  }

  private removeStyles(): void {
    for (const styleName of this.stepDto.removeStyles) {
      this.table.removeStyle(styleName);
    }
  }
}

export class StyleOperationStepFactory implements OperationStepFactory {
  public createStep(
    table: Table & TableStyles,
    stepDto: StyleOperationStepDto
  ): OperationStep {
    return new StyleOperationStep(table, stepDto);
  }
}
