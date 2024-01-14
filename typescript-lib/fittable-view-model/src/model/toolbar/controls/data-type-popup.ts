import {
  CellCoord,
  CellRange,
  DataType,
  Table,
  TableCellDataType,
  asTableCellDataType,
  createCellDateFormatter,
  createCellNumberFormatter,
  getLanguageDictionary,
} from 'fittable-core/model';
import {
  ControlArgs,
  SelectorWindow,
  asSelectorWindow,
} from 'fittable-core/view-model';

import { FitUIOperationArgs } from '../../operation-executor/operation-args.js';
import { FitInputControl } from '../../common/controls/fit-input-control.js';
import { FitControl } from '../../common/controls/fit-control.js';
import { FitPopupControl } from '../../common/controls/fit-popup-control.js';
import { FitSelectorWindow } from '../../common/controls/fit-selector-window.js';
import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';
import { FitTextKey } from '../../language/language-def.js';
import { ControlUpdater } from './common/control-updater.js';

type DataTypeName = DataType['name'] | 'automatic';

export function createDataTypePopup(args: ControlArgs): DataTypePopup {
  return new DataTypePopup(args);
}

class DataTypePopup extends FitPopupControl<string> implements ControlUpdater {
  constructor(private readonly args: ControlArgs) {
    super(new FitSelectorWindow());
    this.initPopupWindow();
    this.initPopupButton();
  }

  public updateByCellSelection(): void {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectorWindow: SelectorWindow | undefined = //
      asSelectorWindow(this.getWindow());
    if (!selectorWindow) throw new Error('Invalid selector window!');
    const dataTypeTable: TableCellDataType | undefined =
      asTableCellDataType(table);
    if (!dataTypeTable) return;
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    if (selectedCells.length === 0) return;
    const cellCoord: CellCoord = selectedCells[0].getFrom();
    const dataType: DataType | undefined = //
      dataTypeTable.getCellDataType(cellCoord.getRowId(), cellCoord.getColId());
    const dataTypeName: DataTypeName = dataType?.name ?? 'automatic';
    for (const id of this.getWindow().getControlIds()) {
      if (id === dataTypeName) {
        selectorWindow.setControlId(id);
        break;
      }
    }
  }

  public override getWindow(): FitSelectorWindow<string> {
    return super.getWindow() as FitSelectorWindow<string>;
  }

  private initPopupWindow(): void {
    this.addAutomaticMenuItem();
    this.addTextMenuItem();
    this.addNumberMenuItem();
    this.addDateMenuItem();
  }

