import { Subscription } from 'rxjs';

import {
  Table,
  Value,
  TableColFilter,
  ColFilterExecutor,
  createColFilterExecutor,
  asTableColFilter,
} from 'fittable-core/model';
import { OperationExecutor } from 'fittable-core/operations';
import {
  ColFilters,
  ColFiltersFactory,
  ScrollContainer,
  createScrollContainer,
  Control,
  ValueCondition,
} from 'fittable-core/view-model';

import { FitLanguageDictionary } from '../language-dictionary/fit-language-dictionary.js';
import { FitImageRegistry } from '../image-registry/fit-image-registry.js';
import { FitControl } from '../common/controls/fit-control.js';
import { FitPopupControl } from '../common/controls/fit-popup-control.js';
import { FitWindow } from '../common/controls/fit-window.js';
import { FitInputControl } from '../common/controls/fit-input-control.js';
import { FitCheckBoxControl } from '../common/controls/fit-check-box-control.js';
import {
  ColValueConditions,
  ColValueCondition,
} from './col-value-conditions.js';
import { ColValueScrollbar } from './col-value-scrollbar.js';
import {
  ColFilterOperationArgs,
  ColFilterOperationStepDto,
} from './col-filter-operation.js';

export type FitColFiltersControlId =
  | 'search-input'
  | 'clear-button'
  | 'select-all-button'
  | 'value-check-list'
  | 'ok-button'
  | 'cancel-button';

type FitTable = Table & TableColFilter;

type FitColFilterArgs = {
  dictionary: FitLanguageDictionary;
  imageRegistry: FitImageRegistry;
  operationExecutor: OperationExecutor;
};

export class FitColFilters implements ColFilters {
  public readonly filterExecutor: ColFilterExecutor;

  private colId!: number;
  private popupButton!: FitPopupControl<FitColFiltersControlId>;
  private valueConditions!: ColValueConditions;
  private valueScrollContainer!: ScrollContainer;
  private isSearchMode = false;

  private readonly subscriptions: Subscription[] = [];
  private valueCheckListSubscriptions: Subscription[] = [];

  constructor(private readonly args: FitColFilterArgs) {
    const table: FitTable | undefined = //
      asTableColFilter(args.operationExecutor.getTable());
    if (!table) throw new Error('Filter table was not found!');
    this.filterExecutor = createColFilterExecutor(table);
    this.valueConditions = new ColValueConditions();
    this.popupButton = this.createPopupButton();
    this.valueScrollContainer = createScrollContainer() //
      .setVerticalScrollbar(new ColValueScrollbar(this.popupButton));
    this.subscriptions.push(this.clearValueCheckListControls$());
  }

  private createPopupButton(): FitPopupControl<FitColFiltersControlId> {
    const window: FitWindow<FitColFiltersControlId> = new FitWindow();
    window
      .addControl('search-input', this.createSearchInput())
      .addControl('value-check-list', this.createValueCheckList())
      .addControl('clear-button', this.createClearButton())
      .addControl('select-all-button', this.createSelectAllButton())
      .addControl('ok-button', this.createOkButton())
      .addControl('cancel-button', this.createCancelButton());
    return new FitPopupControl<FitColFiltersControlId>(window) //
      .setLabel((): string => this.args.dictionary.getText('Filter'));
  }

  private createSearchInput(): FitInputControl {
    const input: FitInputControl = new FitInputControl() //
      .setLabel((): string => this.args.dictionary.getText('Filter by value'))
      .setIcon((): string | undefined =>
        this.args.imageRegistry.getImageUrl('search')
      );
    let origList: FitPopupControl<string> | undefined;
    input.setRun((): void => {
      setTimeout((): void => {
        if (!origList) origList = this.getValueCheckList();
        const inputValue: string =
          this.getValueAsString(input.getValue()) ?? '';
        if (inputValue) {
          this.isSearchMode = true;
          const searchList: FitPopupControl<string> =
            this.createValueCheckList();
          const origWindow: FitWindow<string> = origList.getWindow();
          let counter = 0;
          for (const id of origWindow.getControlIds()) {
            const checkBox = origWindow.getControl(id) as FitCheckBoxControl;
            const valueAsString: string | undefined = //
              this.getValueAsString(checkBox.getValue());
            if (valueAsString?.includes(inputValue)) {
              searchList.getWindow().addControl('' + counter, checkBox);
              counter++;
            }
          }
          this.getPopupWindow().addControl('value-check-list', searchList);
        } else {
          this.isSearchMode = false;
          this.getPopupWindow().addControl('value-check-list', origList);
        }
        this.valueScrollContainer.renderModel();
      }, 100);
    });
    return input;
  }

  private createValueCheckList(): FitPopupControl<string> {
    return new FitPopupControl<FitColFiltersControlId>(new FitWindow());
  }

  private createClearButton(): FitControl {
    return new FitControl()
      .setLabel((): string => this.args.dictionary.getText('Clear'))
      .setRun((): void => {
        for (const control of this.getValueCheckListContainer().getControls()) {
          const checkBox: FitCheckBoxControl = control as FitCheckBoxControl;
          checkBox.setChecked(false);
        }
        if (!this.isSearchMode) {
          this.valueConditions.current.mode = 'Clear';
          this.valueConditions.current.values.clear();
        }
      });
  }

  private createSelectAllButton(): FitControl {
    return new FitControl()
      .setLabel((): string => this.args.dictionary.getText('Select all'))
      .setRun((): void => {
        for (const control of this.getValueCheckListContainer().getControls()) {
          const checkBox: FitCheckBoxControl = control as FitCheckBoxControl;
          checkBox.setChecked(true);
        }
        if (!this.isSearchMode) {
          this.valueConditions.current.mode = 'Select all';
          this.valueConditions.current.values.clear();
        }
      });
  }

