import { Observable } from 'rxjs';

import { implementsTKeys } from '../../common/core-functions.js';
import { Value } from '../../model/table/table.js';
import { CellRange } from '../../model/table/cell-range.js';
import { OperationExecutor } from '../../operations/operation-core.js';

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

export interface ToggleControl extends Control {
  isOn(): boolean;
  setOn(on: boolean): this;
}

export function asToggleControl(control?: Control): ToggleControl | undefined {
  return implementsTKeys<ToggleControl>(control, ['isOn'])
    ? control
    : undefined;
}

export interface FocusableObject {
  hasFocus(): boolean;
  setFocus(focus: boolean, ignoreTrigger?: boolean): this;
  onAfterSetFocus$(): Observable<boolean>;
}

export interface Container extends FocusableObject {
  setControls(controls: Map<string, Control>): this;
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

export interface Size {
  getWidth: () => number;
  getHeight: () => number;
}

export interface Window extends Container {
  isVisible(): boolean;
  setVisible(visible: boolean): this;
  getPosition(): Coord | undefined;
  setPosition(coord: Coord): this;
  getSize(): Size | undefined;
  setSize(size?: Size): this;
}

export interface SelectorWindow extends Window {
  setControlId(id?: string): this;
  getControlId(): string | undefined;
}

export function asSelectorWindow(window?: Window): SelectorWindow | undefined {
  return implementsTKeys<SelectorWindow>(window, ['getControlId'])
    ? window
    : undefined;
}

export interface PopupControl extends Control {
  getWindow(): Window;
}

export function asPopupControl(control?: Control): PopupControl | undefined {
  return implementsTKeys<PopupControl>(control, ['getWindow'])
    ? control
    : undefined;
}

export interface ControlArgs {
  operationExecutor: OperationExecutor;
  getSelectedCells(): CellRange[];
}
