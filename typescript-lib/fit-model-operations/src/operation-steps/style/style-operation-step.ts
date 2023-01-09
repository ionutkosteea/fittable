import {
  Table,
  Cell,
  Style,
  TableStyles,
  createCell,
  createCellRange4Dto,
  asCellStyle,
  createStyle4Dto,
} from 'fit-core/model/index.js';
import {
  OperationStep,
  OperationStepFactory,
  Id,
} from 'fit-core/operations/index.js';

export type CellStyleNameDto = {
  updatableCellRanges: unknown[];
  styleName?: string;
};

export type StyleEntryDto = { styleName: string; style: unknown };

export type StyleOperationStepDto = Id<'style'> & {
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
          cellStyleNameDto.updatableCellRanges,
          cellStyleNameDto.styleName
        );
      } else {
        this.updateUndefinedStyleName(cellStyleNameDto.updatableCellRanges);
      }
    }
  }

  private updateDefinedStyleName(
    updatableCells: unknown[],
    styleName: string
  ): void {
    for (const cellRangeDto of updatableCells) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number) => {
          let cell: Cell | undefined = this.table.getCell(rowId, colId);
          if (cell) {
            asCellStyle(cell)?.setStyleName(styleName);
          } else {
            const cell: Cell = createCell();
            asCellStyle(cell)?.setStyleName(styleName);
            this.table.addCell(rowId, colId, cell);
          }
        }
      );
    }
  }

  private updateUndefinedStyleName(updatableCells: unknown[]): void {
    for (const cellRangeDto of updatableCells) {
      createCellRange4Dto(cellRangeDto).forEachCell(
        (rowId: number, colId: number) => {
          const cell: Cell | undefined = this.table.getCell(rowId, colId);
          if (cell) {
            asCellStyle(cell)?.setStyleName();
            !cell.hasProperties() && this.table.removeCell(rowId, colId);
          }
        }
      );
    }
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
