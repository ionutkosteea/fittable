import { Observable, Subject } from 'rxjs';

import { implementsTKeys } from '../../common/core-functions.js';
import { Value } from '../../model/cell.js';
import { CellRange } from '../../model/cell-range.js';
import { getViewModelConfig } from '../view-model-config.js';
import { OperationExecutor, Id } from '../../operations/operation-core.js';
import { LanguageDictionary } from './language-dictionary.js';
import { ImageRegistry } from './image-registry.js';
import { TableScroller } from './table-scroller.js';
import { ThemeSwitcher } from './theme-switcher.js';
import { TableViewer } from './table-viewer.js';

export interface Control {
  getLabel(): string;
  getIcon(): string | undefined;
  getType(): string | undefined;
  isValid(): boolean;
  run(): void;
}

export interface ValueControl extends Control {
  forceValue$?: Subject<Value | undefined>;
  getValue(): Value | undefined;
  setValue(value?: Value): this;
}

export function asValueControl(control?: Control): ValueControl | undefined {
  return implementsTKeys<ValueControl>(control, ['getValue'])
    ? control
    : undefined;
}

export interface InputControl extends ValueControl {
  focus$: Subject<boolean>;
  scrollToEnd$?: Subject<void>;
  ctrlEnter$?: Subject<void>;
  hasTextCursor(): boolean;
  setTextCursor(visible: boolean): this;
}

export function asInputControl(control?: Control): InputControl | undefined {
  return implementsTKeys<InputControl>(control, ['focus$'])
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

export interface OptionsControl extends Control {
  getWindow(): Window;
  setSelectedControl(id: string): this;
  getSelectedControl(): string | undefined;
}

export function asOptionsControl(
  control?: Control
): OptionsControl | undefined {
  return implementsTKeys<OptionsControl>(control, ['getSelectedControl'])
    ? control
    : undefined;
}

export interface ControlArgs {
  executor: OperationExecutor<Id<string>, string>;
  dictionary: LanguageDictionary<string, string>;
  imageRegistry: ImageRegistry<string>;
  getSelectedCells(): CellRange[];
}

export interface ContextMenuFactory {
  createContextMenu(args: ControlArgs): Window;
}

export function createContextMenu(args: ControlArgs): Window {
  const factory: ContextMenuFactory | undefined =
    getViewModelConfig().contextMenuFactory;
  if (factory) return factory.createContextMenu(args);
  else throw new Error('ContextMenuFactory is not defined!');
}

export interface ToolbarFactory {
  createToolbar(args: ControlArgs): Container;
}

export function createToolbar(args: ControlArgs): Container {
  const factory: ToolbarFactory | undefined =
    getViewModelConfig().toolbarFactory;
  if (factory) return factory.createToolbar(args);
  else throw new Error('ToolbarFactory is not defined!');
}

export interface Statusbar extends FocusableObject {
  getText(): string;
}

export type StatusbarArgs = {
  dictionary: LanguageDictionary<string, string>;
  tableViewer: TableViewer;
  tableScroller: TableScroller;
};

export interface StatusbarFactory {
  createStatusbar(args: StatusbarArgs): Statusbar;
}

export function createStatusbar(args: StatusbarArgs): Statusbar {
  const factory: StatusbarFactory | undefined =
    getViewModelConfig().statusbarFactory;
  if (factory) return factory.createStatusbar(args);
  else throw new Error('StatusbarFactory is not defined!');
}

export type SettingsBarArgs = {
  dictionary: LanguageDictionary<string, string>;
  imageRegistry: ImageRegistry<string>;
  themeSwitcher?: ThemeSwitcher<string>;
};

export interface SettingsBarFactory {
  createSettingsBar(args: SettingsBarArgs): Container;
}

export function createSettingsBar(args: SettingsBarArgs): Container {
  const factory: SettingsBarFactory | undefined =
    getViewModelConfig().settingsBarFactory;
  if (factory) return factory.createSettingsBar(args);
  else throw new Error('SettingsBarFactory is not defined!');
}
