import { asTableRows, getLanguageDictionary } from "fittable-core/model";
import { ControlArgs, DialogField, getViewModelConfig, OperationDialogFactory } from "fittable-core/view-model";

import { FitUIOperationArgs } from "../operation-executor/operation-args.js";
import { FitOperationDialog, getFirstLine, getSelectedRows } from "./operation-dialog-core.js";

export class FitRowResizeDialogFactory implements OperationDialogFactory {
    createOperationDialog(args: ControlArgs): FitOperationDialog {
        const defaultHeight = getViewModelConfig().rowHeights;
        let height: number | undefined = undefined;
        let isAuto: boolean | undefined = undefined;
        const heightField: DialogField = {
            getLabel: () => getLanguageDictionary().getText('Height'),
            getType: () => 'number',
            getValue: () => this.getRowHeight(args),
            setValue: (value?: number) => { height = value },
            isValid: () => height == undefined ||
                Number.isInteger(height) && height >= 1 && height <= 1000
        };
        const autoHeightField: DialogField = {
            getLabel: () => getLanguageDictionary().getText('Fit to data'),
            getType: () => 'boolean',
            getValue: () => this.isRowAutoHeight(args),
            setValue: (value: boolean) => { isAuto = value ?? undefined },
            isValid: () => true
        };
        const runFn: () => void = () => {
            const operationArgs: FitUIOperationArgs = {
                id: 'row-height',
                selectedLines: getFirstLine(getSelectedRows(args.getSelectedCells())),
                height: height ?? defaultHeight,
                isAuto,
            }
            args.operationExecutor?.run(operationArgs);
        }
        return new FitOperationDialog()
            .setField('row-height', heightField)
            .setField('row-height-auto', autoHeightField)
            .setTitleFn(() => getLanguageDictionary().getText('Resize rows'))
            .setRunFn(runFn);
    }

    private getRowHeight(args: ControlArgs): number {
        const tableRows = asTableRows(args.operationExecutor.getTable());
        const defaultHeight = getViewModelConfig().rowHeights;
        const selectedCells = args.getSelectedCells();
        if (selectedCells && selectedCells.length > 0) {
            const rowId = selectedCells[0].getFrom().getRowId();
            return tableRows?.getRowHeight(rowId) ?? defaultHeight;
        }
        return 0;
    }

    private isRowAutoHeight(args: ControlArgs): boolean {
        const tableRows = asTableRows(args.operationExecutor.getTable());
        const selectedCells = args.getSelectedCells();
        if (selectedCells && selectedCells.length > 0) {
            const rowId = selectedCells[0].getFrom().getRowId();
            return tableRows?.isRowAutoHeight(rowId) ?? false;
        }
        return false;
    }
}