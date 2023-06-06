import { Observable } from 'rxjs';

import { implementsTKeys } from '../../common/core-functions.js';
import { Value } from '../../model/table.js';
import { CellRange } from '../../model/cell-range.js';
import { OperationExecutor } from '../../operations/operation-core.js';
import { LanguageDictionary } from './language-dictionary.js';
import { ImageRegistry } from './image-registry.js';

export interface Control {
  getLabel(): string;
  getIcon(): string | undefined;
  getType(): string | undefined;
  isValid(): boolean;
  isDisabled(): boolean;
  run(): void;
}

export interface ValueControl extends Control {
  getValue(): Value | undefined;
  setValue(value?: Value): this;
  onSetValue$(): Observable<Value | undefined>;
}

export function asValueControl(control?: Control): ValueControl | undefined {
  return implementsTKeys<ValueControl>(control, ['getValue'])
    ? control
    : undefined;
}

export interface InputControl extends ValueControl {
  hasFocus(): boolean;
  setFocus(focus: boolean): this;
  onSetFocus$(): Observable<boolean>;
  scrollToEnd(): this;
  onScrollToEnd$(): Observable<void>;
  ctrlEnter(): this;
  onCtrlEnter$(): Observable<void>;
  hasTextCursor(): boolean;
  setTextCursor(cursor: boolean): this;
  onSetTextCursor$(): Observable<boolean>;
}

export function asInputControl(control?: Control): InputControl | undefined {
  return implementsTKeys<InputControl>(control, ['hasFocus'])
    ? control
    : undefined;
}

export interface CheckBoxControl extends Control {
  isChecked(): boolean;
  setChecked(checked: boolean): this;
}

export function asCheckBoxControl(
  control?: Control
): CheckBoxControl | undefined {
  return implementsTKeys<CheckBoxControl>(control, ['isChecked'])
    ? control
    : undefined;
}

export interface FocusableObject {
  hasFocus(): boolean;
  setFocus(focus: boolean, ignoreTrigger?: boolean): this;
  onAfterSetFocus$(): Observable<boolean>;
}
export type ControlMap = { [id: string]: Control };

export interface Container extends FocusableObject {
  setControls(controls: ControlMap): this;
  addControl(id: string, control: Control): this;
  getControlIds(): string[];
  getControl(id: string): Control;
  getControls(): Control[];
  removeControl(id: string): this;
  clearControls(): this;
}

export interface Coord {
  x: number;
  y: number;
}

export interface Window extends Container {
  setVisible(visible: boolean): this;
  isVisible(): boolean;
  setPosition(coord: Coord): this;
  getPosition(): Coord;
  getWidth(): number;
  setWidth(widthFn: () => number): this;
  getHeight(): number;
  setHeight(heightFn: () => number): this;
}

export interface PopupControl extends Control {
  getWindow(): Window;
  setSelectedControl(id: string): this;
  getSelectedControl(): string | undefined;
}

export function asPopupControl(control?: Control): PopupControl | undefined {
  return implementsTKeys<PopupControl>(control, ['getSelectedControl'])
    ? control
    : undefined;
}

export interface ControlArgs {
  operationExecutor: OperationExecutor;
  dictionary: LanguageDictionary;
  imageRegistry: ImageRegistry;
  getSelectedCells(): CellRange[];
}
