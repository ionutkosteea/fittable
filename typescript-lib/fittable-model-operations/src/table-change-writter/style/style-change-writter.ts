import {
  Table,
  Style,
  TableStyles,
  createCellRange4Dto,
  createStyle4Dto,
  CellRange,
} from 'fittable-core/model';
import {
  TableChangeWritter,
  TableChangeWritterFactory,
  Args,
} from 'fittable-core/operations';

export type CellStyleNameItem = {
  cellRanges: unknown[];
  styleName?: string;
};
export type StyleEntryItem = { styleName: string; style: unknown };
export type StyleChange = Args<'style-update'> & {
  cellStyleNames: CellStyleNameItem[];
  createStyles: StyleEntryItem[];
  updateStyles: StyleEntryItem[];
  removeStyles: string[];
};

export class StyleChangeWritter implements TableChangeWritter {
  constructor(
    private readonly table: Table & TableStyles,
    public readonly change: StyleChange
  ) { }

  public run(): void {
    this.updateCellStyleNames();
    this.createStyles();
    this.updateStyles();
    this.removeStyles();
  }

  private updateCellStyleNames(): void {
    for (const cellStyleNameDto of this.change.cellStyleNames) {
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
    for (const createStyleDto of this.change.createStyles) {
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
    for (const updateStyleDto of this.change.updateStyles) {
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
    for (const styleName of this.change.removeStyles) {
      this.table.removeStyle(styleName);
    }
  }
}

export class StyleChangeWritterFactory implements TableChangeWritterFactory {
  public createTableChangeWritter(
    table: Table & TableStyles,
    change: StyleChange
  ): TableChangeWritter {
    return new StyleChangeWritter(table, change);
  }
}
