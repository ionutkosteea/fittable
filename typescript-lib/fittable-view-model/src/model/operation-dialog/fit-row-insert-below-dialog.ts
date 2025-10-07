import { getLanguageDictionary } from "fittable-core/model";
import { ControlArgs, DialogField, OperationDialogFactory } from "fittable-core/view-model";

import { FitUIOperationArgs } from "../operation-executor/operation-args.js";
import { FitOperationDialog, getFirstLine, getSelectedRows } from "./operation-dialog-core.js";

export class FitRowInsertBelowDialogFactory implements OperationDialogFactory {
    createOperationDialog(args: ControlArgs): FitOperationDialog {
        const defaultNumberOfRows = 1;
        let numberOfRows: number | undefined = undefined;
        const numberOfRowsField: DialogField = {
            getLabel: () => getLanguageDictionary().getText('Number of rows'),
            getType: () => 'number',
            getValue: () => numberOfRows ?? defaultNumberOfRows,
            setValue: (value?: number) => { numberOfRows = value },
            isValid: () => numberOfRows == undefined ||
                Number.isInteger(numberOfRows) && numberOfRows >= 1 && numberOfRows <= 400000
        };
        const runFn: () => void = () => {
            const operationArgs: FitUIOperationArgs = {
                id: 'row-insert',
                selectedLines: getFirstLine(getSelectedRows(args.getSelectedCells())),
                numberOfNewLines: numberOfRows ?? defaultNumberOfRows,
                insertAfter: true
            }
            args.operationExecutor?.run(operationArgs);
        }
        return new FitOperationDialog()
            .setField('row-insert', numberOfRowsField)
            .setTitleFn(() => getLanguageDictionary().getText('Insert rows below'))
            .setRunFn(runFn);
    }
}