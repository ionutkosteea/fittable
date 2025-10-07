import { getLanguageDictionary } from "fittable-core/model";
import { ControlArgs, DialogField, OperationDialogFactory } from "fittable-core/view-model";

import { FitUIOperationArgs } from "../operation-executor/operation-args.js";
import { FitOperationDialog, getFirstLine, getSelectedCols } from "./operation-dialog-core.js";

export class FitColInsertLeftDialogFactory implements OperationDialogFactory {
    createOperationDialog(args: ControlArgs): FitOperationDialog {
        const defaultNumberOfCols = 1;
        let numberOfCols: number | undefined = undefined;
        const numberOfColsField: DialogField = {
            getLabel: () => getLanguageDictionary().getText('Number of columns'),
            getType: () => 'number',
            getValue: () => numberOfCols ?? defaultNumberOfCols,
            setValue: (value?: number) => { numberOfCols = value },
            isValid: () => numberOfCols == undefined ||
                Number.isInteger(numberOfCols) && numberOfCols >= 1 && numberOfCols <= 80000
        };
        const runFn: () => void = () => {
            const operationArgs: FitUIOperationArgs = {
                id: 'column-insert',
                selectedLines: getFirstLine(getSelectedCols(args.getSelectedCells())),
                numberOfNewLines: numberOfCols ?? defaultNumberOfCols,
            }
            args.operationExecutor?.run(operationArgs);
        }
        return new FitOperationDialog()
            .setField('column-insert', numberOfColsField)
            .setTitleFn(() => getLanguageDictionary().getText('Insert columns left'))
            .setRunFn(runFn);
    }
}