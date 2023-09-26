import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import {
  TableBasics,
  TableFactory,
  registerModelConfig,
  Value,
  createTable4Dto,
} from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  registerViewModelConfig,
} from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';

import { TopicTitle } from '../../common/topic-title.model';
import { CodeSnippet } from '../common/code-snippet.model';
import { ConsoleTopic } from './common/console-topic.model';

@Component({
  selector: 'custom-table',
  templateUrl: './common/console-topic.html',
  styleUrls: ['../common/common.css'],
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
  ];
  public fit!: FittableDesigner;
  public fitTableDto: (Value | undefined)[][] = [
    ['A1', 'B1', 'C1', 'D1', 'E1'],
    ['A2', 'B2', 'C2', 'D2', 'E2'],
    ['A3', 'B3', 'C3', 'D3', 'E3'],
    ['A4', 'B4', 'C4', 'D4', 'E4'],
    ['A5', 'B5', 'C5', 'D5', 'E5'],
  ];

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig({
      tableFactory: new MatrixValueTableFactory(),
      cellCoordFactory: FIT_MODEL_CONFIG.cellCoordFactory,
      cellRangeFactory: FIT_MODEL_CONFIG.cellRangeFactory,
      lineRangeFactory: FIT_MODEL_CONFIG.lineRangeFactory,
      languageDictionaryFactory: FIT_MODEL_CONFIG.languageDictionaryFactory,
    });
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    this.fit = createFittableDesigner(createTable4Dto(this.fitTableDto));
  }
}

class MatrixValueTable implements TableBasics {
  constructor(private readonly dto: (Value | undefined)[][] = []) {}
  getDto = (): (Value | undefined)[][] => this.dto;
  getNumberOfRows = (): number => this.dto.length;
  setNumberOfRows = (numberOfRows: number): this => {
    this.dto.length = numberOfRows;
    return this;
  };
  getNumberOfCols = (): number => {
    let numberOfCols = 0;
    for (const row of this.dto) {
      if (row && numberOfCols < row.length) numberOfCols = row.length;
    }
    return numberOfCols;
  };
  setNumberOfCols = (numberOfCols: number): this => {
    for (const row of this.dto) {
      if (row) row.length = numberOfCols;
    }
    return this;
  };
  getCellValue = (rowId: number, colId: number): Value | undefined => {
    const row: (Value | undefined)[] | undefined = this.dto[rowId];
    return row ? row[colId] : undefined;
  };
  setCellValue = (rowId: number, colId: number, value?: Value): this => {
    if (value !== undefined) {
      if (!this.dto[rowId]) this.dto[rowId] = [];
      this.dto[rowId][colId] = value;
    } else if (this.dto[rowId] && this.dto[rowId][colId]) {
      this.dto[rowId][colId] = undefined;
    }
    return this;
  };
  hasCell = (rowId: number, colId: number): boolean =>
    rowId in this.dto && colId in this.dto[rowId];
  removeCell = (rowId: number, colId: number): this => {
    this.setCellValue(rowId, colId);
    return this;
  };
  forEachCell = (cellFn: (rowId: number, colId: number) => void): void => {
    for (let i = 0; i < this.getNumberOfRows(); i++) {
      for (let j = 0; j < this.getNumberOfCols(); j++) {
        cellFn(i, j);
      }
    }
  };
  removeRowCells = (rowId: number): this => {
    this.dto[rowId] = [];
    return this;
  };
  moveRowCells = (rowId: number, move: number): this => {
    this.dto[rowId + move] = this.dto[rowId];
    delete this.dto[rowId];
    return this;
  };
  removeColCells = (colId: number): this => {
    for (const row of this.dto) {
      row && delete row[colId];
    }
    return this;
  };
  moveColCells = (colId: number, move: number): this => {
    for (const row of this.dto) {
      if (!row) continue;
      row[colId + move] = row[colId];
      delete row[colId];
    }
    return this;
  };
  clone = (): MatrixValueTable =>
    new MatrixValueTable(JSON.parse(JSON.stringify(this.dto)));
}

class MatrixValueTableFactory implements TableFactory {
  createTable = (): MatrixValueTable => new MatrixValueTable();
  createTable4Dto = (dto: (Value | undefined)[][]): MatrixValueTable =>
    new MatrixValueTable(dto);
}
