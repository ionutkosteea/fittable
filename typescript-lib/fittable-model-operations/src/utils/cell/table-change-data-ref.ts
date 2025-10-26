import { createCellRange4Dto, TableBasics, TableDataRefs } from "fittable-core/model";
import { TableChanges } from "fittable-core/operations";

import { FitTableChangeId } from "../../operation-executor/fit-operation-executor-args.js";
import { CellValueChange } from "../../table-change-writter/cell/cell-value-change-writter.js";

export type TableChangeDataRef<T> = {
    rowId: number;
    colId: number,
    item: T;
}

export function getTableChangeDataRefs<T>(
    table: TableBasics & TableDataRefs,
    tableChanges: TableChanges
): TableChangeDataRef<T>[] {
    const cellValueId: FitTableChangeId = 'cell-value';
    const change = tableChanges.changes.find(c => c.id === cellValueId);
    if (!change) return [];
    const dataRefs: TableChangeDataRef<T>[] = [];
    const valueChange = change as CellValueChange;
    for (const item of valueChange.items) {
        for (const cellRangeDto of item.cellRanges) {
            const cellRange = createCellRange4Dto(cellRangeDto);
            cellRange.forEachCell((rowId, colId) => {
                const dataRef = table?.getCellDataRef(rowId, colId);
                dataRef && dataRefs.push({
                    rowId,
                    colId,
                    item: JSON.parse(dataRef) as T
                });
            })
        }
    }
    return dataRefs;
}