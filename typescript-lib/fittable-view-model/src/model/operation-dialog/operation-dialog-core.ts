import { CellRange, createLineRange, LineRange, LineRangeList } from "fittable-core/model";
import { DialogField, OperationDialog } from "fittable-core/view-model";

import { FitUIOperationId } from "../operation-executor/operation-args.js";

export class FitOperationDialog implements OperationDialog {
    private visible = false;
    private fields: { [id: string]: DialogField } = {};
    private titleFn: () => string = () => '';
    private runFn: () => void = () => { };

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean): this {
        Object.values(this.fields).forEach((field: DialogField): void =>
            field.setValue(undefined));
        this.visible = visible;
        return this;
    }

    getTitle(): string {
        return this.titleFn();
    }

    setTitleFn(titleFn: () => string): this {
        this.titleFn = titleFn;
        return this;
    }

    getFieldIds(): FitUIOperationId[] {
        return Object.keys(this.fields) as FitUIOperationId[];
    }

    getField(id: FitUIOperationId): DialogField | undefined {
        return this.fields[id];
    }

    setField(id: string, field: DialogField): this {
        this.fields[id] = field;
        return this;
    }

    canRun(): boolean {
        for (const field of Object.values(this.fields)) {
            if (!field.isValid()) return false;
        }
        return true;
    }

    run(): this {
        this.runFn();
        this.visible = false;
        return this;
    }

    setRunFn(runFn: () => void): this {
        this.runFn = runFn;
        return this;
    }
}

export function getFirstLine(lineRanges: LineRange[]): LineRange[] {
    const resultLine: LineRange[] = [];
    const firstRange: LineRange | undefined = lineRanges[0];
    firstRange && resultLine.push(createLineRange(firstRange.getFrom()));
    return resultLine;
}

export function getSelectedRows(selectedCells: CellRange[]): LineRange[] {
    const lineRangeList: LineRangeList = new LineRangeList();
    selectedCells.forEach((cellRange: CellRange): void => {
        lineRangeList.add(createLineRange(
            cellRange.getFrom().getRowId(),
            cellRange.getTo().getRowId()
        )
        );
    });
    return lineRangeList.getRanges();
}

export function getSelectedCols(selectedCells: CellRange[]): LineRange[] {
    const lineRangeList: LineRangeList = new LineRangeList();
    selectedCells.forEach((cellRange: CellRange): void => {
        lineRangeList.add(
            createLineRange(
                cellRange.getFrom().getColId(),
                cellRange.getTo().getColId()
            )
        );
    });
    return lineRangeList.getRanges();
}