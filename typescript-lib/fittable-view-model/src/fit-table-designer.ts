import { Table } from "fittable-core/model";
import { createOperationExecutor, OperationExecutor } from "fittable-core/operations";
import { createViewModel, TableDesigner, TableDesignerFactory, ViewModel } from "fittable-core/view-model";

export class FitTableDesigner implements TableDesigner {
    public readonly operationExecutor?: OperationExecutor;
    public readonly viewModel: ViewModel;

    constructor(table: Table, readOnly?: boolean) {
        if (!readOnly) this.operationExecutor = createOperationExecutor();
        this.viewModel = createViewModel(table, this.operationExecutor);
    }

    public get table(): Table {
        return this.viewModel.table;
    }

    public loadTable(table: Table): void {
        this.viewModel.loadTable(table);
    }
}

export class FitTableDesignerFactory implements TableDesignerFactory {
    createTableDesigner(table: Table, readOnly?: boolean): TableDesigner {
        return new FitTableDesigner(table, readOnly);
    }

}