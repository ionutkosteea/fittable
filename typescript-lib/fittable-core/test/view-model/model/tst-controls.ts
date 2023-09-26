import { Observable } from 'rxjs';

import { Value } from '../../../dist/model/index.js';
import {
  Control,
  Coord,
  InputControl,
  Size,
  Window,
} from '../../../dist/view-model/index.js';

export class TstWindow implements Window {
  setVisible(visible: boolean): this {
    throw new Error('Method not implemented.');
  }
  isVisible(): boolean {
    throw new Error('Method not implemented.');
  }
  setPosition(coord: Coord): this {
    throw new Error('Method not implemented.');
  }
  getPosition(): Coord {
    throw new Error('Method not implemented.');
  }
  setSize(size?: Size | undefined): this {
    throw new Error('Method not implemented.');
  }
  getSize(): Size | undefined {
    throw new Error('Method not implemented.');
  }
  setControls(controls: Map<string, Control>): this {
    throw new Error('Method not implemented.');
  }
  addControl(id: string, control: Control): this {
    throw new Error('Method not implemented.');
  }
  getControlIds(): string[] {
    throw new Error('Method not implemented.');
  }
  getControl(id: string): Control {
    throw new Error('Method not implemented.');
  }
  getControls(): Control[] {
    throw new Error('Method not implemented.');
  }
  removeControl(id: string): this {
    throw new Error('Method not implemented.');
  }
  clearControls(): this {
    throw new Error('Method not implemented.');
  }
  hasFocus(): boolean {
    throw new Error('Method not implemented.');
  }
  setFocus(focus: boolean, ignoreTrigger?: boolean | undefined): this {
    throw new Error('Method not implemented.');
  }
  onAfterSetFocus$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
}

export class TstInputControl implements InputControl {
  hasFocus(): boolean {
    throw new Error('Method not implemented.');
  }
  setFocus(focus: boolean): this {
    throw new Error('Method not implemented.');
  }
  onSetFocus$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  scrollToEnd(): this {
    throw new Error('Method not implemented.');
  }
  onScrollToEnd$(): Observable<void> {
    throw new Error('Method not implemented.');
  }
  ctrlEnter(): this {
    throw new Error('Method not implemented.');
  }
  onCtrlEnter$(): Observable<void> {
    throw new Error('Method not implemented.');
  }
  hasTextCursor(): boolean {
    throw new Error('Method not implemented.');
  }
  setTextCursor(cursor: boolean): this {
    throw new Error('Method not implemented.');
  }
  onSetTextCursor$(): Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  getValue(): Value | undefined {
    throw new Error('Method not implemented.');
  }
  setValue(value?: Value | undefined): this {
    throw new Error('Method not implemented.');
  }
  onSetValue$(): Observable<Value | undefined> {
    throw new Error('Method not implemented.');
  }
  getLabel(): string {
    throw new Error('Method not implemented.');
  }
  getIcon(): string | undefined {
    throw new Error('Method not implemented.');
  }
  getType(): string | undefined {
    throw new Error('Method not implemented.');
  }
  isValid(): boolean {
    throw new Error('Method not implemented.');
  }
  isDisabled(): boolean {
    throw new Error('Method not implemented.');
  }
  run(): void {
    throw new Error('Method not implemented.');
  }
}
