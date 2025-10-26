import {
  Table,
  CellRange,
  DataType,
  createCellRange4Dto,
  createDto4CellRangeList,
  CellRangeList,
  TableCellDataType
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import { CellRangeAddressObjects } from '../../utils/cell/cell-range-address-objects.js';
import { DataTypeChange } from '../../table-change-writter/cell/cell-data-type-change-writter.js';

export type CellDataTypeArgs = Args<'cell-data-type'> & {
  selectedCells: CellRange[];
  dataType?: DataType;
};

export class CellDataTypeChangesBuilder {
  public readonly dataTypeChange: DataTypeChange = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  public readonly dataTypeUndoChange: DataTypeChange = {
    id: 'cell-data-type',
    dataTypes: [],
  };
  private readonly changes: TableChanges;
  private readonly updatableCells: CellRangeList = new CellRangeList();

  constructor(
    private readonly table: Table & TableCellDataType,
    private readonly args: CellDataTypeArgs
  ) {
    this.changes = {
      id: args.id,
      changes: [this.dataTypeChange],
      undoChanges: {
        changes: [this.dataTypeUndoChange],
      },
    };
  }

  public build(): TableChanges {
    this.prepareUpdatableCells();
    this.updateCellDataTypes();
    this.undoCellDataTypes();
    return this.changes;
  }

  private prepareUpdatableCells(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number): void => {
        const oldDataType: DataType | undefined = //
          this.table.getCellDataType(rowId, colId);
        const equalDataTypes: boolean =
          JSON.stringify(oldDataType?.getDto()) === JSON.stringify(this.args.dataType?.getDto());
        !equalDataTypes && this.updatableCells.addCell(rowId, colId);
      });
    }
  }

  private updateCellDataTypes(): void {
    this.dataTypeChange.dataTypes.push({
      cellRanges: createDto4CellRangeList(this.updatableCells.getRanges()),
      dataType: this.args.dataType?.getDto(),
    });
  }

  private undoCellDataTypes(): void {
    const undoDataTypes: CellRangeAddressObjects<DataType | undefined> =
      new CellRangeAddressObjects();
    for (const dataTypes of this.dataTypeChange.dataTypes) {
      for (const cellRangeDto of dataTypes.cellRanges)
        createCellRange4Dto(cellRangeDto).forEachCell(
          (rowId: number, colId: number): void => {
            undoDataTypes.set(
              this.table.getCellDataType(rowId, colId),
              rowId,
              colId
            );
          }
        );
    }
    undoDataTypes.forEach(
      (dataType: DataType | undefined, address: CellRange[]): void => {
        this.dataTypeUndoChange.dataTypes.push({
          cellRanges: createDto4CellRangeList(address),
          dataType: dataType?.getDto(),
        });
      }
    );
  }
}

export class CellDataTypeChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableCellDataType,
    args: CellDataTypeArgs
  ): TableChanges | Promise<TableChanges> {
    return new CellDataTypeChangesBuilder(table, args).build();
  }
}
