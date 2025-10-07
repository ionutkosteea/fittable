import { MissingFactoryError } from "../../common/factory-error.js";
import { getViewModelConfig } from "../view-model-config.js";
import { ControlArgs } from "./controls.js";

export type FieldType = 'number' | 'boolean';
export type FieldValue = number | boolean;

export interface DialogField {
    getLabel: () => string;
    getType: () => FieldType;
    getValue(): FieldValue;
    setValue(value?: FieldValue): void;
    isValid(): boolean;
}

export interface OperationDialog {
    isVisible(): boolean;
    setVisible(visible: boolean): this;
    getTitle(): string;
    getFieldIds(): string[];
    getField(id: string): DialogField | undefined;
    setField(id: string, field: DialogField): this;
    canRun(): boolean;
    run(): this;
}

export interface OperationDialogFactory {
    createOperationDialog(args: ControlArgs): OperationDialog;
}

export function createRowResizeDialog(args: ControlArgs): OperationDialog {
    return createOperationDialog(args, getViewModelConfig().rowResizeDialogFactory);
}

export function createRowInsertAboveDialog(args: ControlArgs): OperationDialog {
    return createOperationDialog(args, getViewModelConfig().rowInsertAboveDialogFactory);
}

export function createRowInsertBelowDialog(args: ControlArgs): OperationDialog {
    return createOperationDialog(args, getViewModelConfig().rowInsertBelowDialogFactory);
}

export function createColResizeDialog(args: ControlArgs): OperationDialog {
    return createOperationDialog(args, getViewModelConfig().colResizeDialogFactory);
}

export function createColInsertLeftDialog(args: ControlArgs): OperationDialog {
    return createOperationDialog(args, getViewModelConfig().colInsertLeftDialogFactory);
}

export function createColInsertRightDialog(args: ControlArgs): OperationDialog {
    return createOperationDialog(args, getViewModelConfig().colInsertRightDialogFactory,);
}

function createOperationDialog(args: ControlArgs, factory?: OperationDialogFactory): OperationDialog {
    if (factory) return factory.createOperationDialog(args);
    else throw new MissingFactoryError();
}