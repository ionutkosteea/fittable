import {
  Table,
  Style,
  CellRange,
  Value,
  TableStyles,
  CellCoord,
  asTableStyles,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fit-core/operations/index.js';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { appendStyleStepsDto } from '../../utils/style/style-dto-functions.js';
import {
  getMaxStyleNameUid,
  styleByCss,
} from '../../utils/style/style-functions.js';
import { CellValueOperationDtoVisitor } from '../../utils/cell/cell-value-operation-dto-visitor.js';
import { CellValueOperationStepDto } from '../../operation-steps/cell/cell-value-operation-step.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import { StyleUpdateOperationDtoBuilder } from '../style/style-update-operation-dto.js';
import { StyleRemoveOperationDtoBuilder } from '../style/style-remove-operation-dto.js';

export type CellPasteOperationDtoArgs = OperationId<'cell-paste'> & {
  selectedCells: CellRange[];
};

export class CellPasteOperationDtoBuilder {
  public readonly cellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoCellValueStepDto: CellValueOperationStepDto = {
    id: 'cell-value',
    values: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly operationDto: OperationDto;
  private readonly styledTable?: Table & TableStyles;

  private newValues: CellRangeAddressObjects<Value | undefined>;
  private newStyles: CellRangeAddressObjects<string | undefined>;
  private htmlTableNumberOfRows = 0;
  private htmlTableNumberOfCols = 0;
  private maxStyleNameUid = 0;

  constructor(
    private readonly table: Table,
    private readonly args: CellPasteOperationDtoArgs
  ) {
    this.styledTable = asTableStyles(table);
    this.operationDto = {
      id: args.id,
      steps: [this.cellValueStepDto, this.styleStepDto],
      undoOperation: {
        steps: [this.undoCellValueStepDto, this.undoStyleStepDto],
      },
    };
    this.newValues = new CellRangeAddressObjects();
    this.newStyles = new CellRangeAddressObjects();
    if (this.styledTable) {
      this.maxStyleNameUid = getMaxStyleNameUid(this.styledTable);
    }
  }

  public async build(): Promise<OperationDto> {
    await this.readClipboard(
      (
        htmlRowId: number,
        htmlColId: number,
        htmlCell: HTMLTableCellElement
      ): void => this.prepareUpdate(htmlRowId, htmlColId, htmlCell)
    );
    this.spreadCellsOverSelection();
    this.updateCellValues();
    this.updateCellStyles();
    return this.operationDto;
  }

  private async readClipboard(
    readHtmlCell: (
      htmlRowId: number,
      htmlColId: number,
      htmlCell: HTMLTableCellElement
    ) => void
  ): Promise<void> {
    let data: Promise<Blob>;
    await navigator.clipboard
      .read()
      .then((items: ClipboardItem[]): void => {
        for (const item of items) {
          data = item.getType('text/html');
        }
      })
      .catch((message): void => console.error(message));
    let text: Promise<string>;
    await data!
      .then((blobData: Blob): void => {
        text = blobData.text();
      })
      .catch((message): void => console.error(message));
    await text!
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
    this.newValues.set(cellValue, rowId, colId);
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
    CellValueOperationDtoVisitor.of(this.table, this.newValues).visit(
      (
        valueStepDto: CellValueOperationStepDto,
        undoValueStepDto: CellValueOperationStepDto
      ): void => {
        for (const valuesDto of valueStepDto.values) {
          this.cellValueStepDto.values.push(valuesDto);
        }
        for (const valuesDto of undoValueStepDto.values) {
          this.undoCellValueStepDto.values.push(valuesDto);
        }
      }
    );
  }

  private updateCellStyles(): void {
    this.visitStyles(
      (
        styleStepDto: StyleOperationStepDto,
        undoStyleStepDto: StyleOperationStepDto
      ): void => {
        appendStyleStepsDto(styleStepDto, this.styleStepDto);
        appendStyleStepsDto(undoStyleStepDto, this.undoStyleStepDto);
      }
    );
  }

  private visitStyles(
    callbackFn: (
      styleStepDto: StyleOperationStepDto,
      undoStyleStepDto: StyleOperationStepDto
    ) => void
  ): void {
    for (const cssStyle of this.newStyles.getAllObjects()) {
      const address: CellRange[] = this.newStyles.getAddress(cssStyle) ?? [];
      if (cssStyle) {
        const builder: StyleUpdateOperationDtoBuilder =
          this.buildStyleUpdateOperationDtoBuilder(cssStyle, address);
        callbackFn(builder.styleStepDto, builder.undoStyleStepDto);
      } else {
        const builder: StyleRemoveOperationDtoBuilder =
          this.buildStyleRemoveOperationDtoBuilder(address);
        callbackFn(builder.styleStepDto, builder.undoStyleStepDto);
      }
    }
  }

  private buildStyleUpdateOperationDtoBuilder(
    cssStyle: string,
    selectedCells: CellRange[]
  ): StyleUpdateOperationDtoBuilder {
    const style: Style | undefined = styleByCss(cssStyle);
    const builder: StyleUpdateOperationDtoBuilder =
      new StyleUpdateOperationDtoBuilder(
        this.styledTable!,
        {
          id: 'style-update',
          selectedCells,
          styleSnippet: style,
        },
        this.maxStyleNameUid
      );
    builder.build();
    this.maxStyleNameUid = builder.maxStyleNameUid;
    return builder;
  }

  private buildStyleRemoveOperationDtoBuilder(
    selectedCells: CellRange[]
  ): StyleRemoveOperationDtoBuilder {
    const builder: StyleRemoveOperationDtoBuilder =
      new StyleRemoveOperationDtoBuilder(this.table as Table & TableStyles, {
        id: 'style-remove',
        selectedCells,
      });
    builder.build();
    return builder;
  }
}

export class CellPasteOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table,
    args: CellPasteOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new CellPasteOperationDtoBuilder(table, args).build();
  }
}
