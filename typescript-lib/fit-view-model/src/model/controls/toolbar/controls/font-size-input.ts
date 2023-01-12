import { Subject } from 'rxjs';

import {
  CellRange,
  Style,
  createStyle,
  Table,
  Value,
} from 'fit-core/model/index.js';
import {
  ControlArgs,
  ViewModelConfig,
  getViewModelConfig,
  InputControl,
} from 'fit-core/view-model/index.js';

import { FitOperationArgs } from '../../../operation-executor/operation-args.js';
import { ControlType } from '../../../common/view-model-utils.js';
import { getFirstCellStyle } from '../../../common/view-model-utils.js';

export class FontSizeInput implements InputControl {
  public readonly focus$: Subject<boolean> = new Subject();
  public readonly forceValue$?: Subject<Value | undefined> | undefined =
    new Subject();

  private config: ViewModelConfig = getViewModelConfig();
  private value?: number;
  private textCursor = true;

  constructor(private readonly args: ControlArgs) {}

  public updateByCellSelection(): void {
    this.value = this.getStyleFontSize();
  }

  public getType(): ControlType | undefined {
    return 'input';
  }

  public getLabel(): string {
    return this.args.dictionary.getText('Font size');
  }

  public getValue(): number {
    return this.value ?? this.config.fontSize ?? 0;
  }

  public setValue(value?: number): this {
    if (value === this.config.fontSize) this.value = undefined;
    else this.value = value;
    return this;
  }

  public isValid(): boolean {
    return this.getValue() > 0;
  }

  public run(): void {
    if (this.isValid()) {
      const selectedCells: CellRange[] = this.args.getSelectedCells();
      const style: Style = createStyle().set('font-size.px', this.getValue());
      const args: FitOperationArgs = {
        id: 'style-update',
        selectedCells,
        style,
      };
      this.args.operationExecutor.run(args);
    } else {
      const oldValue: number = this.getStyleFontSize();
      console.warn(
        'Invalid font size ' +
          this.getValue() +
          '. Restore old value ' +
          oldValue +
          '.'
      );
      this.setValue(oldValue);
      this.forceValue$?.next(oldValue);
    }
  }

  private getStyleFontSize(): number {
    const table: Table | undefined = this.args.operationExecutor.getTable();
    if (!table) throw new Error('Invalid operation executor!');
    const selectedCells: CellRange[] = this.args.getSelectedCells();
    const style: Style | undefined = getFirstCellStyle(table, selectedCells);
    const fontSize: string | number | undefined = style?.get('font-size.px');
    return fontSize ? (fontSize as number) : this.config.fontSize ?? 0;
  }

  public getIcon(): string | undefined {
    return undefined;
  }

  public hasTextCursor(): boolean {
    return this.textCursor;
  }

  public setTextCursor(cursor: boolean): this {
    this.textCursor = cursor;
    return this;
  }
}
