import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {
  Cell,
  CellBasics,
  CellFactory,
  createCell4Dto,
  createTable4Dto,
  Table,
  TableBasics,
  TableFactory,
  registerModelConfig,
  createTable,
  createCell,
} from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fit-view-model';
import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'custom-table',
  templateUrl: './common/console-topic.html',
  styleUrls: ['./common/console-topic.css', '../common/common.css'],
})
export class CustomTableComponent extends ConsoleTopic implements OnInit {
  @ViewChild('console') console!: ElementRef;

  public readonly title: TopicTitle = 'Custom table';
  public readonly htmlCode: CodeSnippet[] = [
    { image: 'fittable-component-html.jpg' },
  ];
  public readonly typescriptCode: CodeSnippet[] = [
    { image: 'custom-table-ts-01.jpg' },
    { image: 'custom-table-ts-02.jpg' },
    { image: 'custom-table-ts-03.jpg' },
    { image: 'custom-table-ts-04.jpg' },
    { image: 'custom-table-ts-05.jpg' },
  ];
  public fit!: FittableDesigner;
  public fitTableDto!: DummyTableDto;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig({
      tableFactory: new DummyTableFactory(),
      cellFactory: new DummyCellFactory(),
      cellCoordFactory: FIT_MODEL_CONFIG.cellCoordFactory,
      cellRangeFactory: FIT_MODEL_CONFIG.cellRangeFactory,
      lineRangeFactory: FIT_MODEL_CONFIG.lineRangeFactory,
    });
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const table: DummyTable = createTable<DummyTable>(5, 5) //
      .addCell(1, 1, createCell<DummyCell>().setValue('[1,1]'));
    this.fitTableDto = table.getDto();
    this.fit = createFittableDesigner(table);
  }
}

type DummyCellDto = { val?: string };

class DummyCell implements CellBasics {
  constructor(private dto: DummyCellDto = {}) {}
  getDto = (): DummyCellDto => this.dto;
  getValue = (): string | undefined => this.dto.val;
  setValue = (value?: string): this => {
    this.dto.val = value;
    return this;
  };
  hasProperties = (): boolean => this.dto.val !== undefined;
  equals = (other?: Cell): boolean => this.getValue() === other?.getValue();
  clone = (): DummyCell => new DummyCell({ ...this.dto });
}

class DummyCellFactory implements CellFactory {
  createCell = (): DummyCell => new DummyCell();
  createCell4Dto = (dto: DummyCellDto): DummyCell => new DummyCell(dto);
}

type DummyTableDto = {
  rowNumber: number;
  colNumber: number;
  cells: (DummyCellDto | undefined)[][];
};

class DummyTable implements TableBasics {
  constructor(
    private dto: DummyTableDto = {
      rowNumber: 5,
      colNumber: 5,
      cells: [],
    }
  ) {}
  getDto = (): DummyTableDto => this.dto;
  getNumberOfRows = (): number => this.dto.rowNumber;
  setNumberOfRows(numberOfRows: number): this {
    this.dto.rowNumber = numberOfRows;
    return this;
  }
  getNumberOfColumns = (): number => this.dto.colNumber;
  setNumberOfColumns(numberOfColumns: number): this {
    this.dto.colNumber = numberOfColumns;
    return this;
  }
  getCell = (rowId: number, colId: number): DummyCell | undefined => {
    const row: (DummyCellDto | undefined)[] | undefined = this.dto.cells[rowId];
    if (!row) return undefined;
    return row[colId] ? createCell4Dto<DummyCell>(row[colId]) : undefined;
  };
  addCell(rowId: number, colId: number, cell: DummyCell): this {
    if (!this.dto.cells[rowId]) this.dto.cells[rowId] = [];
    this.dto.cells[rowId][colId] = cell.getDto();
    return this;
  }
  removeCell = (rowId: number, colId: number): this => {
    const row: (DummyCellDto | undefined)[] | undefined = this.dto.cells[rowId];
    if (row) this.dto.cells[rowId][colId] = undefined;
    return this;
  };
  forEachCell(cellFn: (cell: Cell) => void): void {
    for (let i = 0; i < this.dto.cells.length; i++) {
      const row: (DummyCellDto | undefined)[] | undefined = this.dto.cells[i];
      if (row) {
        for (let j = 0; j < row.length; j++) {
          cellFn(createCell4Dto<DummyCell>(row[j]));
        }
      }
    }
  }
  forEachCellCoord(cellCoordFn: (rowId: number, colId: number) => void): void {
    for (let i = 0; i < this.dto.rowNumber; i++) {
      for (let j = 0; j < this.dto.colNumber; j++) {
        cellCoordFn(i, j);
      }
    }
  }
  clone(): DummyTable {
    return createTable4Dto<DummyTable>({ ...this.dto });
  }
}

class DummyTableFactory implements TableFactory {
  createTable = (numberOfRows: number, numberOfColumns: number): DummyTable =>
    new DummyTable({
      rowNumber: numberOfRows,
      colNumber: numberOfColumns,
      cells: [],
    });
  createTable4Dto = (dto: DummyTableDto): Table => new DummyTable(dto);
}
