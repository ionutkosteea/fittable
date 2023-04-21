import { Subscription } from 'rxjs';

import {
  Table,
  Value,
  TableColFilter,
  ColFilterExecutor,
  createColFilterExecutor,
  asTableColFilter,
} from 'fittable-core/model/index.js';
import { OperationExecutor } from 'fittable-core/operations/index.js';
import {
  ColFilters,
  ColFiltersFactory,
  ScrollContainer,
  createScrollContainer,
  Control,
  ValueCondition,
} from 'fittable-core/view-model/index.js';

import { FitLanguageDictionary } from '../language-dictionary/fit-language-dictionary.js';
import { FitImageRegistry } from '../image-registry/fit-image-registry.js';
import { FitControl } from '../common/controls/fit-control.js';
import { FitOptionsControl } from '../common/controls/fit-options-control.js';
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
  private popUpButton!: FitOptionsControl<FitColFiltersControlId>;
  private valueConditions!: ColValueConditions;
  private valueScroller!: ScrollContainer;
  private isSearchMode = false;

  private readonly subscriptions: Subscription[] = [];
  private valueCheckListSubscriptions: Subscription[] = [];

  constructor(private readonly args: FitColFilterArgs) {
    const table: FitTable | undefined = //
      asTableColFilter(args.operationExecutor.getTable());
    if (!table) throw new Error('Filter table was not found!');
    this.filterExecutor = createColFilterExecutor(table);
    this.valueConditions = new ColValueConditions();
    this.popUpButton = this.createPopUpButton();
    this.valueScroller = createScrollContainer() //
      .setVerticalScrollbar(new ColValueScrollbar(this.popUpButton));
    this.subscriptions.push(this.clearValueCheckListControls$());
  }

  private createPopUpButton(): FitOptionsControl<FitColFiltersControlId> {
    const window: FitWindow<FitColFiltersControlId> = new FitWindow();
    window
      .addControl('search-input', this.createSearchInput())
      .addControl('value-check-list', this.createValueCheckList())
      .addControl('clear-button', this.createClearButton())
      .addControl('select-all-button', this.createSelectAllButton())
      .addControl('ok-button', this.createOkButton())
      .addControl('cancel-button', this.createCancelButton());
    return new FitOptionsControl<FitColFiltersControlId>(window) //
      .setLabel((): string => 'Filter');
  }

  private createSearchInput(): FitInputControl {
    const input: FitInputControl = new FitInputControl() //
      .setLabel((): string => this.args.dictionary.getText('Filter by value'))
      .setIcon((): string | undefined =>
        this.args.imageRegistry.getImageUrl('search')
      );
    let origList: FitOptionsControl<string> | undefined;
    input.setRun((): void => {
      setTimeout((): void => {
        if (!origList) origList = this.getValueCheckList();
        const inputValue: string =
          this.getValueAsString(input.getValue()) ?? '';
        if (inputValue) {
          this.isSearchMode = true;
          const searchList: FitOptionsControl<string> =
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
          this.getPopUpWindow().addControl('value-check-list', searchList);
        } else {
          this.isSearchMode = false;
          this.getPopUpWindow().addControl('value-check-list', origList);
        }
        this.valueScroller.resizeViewportHeight().renderModel();
      }, 100);
    });
    return input;
  }

  private createValueCheckList(): FitOptionsControl<string> {
    return new FitOptionsControl<FitColFiltersControlId>(new FitWindow());
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
        this.getPopUpWindow().setVisible(false);
      });
  }

  private createCancelButton(): FitControl {
    return new FitControl()
      .setLabel((): string => this.args.dictionary.getText('Cancel'))
      .setRun((): void => {
        this.getPopUpWindow().setVisible(false);
      });
  }

  public getPopUpButton(
    colId: number
  ): FitOptionsControl<FitColFiltersControlId> {
    return this.popUpButton.setIcon((): string | undefined =>
      colId in this.valueConditions.store
        ? this.getFilterOnIcon()
        : this.getFilterOffIcon()
    );
  }

  public getValueScroller(): ScrollContainer {
    return this.valueScroller;
  }

  public getValueConditions(): { [colId: number]: ValueCondition } {
    return this.valueConditions.store;
  }

  public loadCol(colId: number): this {
    this.colId = colId;
    this.valueConditions.loadCol(colId);
    this.createValueCheckListControls();
    this.getPopUpWindow().addControl('search-input', this.createSearchInput());
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
    return this.getPopUpWindow()
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

  private readonly getValueCheckList = (): FitOptionsControl<string> =>
    this.getPopUpWindow() //
      .getControl('value-check-list') as FitOptionsControl<string>;

  private readonly getPopUpWindow = (): FitWindow<FitColFiltersControlId> =>
    this.popUpButton.getWindow();

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
