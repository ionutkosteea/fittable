import { asTableDataRefs, getLanguageDictionary, TableDataRefs } from "fittable-core/model";
import { ControlArgs, getImageRegistry } from "fittable-core/view-model";

import { FitPopupControl } from "../../common/controls/fit-popup-control.js";
import { FitSelectorWindow } from "../../common/controls/fit-selector-window.js";
import { FitControl } from "../../common/controls/fit-control.js";
import { FitTextKey } from "../../language/language-def.js";
import { FitImageId } from "../../image-registry/fit-image-ids.js";
import { implementsTKeys } from "fittable-core/common";


export function createDataRefPopup(args: ControlArgs): DataRefPopup {
    return new DataRefPopup(args);
}

type ControlId = 'cell-value' | 'cell-data-ref';

class DataRefPopup extends FitPopupControl<string> {

    private readonly tableDataRefs?: TableDataRefs;

    constructor(private readonly args: ControlArgs) {
        super(new FitSelectorWindow());
        this.tableDataRefs = asTableDataRefs(args.operationExecutor.getTable());
        this.initPopupWindow();
        this.initPopupButton();
    }

    public override getWindow(): FitSelectorWindow<string> {
        return super.getWindow() as FitSelectorWindow<string>;
    }

    private initPopupWindow(): void {
        this.addCellValueMenuItem();
        this.addCellDataRefMenuItem();
    }

    private addCellValueMenuItem(): void {
        const id: ControlId = 'cell-value';
        const text: FitTextKey = 'Show cell values';
        const imageId: FitImageId = 'cellValue';
        const control: FitControl = new FitControl()
            .setType('menu-item')
            .setLabel((): string => getLanguageDictionary().getText(text))
            .setIcon((): string | undefined => getImageRegistry().getUrl(imageId))
            .setRun((): void => {
                this.tableDataRefs?.setShowDataRefs(false);
                this.args.cellEditor && this.args.cellEditor.setCell(this.args.cellEditor.getCell())
                this.disableColFilterButtons(false);
                this.getWindow().setControlId(id);
                this.getWindow().setVisible(false);
            });
        this.getWindow().addControl(id, control);
        this.getWindow().setControlId(id);
    }

    private addCellDataRefMenuItem(): void {
        const id: ControlId = 'cell-data-ref';
        const text: FitTextKey = 'Show cell data references';
        const imageId: FitImageId = 'cellDataRef';
        const control: FitControl = new FitControl()
            .setType('menu-item')
            .setLabel((): string => getLanguageDictionary().getText(text))
            .setIcon((): string | undefined => getImageRegistry().getUrl(imageId))
            .setRun((): void => {
                this.tableDataRefs?.setShowDataRefs(true);
                this.args.cellEditor && this.args.cellEditor.setCell(this.args.cellEditor.getCell())
                this.disableColFilterButtons(true);
                this.getWindow().setControlId(id);
                this.getWindow().setVisible(false);
            });
        this.getWindow().addControl(id, control);
    }

    private initPopupButton(): void {
        this.setType('context-menu-button')
            .setLabel((): string =>
                this.getWindow().getSelectedControl()?.getLabel() ?? ''
            )
            .setIcon((): string | undefined => {
                return this.getWindow().getSelectedControl()?.getIcon();
            })
            .setRun((): void => {
                !this.isDisabled() &&
                    !this.getWindow().isVisible() &&
                    this.getWindow().setVisible(true);
            });
    }

    private disableColFilterButtons(disable: boolean): void {
        if (!this.args.colFilters) return;
        const numberOfCols = this.args.operationExecutor.getTable()?.getNumberOfCols() ?? 0;
        for (let colId = 0; colId < numberOfCols; colId++) {
            const colFilterButton = this.args.colFilters?.getPopupButton(colId)
            if (implementsTKeys<FitControl>(colFilterButton, ['setDisabled'])) {
                colFilterButton.setDisabled(disable);
            }
        }
    }
}