import {
    CellRange,
    createCellRange4Dto,
    Table,
    TableData,
} from 'fittable-core/model';
import {
    TableChangeWritter,
    TableChangeWritterFactory,
    Args,
} from 'fittable-core/operations';

export type CellDataRefItem = {
    cellRanges: unknown[];
    dataRef?: string;
};
export type CellDataRefChange = Args<'cell-data-ref'> & { items: CellDataRefItem[] };

export class CellDataRefChangeWritter implements TableChangeWritter {

    constructor(private readonly table: Table & TableData, private readonly change: CellDataRefChange) { }

    public run(): void {
        this.updateCellDataRefs();
    }

    private updateCellDataRefs(): void {
        for (const item of this.change.items) {
            for (const cellRangeDto of item.cellRanges) {
                const cellRange: CellRange = createCellRange4Dto(cellRangeDto);
                const fromRowId: number = cellRange.getFrom().getRowId();
                const toRowId: number = cellRange.getTo().getRowId();
                const fromColId: number = cellRange.getFrom().getColId();
                const toColId: number = cellRange.getTo().getColId();
                for (let rowId: number = fromRowId; rowId <= toRowId; rowId++) {
                    for (let colId: number = fromColId; colId <= toColId; colId++) {
                        this.table.setCellDataRef(rowId, colId, item.dataRef);
                    }
                    this.removeRowIfEmpty(rowId);
                }
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
}

export class CellDataRefChangeWritterFactory
    implements TableChangeWritterFactory {
    public createTableChangeWritter(
        table: Table & TableData,
        change: CellDataRefChange
    ): TableChangeWritter {
        return new CellDataRefChangeWritter(table, change);
    }
}
