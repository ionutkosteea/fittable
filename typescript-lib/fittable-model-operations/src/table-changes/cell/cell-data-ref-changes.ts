import { CellRange, CellRangeList, createCellRange4Dto, createDto4CellRangeList, Table, TableDataRefs } from "fittable-core/model";
import { Args, TableChanges, TableChangesFactory } from "fittable-core/operations";

import { CellRangeAddressObjects } from "../../utils/cell/cell-range-address-objects.js";
import { CellDataRefChange } from "../../table-change-writter/cell/cell-data-ref-change-writter.js";

export type CellDataRefArgs = Args<'cell-data-ref'> & {
    selectedCells: CellRange[];
    dataRef?: string;
}

export class CellDataRefChangesBuilder {
    public readonly cellDataRefChange: CellDataRefChange = {
        id: 'cell-data-ref',
        items: [],
    };
    public readonly celldataRefUndoChange: CellDataRefChange = {
        id: 'cell-data-ref',
        items: [],
    }
    private readonly changes: TableChanges;
    private readonly updatableCells: CellRangeList = new CellRangeList();

    constructor(
        private readonly table: Table & TableDataRefs,
        private readonly args: CellDataRefArgs
    ) {
        this.changes = {
            id: args.id,
            changes: [this.cellDataRefChange],
            undoChanges: {
                changes: [this.celldataRefUndoChange],
            },
        };
    }

    public build(): TableChanges {
        this.prepareUpdatableCells();
        this.updateCellDataRefs();
        this.undoCellDataRefs();
        return this.changes;
    }

    private prepareUpdatableCells(): void {
        for (const cellRange of this.args.selectedCells) {
            cellRange.forEachCell((rowId: number, colId: number): void => {
                const oldJsonKey: string | undefined = this.table.getCellDataRef(rowId, colId);
                oldJsonKey !== this.args.dataRef && this.updatableCells.addCell(rowId, colId);
            });
        }
    }

    private updateCellDataRefs(): void {
        this.cellDataRefChange.items.push({
            cellRanges: createDto4CellRangeList(this.updatableCells.getRanges()),
            dataRef: this.args.dataRef,
        });
    }

    private undoCellDataRefs(): void {
        const undoJsonKeys: CellRangeAddressObjects<string | undefined> = new CellRangeAddressObjects();
        for (const jsonKeys of this.cellDataRefChange.items) {
            for (const cellRangeDto of jsonKeys.cellRanges)
                createCellRange4Dto(cellRangeDto).forEachCell(
                    (rowId: number, colId: number): void => {
                        undoJsonKeys.set(
                            this.table.getCellDataRef(rowId, colId),
                            rowId,
                            colId
                        );
                    }
                );
        }
        undoJsonKeys.forEach(
            (dataRef: string | undefined, address: CellRange[]): void => {
                this.celldataRefUndoChange.items.push({
                    cellRanges: createDto4CellRangeList(address),
                    dataRef,
                });
            }
        );
    }
}
export class CellDataRefsChangesFactory implements TableChangesFactory {
    public createTableChanges(
        table: Table & TableDataRefs,
        args: CellDataRefArgs
    ): TableChanges | Promise<TableChanges> {
        return new CellDataRefChangesBuilder(table, args).build();
    }
}