import { asTableCols, getLanguageDictionary } from 'fittable-core/model';
import { OperationDialogFactory, ControlArgs, DialogField, getViewModelConfig } from 'fittable-core/view-model';

import { FitUIOperationArgs } from '../operation-executor/operation-args.js';
import { FitOperationDialog, getFirstLine, getSelectedCols } from './operation-dialog-core.js';

export class FitColResizeDialogFactory implements OperationDialogFactory {
    createOperationDialog(args: ControlArgs): FitOperationDialog {
        const defaultWidth = getViewModelConfig().colWidths;
        let width: number | undefined = undefined;
        const widthField: DialogField = {
            getLabel: () => getLanguageDictionary().getText('Width'),
            getType: () => 'number',
            getValue: () => this.getColWidth(args),
            setValue: (value?: number) => { width = value },
            isValid: () => width == undefined ||
                Number.isInteger(width) && width >= 1 && width <= 1000
        };
        const runFn: () => void = () => {
            const operationArgs: FitUIOperationArgs = {
                id: 'column-width',
                selectedLines: getFirstLine(getSelectedCols(args.getSelectedCells())),
                width: width ?? defaultWidth,
            }
            args.operationExecutor?.run(operationArgs);
        }
        return new FitOperationDialog()
            .setField('column-width', widthField)
            .setTitleFn(() => getLanguageDictionary().getText('Resize columns'))
            .setRunFn(runFn);
    }

    private getColWidth(args: ControlArgs): number {
        const defaultWidth = getViewModelConfig().colWidths;
        const tableCols = asTableCols(args.operationExecutor.getTable());
        const selectedCells = args.getSelectedCells();
        if (selectedCells && selectedCells.length > 0) {
            const colId = selectedCells[0].getFrom().getColId();
            return tableCols?.getColWidth(colId) ?? defaultWidth;
        }
        return 0;
    }
}