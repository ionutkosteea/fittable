import { createCellRange4Dto, createLineRange4Dto, TableBasics, TableData, Value } from "fittable-core/model";
import { BaseTableChanges } from "fittable-core/operations";

import { CellValueChange } from "../../table-change-writter/cell/cell-value-change-writter.js";
import { FitTableChangeId } from "../../operation-executor/fit-operation-executor-args.js";
import { CellRemoveChange } from "../../table-change-writter/cell/cell-remove-change-writter.js";
import { CellDataRefChange } from "../../table-change-writter/cell/cell-data-ref-change-writter.js";
import { ColRemoveChange, RowRemoveChange } from "../../table-change-writter/line/line-remove-change-writter.js";

export type TableChangeDataRef = {
    ref: string;
    value?: Value;
}

export function createTableChangeDataRefs(
    table: TableBasics & TableData,
    tableChanges: BaseTableChanges
): TableChangeDataRef[] {
    let dataRefs: TableChangeDataRef[] = [];
    const sortedChanges = [...tableChanges.changes].sort((c1) => {
        const id = c1?.id as FitTableChangeId;
        if (id === 'cell-data-ref') return -1;
        return 0;
    });
    let refChange: CellDataRefChange | undefined = undefined;
    for (const changes of sortedChanges) {
        const id = changes?.id as FitTableChangeId;
        switch (id) {
            case 'cell-data-ref': {
                refChange = changes as CellDataRefChange;
                break;
            }
            case 'cell-value': {
                const cellValueRefs = createCellValueDataRefs(table, changes as CellValueChange, refChange);
                dataRefs = [...dataRefs, ...cellValueRefs];
                break;
            }
            case 'cell-remove': {
                const cellRemoveRefs = createCellRemoveDataRefs(table, changes as CellRemoveChange);
                dataRefs = [...dataRefs, ...cellRemoveRefs];
                break;
            }
            case 'row-remove': {
                const rowRemoveRefs = createRowRemoveDataRefs(table, changes as RowRemoveChange);
                dataRefs = [...dataRefs, ...rowRemoveRefs];
                break;
            }
            case 'column-remove': {
                const colRemoveRefs = createColRemoveDataRefs(table, changes as ColRemoveChange);
                dataRefs = [...dataRefs, ...colRemoveRefs];
                break;
            }
        }
    }
    return dataRefs;
}

function createCellValueDataRefs(
    table: TableBasics & TableData,
    cellValueChange: CellValueChange,
    refChange?: CellDataRefChange
): TableChangeDataRef[] {
    const dataRefs: TableChangeDataRef[] = [];
    for (const item of cellValueChange.items) {
        for (const cellRangeDto of item.cellRanges) {
            const cellRange = createCellRange4Dto(cellRangeDto);
            const rangeRef = refChange?.items
                .find((refItem) => refItem.cellRanges
                    .find((refRangeDto) => createCellRange4Dto(refRangeDto).equals(cellRange)))
                ?.dataRef;
            cellRange.forEachCell((rowId, colId) => {
                const ref = rangeRef ?? table?.getCellDataRef(rowId, colId);
                if (!ref) return;
                const dataRef: TableChangeDataRef = { ref };
                if (item.value) dataRef.value = item.value;
                dataRefs.push(dataRef);
            })
        }
    }
    return dataRefs;
}

function createCellRemoveDataRefs(
    table: TableBasics & TableData,
    cellRemoveChange: CellRemoveChange
): TableChangeDataRef[] {
    const dataRefs: TableChangeDataRef[] = [];
    for (const cellRangeDto of cellRemoveChange.cellRanges) {
        createCellRange4Dto(cellRangeDto).forEachCell((rowId, colId) => {
            const ref = table?.getCellDataRef(rowId, colId);
            ref && dataRefs.push({ ref });
        })
    }
    return dataRefs;
}

function createRowRemoveDataRefs(
    table: TableBasics & TableData,
    rowRemoveChange: RowRemoveChange
): TableChangeDataRef[] {
    const dataRefs: TableChangeDataRef[] = [];
    rowRemoveChange.lineRanges.forEach((rowRangeDto) => {
        const rowRange = createLineRange4Dto(rowRangeDto);
        for (let rowId = rowRange.getFrom(); rowId <= rowRange.getTo(); rowId++) {
            for (let colId = 0; colId < table.getNumberOfCols(); colId++) {
                const ref = table?.getCellDataRef(rowId, colId);
                ref && dataRefs.push({ ref });
            }
        }
    });
    return dataRefs;
}

function createColRemoveDataRefs(
    table: TableBasics & TableData,
    colRemoveChange: ColRemoveChange
): TableChangeDataRef[] {
    const dataRefs: TableChangeDataRef[] = [];
    colRemoveChange.lineRanges.forEach((colRangeDto) => {
        const colRange = createLineRange4Dto(colRangeDto);
        for (let rowId = 0; rowId < table.getNumberOfRows(); rowId++) {
            for (let colId = colRange.getFrom(); colId <= colRange.getTo(); colId++) {
                const ref = table?.getCellDataRef(rowId, colId);
                ref && dataRefs.push({ ref });
            }
        }
    });
    return dataRefs;
}