  private createOkButton(): FitControl {
    return new FitControl()
      .setLabel((): string => this.args.dictionary.getText('Ok'))
      .setRun((): void => {
        const stepDto: ColFilterOperationStepDto = {
          id: 'column-filter',
          colId: this.colId,
          valueCondition: {
            mode: this.valueConditions.current.mode,
            values: [...this.valueConditions.current.values],
          },
        };
        const undoStepDto: ColFilterOperationStepDto = {
          id: 'column-filter',
          colId: this.colId,
          valueCondition: this.valueConditions.store[this.colId],
        };
        const args: ColFilterOperationArgs = {
          id: 'column-filter',
          stepDto,
          undoStepDto,
        };
        this.args.operationExecutor.run(args);
        this.getPopupWindow().setVisible(false);
      });
  }

  private createCancelButton(): FitControl {
    return new FitControl()
      .setLabel((): string => this.args.dictionary.getText('Cancel'))
      .setRun((): void => {
        this.getPopupWindow().setVisible(false);
      });
  }

  public getPopupButton(
    colId: number
  ): FitPopupControl<FitColFiltersControlId> {
    return this.popupButton.setIcon((): string | undefined =>
      colId in this.valueConditions.store
        ? this.getFilterOnIcon()
        : this.getFilterOffIcon()
    );
  }

  public getValueScrollContainer(): ScrollContainer {
    return this.valueScrollContainer;
  }

  public getValueConditions(): { [colId: number]: ValueCondition } {
    return this.valueConditions.store;
  }

  public loadCol(colId: number): this {
    this.colId = colId;
    this.valueConditions.loadCol(colId);
    this.createValueCheckListControls();
    this.getPopupWindow().addControl('search-input', this.createSearchInput());
    this.isSearchMode = false;
    return this;
  }

  private createValueCheckListControls(): void {
    this.valueCheckListSubscriptions //
      .forEach((s: Subscription): void => s.unsubscribe());
    this.valueCheckListSubscriptions = [];
    const container: FitWindow<string> = this.getValueCheckListContainer() //
      .clearControls();
    const table: FitTable =
      this.filterExecutor.getTable(this.colId) ??
      this.filterExecutor.getFilteredTable() ??
      this.filterExecutor.table;
    for (let rowId = 0; rowId < table.getNumberOfRows(); rowId++) {
      const value: Value | undefined = table.getCellValue(rowId, this.colId);
      const valueAsString: string | undefined = this.getValueAsString(value);
      const label: string = this.getLabel(valueAsString);
      const checkBox: FitCheckBoxControl = new FitCheckBoxControl()
        .setLabel((): string => label)
        .setValue(value);
      this.updateCheckBox(checkBox, valueAsString);
      this.valueCheckListSubscriptions //
        .push(this.updateValueConditions$(checkBox, valueAsString));
      container.addControl(label, checkBox);
    }
    let counter = 0;
    for (const id of container.getControlIds()) {
      const control: Control = container.getControl(id);
      container.addControl('' + counter, control);
      container.removeControl(id);
      counter++;
    }
  }

  private updateCheckBox(checkBox: FitCheckBoxControl, value?: string): void {
    if (this.valueConditions.current.mode === 'Select all') {
      checkBox.setChecked(!this.valueConditions.current.values.has(value));
    } else {
      checkBox.setChecked(this.valueConditions.current.values.has(value));
    }
  }

  private updateValueConditions$(
    checkBox: FitCheckBoxControl,
    value?: string
  ): Subscription {
    return checkBox.onAfterSetChecked$().subscribe((checked: boolean): void => {
      const condition: ColValueCondition = this.valueConditions.current;
      if (condition.mode === 'Select all') {
        if (checked) {
          condition.values.has(value) && condition.values.delete(value);
        } else {
          condition.values.add(value);
        }
      } else {
        if (checked) condition.values.add(value);
        else condition.values.has(value) && condition.values.delete(value);
      }
    });
  }

  private clearValueCheckListControls$(): Subscription {
    return this.getPopupWindow()
      .onAfterSetFocus$()
      .subscribe((focus: boolean): void => {
        if (focus) return;
        this.getValueCheckListContainer().clearControls();
      });
  }

  private readonly getValueAsString = (value?: Value): string | undefined =>
    value === undefined ? undefined : '' + value;

  private readonly getLabel = (value?: string): string =>
    value === undefined || value === ''
      ? '(' + this.args.dictionary.getText('Blank cells') + ')'
      : value;

  private readonly getValueCheckListContainer = (): FitWindow<string> =>
    this.getValueCheckList().getWindow();

  private readonly getValueCheckList = (): FitPopupControl<string> =>
    this.getPopupWindow() //
      .getControl('value-check-list') as FitPopupControl<string>;

  private readonly getPopupWindow = (): FitWindow<FitColFiltersControlId> =>
    this.popupButton.getWindow();

  private readonly getFilterOffIcon = (): string | undefined =>
    this.args.imageRegistry.getImageUrl('filter');

  private readonly getFilterOnIcon = (): string | undefined =>
    this.args.imageRegistry.getImageUrl('filterBlue');

  public destroy(): void {
    this.valueCheckListSubscriptions //
      .forEach((s: Subscription): void => s.unsubscribe());
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

export class FitColFiltersFactory implements ColFiltersFactory {
  public createColFilters(args: FitColFilterArgs): ColFilters {
    return new FitColFilters(args);
  }
}
