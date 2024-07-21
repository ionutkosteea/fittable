import {
  Table,
  Style,
  CellRange,
  Value,
  TableStyles,
  CellCoord,
  asTableStyles,
  createStyleWithUndefinedProperties,
  DataType,
  TableCellDataType,
  asTableCellDataType,
  createDataType,
  DataTypeName,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { appendStyleChange } from '../../utils/style/style-change-functions.js';
import {
  getMaxStyleNameUid,
  styleByCss,
} from '../../utils/style/style-functions.js';
import { CellValueChangesVisitor } from '../../utils/cell/cell-value-changes-visitor.js';
import { CellValueChange } from '../../table-change-writter/cell/cell-value-change-writter.js';
import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';
import { DataTypeChange } from '../../table-change-writter/cell/cell-data-type-change-writter.js';
import { StyleUpdateChangesBuilder } from '../style/style-update-changes.js';
import { StyleRemoveChangesBuilder } from '../style/style-remove-changes.js';
import {
  CellDataTypeArgs,
  CellDataTypeChangesBuilder,
} from './cell-data-type-change.js';

export type CellPasteArgs = Args<'cell-paste'> & {
  selectedCells: CellRange[];
};

export class CellPasteChangesBuilder {
  public readonly cellValueChange: CellValueChange = {
    id: 'cell-value',
    values: [],
  };
  public readonly cellDataTypeChange: DataTypeChange = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  public readonly styleChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly cellValueUndoChange: CellValueChange = {
    id: 'cell-value',
    values: [],
  };
  public readonly cellDataTypeUndoChange: DataTypeChange = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  public readonly styleUndoChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly changes: TableChanges;
  private readonly dataTypeTable?: Table & TableCellDataType;
  private readonly styledTable?: Table & TableStyles;

  private newValues: CellRangeAddressObjects<Value | undefined>;
  private newDataTypes: CellRangeAddressObjects<DataType | undefined>;
  private newStyles: CellRangeAddressObjects<string | undefined>;
  private htmlTableNumberOfRows = 0;
  private htmlTableNumberOfCols = 0;
  private maxStyleNameUid = 0;

  constructor(
    private readonly table: Table,
    private readonly args: CellPasteArgs
  ) {
    this.dataTypeTable = asTableCellDataType(this.table);
    this.styledTable = asTableStyles(table);
    this.changes = {
      id: args.id,
      changes: [
        this.cellValueChange,
        this.cellDataTypeChange,
        this.styleChange,
      ],
      undoChanges: {
        changes: [
          this.cellValueUndoChange,
          this.cellDataTypeUndoChange,
          this.styleUndoChange,
        ],
      },
    };
    this.newValues = new CellRangeAddressObjects();
    this.newDataTypes = new CellRangeAddressObjects();
    this.newStyles = new CellRangeAddressObjects();
    if (this.styledTable) {
      this.maxStyleNameUid = getMaxStyleNameUid(this.styledTable);
    }
  }

  public async build(): Promise<TableChanges> {
    await this.readClipboard(
      (
        htmlRowId: number,
        htmlColId: number,
        htmlCell: HTMLTableCellElement
      ): void => this.prepareUpdate(htmlRowId, htmlColId, htmlCell)
    );
    this.spreadCellsOverSelection();
    this.updateCellValues();
    this.updateCellDataTypes();
    this.updateCellStyles();
    return this.changes;
  }

  private async readClipboard(
    readHtmlCell: (
      htmlRowId: number,
      htmlColId: number,
      htmlCell: HTMLTableCellElement
    ) => void
  ): Promise<void> {
    let data: Promise<Blob> = Promise.resolve(new Blob());
    await navigator.clipboard
      .read()
      .then((items: ClipboardItem[]): void => {
        for (const item of items) {
          data = item.getType('text/html');
        }
      })
      .catch((message): void => console.error(message));
    let text: Promise<string> = Promise.resolve('');
    await data
      .then((blobData: Blob): void => {
        text = blobData.text();
      })
      .catch((message): void => console.error(message));
    await text
      .then((htmlText: string): void => {
        const htmlTable: HTMLTableElement = this.createHtmlTable(htmlText);
        this.visitHtmlTableRows(
          htmlTable,
          (htmlRow: HTMLTableRowElement, htmlRowId: number): void => {
            this.visitHtmlTableCells(
              htmlRow,
              (htmlCell: HTMLTableCellElement, htmlColId: number): void => {
                readHtmlCell(htmlRowId, htmlColId, htmlCell);
              }
            );
          }
        );
      })
      .catch((message): void => console.error(message));
  }

  private prepareUpdate(
    htmlRowId: number,
    htmlColId: number,
    htmlCell: HTMLTableCellElement
  ): void {
    const cellRange: CellRange = this.args.selectedCells[0];
    const rowId: number = cellRange.getFrom().getRowId() + htmlRowId;
    const colId: number = cellRange.getFrom().getColId() + htmlColId;
    this.prepareNewValue(rowId, colId, htmlCell);
    this.prepareNewDataType(rowId, colId, htmlCell);
    this.prepareNewStyle(rowId, colId, htmlCell);
    this.htmlTableNumberOfRows = Math.max(
      this.htmlTableNumberOfRows,
      htmlRowId + 1
    );
    this.htmlTableNumberOfCols = Math.max(
      this.htmlTableNumberOfCols,
      htmlColId + 1
    );
  }

  private createHtmlTable(htmlText: string): HTMLTableElement {
    const parser = new DOMParser();
    const doc: Document = parser.parseFromString(htmlText, 'text/html');
    return doc.body as HTMLTableElement;
  }

  private visitHtmlTableRows(
    htmlTabelChild: ChildNode,
    rowFn: (htmlRow: HTMLTableRowElement, row: number) => void
  ): void {
    for (let i = 0; i < htmlTabelChild.childNodes.length; i++) {
      const child: ChildNode = htmlTabelChild.childNodes.item(i);
      if (child instanceof HTMLTableRowElement) rowFn(child, i);
      else this.visitHtmlTableRows(child, rowFn);
    }
  }

  private visitHtmlTableCells(
    htmlRow: HTMLTableRowElement,
    cellFn: (htmlCell: HTMLTableCellElement, col: number) => void
  ): void {
    const children: NodeListOf<ChildNode> = htmlRow.childNodes;
    for (let i = 0; i < children.length; i++) {
      const htmlCell: ChildNode = children.item(i);
      cellFn(htmlCell as HTMLTableCellElement, i);
    }
  }

  private prepareNewValue(
    rowId: number,
    colId: number,
    htmlCell: HTMLTableCellElement
  ): void {
    let cellValue: string | undefined = htmlCell.innerHTML ?? undefined;
    cellValue = cellValue?.replaceAll('<br>', '\n');
    let value: Value | undefined = undefined;
    if (cellValue !== undefined) {
      try {
        value = JSON.parse(cellValue);
      } catch {
        value = cellValue;
      }
    }
    this.newValues.set(value, rowId, colId);
  }

  private prepareNewDataType(
    rowId: number,
    colId: number,
    htmlCell: HTMLTableCellElement
  ): void {
    if (!this.dataTypeTable) return;
    const dataTypeName: string | null = //
      htmlCell.getAttribute('data-data-type-name');
    if (!dataTypeName) return;
    const dataTypeFormat: string | null = htmlCell.getAttribute('data-data-type-format');
    const dataType: DataType = createDataType(dataTypeName as DataTypeName, dataTypeFormat ?? undefined);
    this.newDataTypes.set(dataType, rowId, colId);
  }

  private prepareNewStyle(
    rowId: number,
    colId: number,
    htmlCell: HTMLTableCellElement
  ): void {
    if (!this.styledTable) return;
    const cssStyle: string | null = htmlCell.getAttribute('style');
    this.newStyles.set(cssStyle ?? undefined, rowId, colId);
  }

  private spreadCellsOverSelection(): void {
    const selectedCells: CellRange = this.args.selectedCells[0];
    const from: CellCoord = selectedCells.getFrom();
    const to: CellCoord = selectedCells.getTo();
    const selectedNumberOfRows: number = to.getRowId() - from.getRowId() + 1;
    const selectedNumberOfCols: number = to.getColId() - from.getColId() + 1;
    const multiplyNumberOfRows: number = Math.floor(
      selectedNumberOfRows / this.htmlTableNumberOfRows
    );
    const multiplyNumberOfCols: number = Math.floor(
      selectedNumberOfCols / this.htmlTableNumberOfCols
    );
    this.multiplyCellValues(multiplyNumberOfRows, multiplyNumberOfCols);
    this.multiplyCellDataTypes(multiplyNumberOfRows, multiplyNumberOfCols);
    this.multiplyCellStyles(multiplyNumberOfRows, multiplyNumberOfCols);
  }

  private multiplyCellValues(
    multiplyNumberOfRows: number,
    multiplyNumberOfCols: number
  ): void {
    const multipliedCellValues: CellRangeAddressObjects<Value | undefined> =
      new CellRangeAddressObjects();
    this.newValues.forEach(
      (value: Value | undefined, cellRanges: CellRange[]): void => {
        for (const cellRange of cellRanges) {
          for (let i = 0; i < multiplyNumberOfRows; i++) {
            for (let j = 0; j < multiplyNumberOfCols; j++) {
              cellRange.forEachCell((rowId: number, colId: number): void => {
                multipliedCellValues.set(
                  value,
                  rowId + i * this.htmlTableNumberOfRows,
                  colId + j * this.htmlTableNumberOfCols
                );
              });
            }
          }
        }
      }
    );
    this.newValues.append(multipliedCellValues);
  }

  private multiplyCellDataTypes(
    multiplyNumberOfRows: number,
    multiplyNumberOfCols: number
  ): void {
    const multipliedCellDataTypes: CellRangeAddressObjects<
      DataType | undefined
    > = new CellRangeAddressObjects();
    this.newDataTypes.forEach(
      (dataType: DataType | undefined, cellRanges: CellRange[]): void => {
        for (const cellRange of cellRanges) {
          for (let i = 0; i < multiplyNumberOfRows; i++) {
            for (let j = 0; j < multiplyNumberOfCols; j++) {
              cellRange.forEachCell((rowId: number, colId: number): void => {
                multipliedCellDataTypes.set(
                  dataType,
                  rowId + i * this.htmlTableNumberOfRows,
                  colId + j * this.htmlTableNumberOfCols
                );
              });
            }
          }
        }
      }
    );
    this.newDataTypes.append(multipliedCellDataTypes);
  }

  private multiplyCellStyles(
    multiplyNumberOfRows: number,
    multiplyNumberOfCols: number
  ): void {
    const multipliedCellStyles: CellRangeAddressObjects<string | undefined> =
      new CellRangeAddressObjects();
    this.newStyles.forEach(
      (style: string | undefined, cellRanges: CellRange[]): void => {
        for (const cellRange of cellRanges) {
          for (let i = 0; i < multiplyNumberOfRows; i++) {
            for (let j = 0; j < multiplyNumberOfCols; j++) {
              cellRange.forEachCell((rowId: number, colId: number): void => {
                multipliedCellStyles.set(
                  style,
                  rowId + i * this.htmlTableNumberOfRows,
                  colId + j * this.htmlTableNumberOfCols
                );
              });
            }
          }
        }
      }
    );
    this.newStyles.append(multipliedCellStyles);
  }

  private updateCellValues(): void {
    CellValueChangesVisitor.of(this.table, this.newValues).visit(
      (
        cellValueChange: CellValueChange,
        cellValueUndoChange: CellValueChange
      ): void => {
        for (const valuesDto of cellValueChange.values) {
          this.cellValueChange.values.push(valuesDto);
        }
        for (const valuesDto of cellValueUndoChange.values) {
          this.cellValueUndoChange.values.push(valuesDto);
        }
      }
    );
  }

  private updateCellDataTypes(): void {
    if (!this.dataTypeTable) return;
    for (const dataType of this.newDataTypes.getAllObjects()) {
      const selectedCells: CellRange[] =
        this.newDataTypes.getAddress(dataType) ?? [];
      const args: CellDataTypeArgs = {
        id: 'cell-data-type',
        selectedCells,
        dataType,
      };
      const builder: CellDataTypeChangesBuilder =
        new CellDataTypeChangesBuilder(this.dataTypeTable, args);
      builder.build();
      this.cellDataTypeChange.dataTypes = this.cellDataTypeChange.dataTypes //
        .concat(builder.dataTypeChange.dataTypes);
      this.cellDataTypeUndoChange.dataTypes =
        this.cellDataTypeUndoChange.dataTypes //
          .concat(builder.dataTypeUndoChange.dataTypes);
    }
  }

  private updateCellStyles(): void {
    this.visitStyles(
      (styleChange: StyleChange, styleUndoChange: StyleChange): void => {
        appendStyleChange(styleChange, this.styleChange);
        appendStyleChange(styleUndoChange, this.styleUndoChange);
      }
    );
  }

  private visitStyles(
    callbackFn: (styleChange: StyleChange, styleUndoChange: StyleChange) => void
  ): void {
    for (const cssStyle of this.newStyles.getAllObjects()) {
      const address: CellRange[] = this.newStyles.getAddress(cssStyle) ?? [];
      if (cssStyle) {
        const builder: StyleUpdateChangesBuilder =
          this.buildStyleUpdateTableChangesBuilder(cssStyle, address);
        callbackFn(builder.styleChange, builder.styleUndoChange);
      } else {
        const builder: StyleRemoveChangesBuilder =
          this.buildStyleRemoveTableChangesBuilder(address);
        callbackFn(builder.styleChange, builder.styleUndoChange);
      }
    }
  }

  private buildStyleUpdateTableChangesBuilder(
    cssStyle: string,
    selectedCells: CellRange[]
  ): StyleUpdateChangesBuilder {
    if (!this.styledTable) throw new Error('Table styles are not defined!');
    const style: Style | undefined = styleByCss(cssStyle);
    const undefinedProperties: Style = createStyleWithUndefinedProperties();
    const styleSnippet: Style = undefinedProperties.append(style);
    const builder: StyleUpdateChangesBuilder = new StyleUpdateChangesBuilder(
      this.styledTable,
      { id: 'style-update', selectedCells, styleSnippet },
      this.maxStyleNameUid
    );
    builder.build();
    this.maxStyleNameUid = builder.maxStyleNameUid;
    return builder;
  }

  private buildStyleRemoveTableChangesBuilder(
    selectedCells: CellRange[]
  ): StyleRemoveChangesBuilder {
    const builder: StyleRemoveChangesBuilder = new StyleRemoveChangesBuilder(
      this.table as Table & TableStyles,
      {
        id: 'style-remove',
        selectedCells,
      }
    );
    builder.build();
    return builder;
  }
}

export class CellPasteChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table,
    args: CellPasteArgs
  ): TableChanges | Promise<TableChanges> {
    return new CellPasteChangesBuilder(table, args).build();
  }
}