  private addAutomaticMenuItem(): void {
    const id: DataTypeName = 'automatic';
    const control: FitControl = new FitControl()
      .setType('menu-item')
      .setLabel((): string => getLanguageDictionary().getText('Automatic'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('automatic'))
      .setRun((): void => {
        const args: FitUIOperationArgs = {
          id: 'cell-data-type',
          selectedCells: this.args.getSelectedCells(),
        };
        this.args.operationExecutor.run(args);
        this.getWindow().setControlId(id);
        this.getWindow().setVisible(false);
      });
    this.getWindow().addControl(id, control);
    this.getWindow().setControlId(id);
  }

  private addTextMenuItem(): void {
    const id: DataTypeName = 'string';
    const control: FitControl = new FitControl()
      .setType('menu-item')
      .setLabel((): string => getLanguageDictionary().getText('Text'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('text'))
      .setRun((): void => {
        const args: FitUIOperationArgs = {
          id: 'cell-data-type',
          selectedCells: this.args.getSelectedCells(),
          dataType: { name: 'string' },
        };
        this.args.operationExecutor.run(args);
        this.getWindow().setControlId(id);
        this.getWindow().setVisible(false);
      });
    this.getWindow().addControl(id, control);
  }

  private addNumberMenuItem(): void {
    const id: DataTypeName = 'number';
    const window: FitSelectorWindow<string> = this.getWindow();
    window //
      .addControl(id, new NumberDataTypePopup(window, id, this.args));
  }

  private addDateMenuItem(): void {
    const id: DataTypeName = 'date-time';
    const window: FitSelectorWindow<string> = this.getWindow();
    window //
      .addControl(id, new DateDataTypePopup(window, id, this.args));
  }

  private initPopupButton(): void {
    this.setType('context-menu-button')
      .setLabel((): string =>
        getLanguageDictionary().getText('Data type & format')
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
}

abstract class AbstractDataTypePopup extends FitPopupControl<string> {
  constructor(
    protected readonly mainWindow: FitSelectorWindow<string>,
    protected readonly controlId: DataTypeName,
    protected readonly args: ControlArgs
  ) {
    super(new FitSelectorWindow());
    this.initWindow();
    this.initButton();
  }

  public override getWindow(): FitSelectorWindow<string> {
    return super.getWindow() as FitSelectorWindow<string>;
  }

  protected abstract initWindow(): void;

  protected abstract initButton(): void;

  protected addMenuLabel(...label: FitTextKey[]): void {
    const control = new FitControl()
      .setType('label')
      .setLabel((): string => this.join(label));
    this.getWindow().addControl(this.join(label), control);
  }

  private join(labels: FitTextKey[]): string {
    let result = '';
    for (const label of labels) {
      if (result) result += ' & ';
      result += getLanguageDictionary().getText(label);
    }
    return result;
  }

  protected addMenuItem(
    label: string,
    value: string,
    dataTypeName: DataType['name']
  ): void {
    const control: FitValueControl = new FitValueControl()
      .setType('menu-item')
      .setLabel(
        (): string =>
          getLanguageDictionary().getText(label) +
          ` (${getLanguageDictionary().getText(value)})`
      )
      .setValue(value);
    control.setRun((): void => {
      const controlValue: string = //
        getLanguageDictionary().getText('' + control.getValue());
      const args: FitUIOperationArgs = {
        id: 'cell-data-type',
        selectedCells: this.args.getSelectedCells(),
        dataType: { name: dataTypeName, format: controlValue },
      };
      this.args.operationExecutor.run(args);
      this.mainWindow.setControlId(this.controlId);
      this.getWindow().setControlId(label).setVisible(false);
      this.mainWindow.setVisible(false);
    });
    this.getWindow().addControl(label, control);
    !this.getWindow().getControlId() && this.getWindow().setControlId(label);
  }

  protected addCustomMenuItem(
    label: string,
    value: string,
    dataTypeName: DataType['name']
  ): void {
    const control: FitInputControl = new FitInputControl()
      .setType('menu-item')
      .setLabel((): string => label)
      .setValue(value);
    control.setRun((): void => {
      if (control.isDisabled()) {
        throw new Error(`Disabled conrol with id '${label}'.`);
      }
      if (!control.isValid()) {
        throw new Error(`Invalid format '${control.getValue()}'.`);
      }
      const args: FitUIOperationArgs = {
        id: 'cell-data-type',
        selectedCells: this.args.getSelectedCells(),
        dataType: { name: dataTypeName, format: '' + control.getValue() },
      };
      this.args.operationExecutor.run(args);
      this.mainWindow.setControlId(this.controlId);
      this.getWindow().setControlId(label).setVisible(false);
      this.mainWindow.setVisible(false);
    });
    this.getWindow().addControl(label, control);
  }
}

class NumberDataTypePopup extends AbstractDataTypePopup {
  protected initWindow(): void {
    this.addMenuLabel('Plain number');
    this.addMenuItem('1000', '#', 'number');
    this.addMenuItem('1000.00', '#.00', 'number');
    this.addMenuItem('1,000.00', '#,#.00', 'number');
    this.addMenuLabel('Percent');
    this.addMenuItem('1000%', '#%', 'number');
    this.addMenuItem('1000.00%', '#.00%', 'number');
    this.addMenuItem('1,000.00%', '#,#.00%', 'number');
    this.addMenuLabel('Currency');
    this.addMenuItem('$1000', '$#', 'number');
    this.addMenuItem('$1000.00', '$#.00', 'number');
    this.addMenuItem('$1,000.00', '$#,#.00', 'number');
    this.addMenuLabel('Custom format');
    this.addCustomMenuItem('', 'RON 0#.##0');
  }

  protected initButton(): void {
    this.setType('parent-menu-item')
      .setLabel((): string => getLanguageDictionary().getText('Number'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('number'))
      .setRun((): void => {
        this.getWindow().setVisible(true);
      });
  }

  protected override addCustomMenuItem(label: string, value: string): void {
    super.addCustomMenuItem(label, value, 'number');
    const control: FitInputControl = //
      this.getWindow().getControl(label) as FitInputControl;
    control.setValid((): boolean => {
      if (!this.getWindow().isVisible()) return true;
      try {
        const format: string = //
          getLanguageDictionary().getText('' + control.getValue());
        createCellNumberFormatter().formatValue(1, format);
        return true;
      } catch {
        return false;
      }
    });
  }
}

class DateDataTypePopup extends AbstractDataTypePopup {
  protected initWindow(): void {
    this.addMenuLabel('Date');
    this.addMenuItem('2023-12-31', 'yyyy-MM-dd', 'date-time');
    this.addMenuItem('31.12.2023', 'dd.MM.yyyy', 'date-time');
    this.addMenuItem('12/31/2023', 'MM/dd/yyyy', 'date-time');
    this.addMenuLabel('Time');
    this.addMenuItem('23:59', 'hh:mm', 'date-time');
    this.addMenuItem('23:59:59', 'hh:mm:ss', 'date-time');
    this.addMenuLabel('Date', 'Time');
    this.addMenuItem('01-12-23 01:30', 'dd-MM-yy hh:mm', 'date-time');
    this.addMenuItem('1.12.23 1:30:59', 'd.M.y h:m:s', 'date-time');
    this.addMenuLabel('Custom format');
    this.addCustomMenuItem('', 'yyyy.MM.dd');
  }

  protected initButton(): void {
    this.setType('parent-menu-item')
      .setLabel(
        (): string =>
          getLanguageDictionary().getText('Date') +
          ' / ' +
          getLanguageDictionary().getText('Time')
      )
      .setIcon((): string | undefined => getImageRegistry().getUrl('date'))
      .setRun((): void => {
        this.getWindow().setVisible(true);
      });
  }

  protected override addCustomMenuItem(label: string, value: string): void {
    super.addCustomMenuItem(label, value, 'date-time');
    const control: FitInputControl = //
      this.getWindow().getControl(label) as FitInputControl;
    control.setValid((): boolean => {
      if (!this.getWindow().isVisible()) return true;
      try {
        const format: string = //
          getLanguageDictionary().getText('' + control.getValue());
        createCellDateFormatter() //
          .formatValue('2023-12-31', format);
        return true;
      } catch {
        return false;
      }
    });
  }
}
