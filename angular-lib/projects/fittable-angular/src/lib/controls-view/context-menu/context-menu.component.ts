import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  HostListener,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { CssStyle, Value, createStyle4Dto } from 'fittable-core/model';
import {
  Control,
  InputControl,
  InputControlListener,
  PopupControl,
  Window,
  WindowListener,
  asInputControl,
  asPopupControl,
  createInputControlListener,
  createWindowListener,
  getImageRegistry,
} from 'fittable-core/view-model';

import {
  createToggleStyle,
  createWindowStyle,
} from '../common/style-functions.model';
import { ControlType } from '../common/control-type.model';
import { SvgImgComponent } from '../svg-img/svg-img.component';

@Component({
  selector: 'fit-context-menu',
  standalone: true,
  imports: [CommonModule, SvgImgComponent],
  templateUrl: './context-menu.component.html',
  styleUrls: ['../common/scss/utils.scss', './context-menu.component.scss'],
})
export class ContextMenuComponent implements OnInit, AfterViewInit {
  model = input.required<Window>();
  position = input<'absolute' | 'fixed'>('absolute');
  left = input<number | string>(0);
  top = input<number | string>(0);
  bottom = input<number | undefined>();
  right = input<number | undefined>();
  maxHeight = input<string | number>();
  inputWidth = input<string | number>();
  inputHeight = input<string | number | undefined>();
  iconCol = input<'left' | 'right'>('left');
  controlStyleFn = input<(control: Control) => CssStyle | null>();

  @ViewChild('menuWindow') menuWindowRef!: ElementRef;
  private windowListener!: WindowListener;
  private readonly inputListeners: Map<string, InputControlListener> =
    new Map();
  private isTextFieldMouseDown = false;
  private isSubMenu = false;

  ngOnInit(): void {
    this.windowListener = createWindowListener(this.model());
  }

  ngAfterViewInit(): void {
    const htmlMenu: HTMLElement = this.menuWindowRef.nativeElement;
    this.model() //
      .setSize({
        getWidth: (): number => htmlMenu.clientWidth,
        getHeight: (): number => htmlMenu.clientHeight,
      });
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.windowListener.onGlobalMouseDown();
  }

  onMouseEnter(): void {
    if (this.model().isVisible()) return;
    this.model().setVisible(true);
    this.isSubMenu = true;
  }

  onMouseLeave(): void {
    this.isSubMenu && this.model().setVisible(false);
  }

  getWindowStyle(): CssStyle {
    const style: CssStyle = createWindowStyle(this.model());
    style['position'] = this.position();
    style['left'] = this.left();
    style['top'] = this.top();
    if (this.right !== undefined) style['right'] = this.right();
    if (this.bottom !== undefined) style['bottom'] = this.bottom();
    if (this.maxHeight !== undefined) style['max-height'] = this.maxHeight();
    return style;
  }

  getControlIds(): string[] {
    return this.model().getControlIds();
  }

  getControl(id: string): Control {
    return this.model().getControl(id);
  }

  getControlType(id: string): ControlType {
    return this.getControl(id).getType() as ControlType;
  }

  getControlLabel(id: string): string {
    return this.getControl(id).getLabel();
  }

  getControlIcon(id: string): string | undefined {
    return this.getControl(id).getIcon();
  }

  hasControlIcon(id: string): boolean {
    return this.getControlIcon(id) !== undefined;
  }

  getControlStyle(id: string): CssStyle | null {
    const control: Control = this.getControl(id);
    let style: CssStyle | null = createToggleStyle(control);
    if (this.controlStyleFn) {
      if (!style) style = {};
      const controlStyleSignal = this.controlStyleFn();
      const controlStyle: CssStyle | null = controlStyleSignal ? controlStyleSignal(control) : null;
      if (controlStyle) {
        style = createStyle4Dto(style)
          .append(createStyle4Dto(controlStyle))
          .toCss();
      }
    }
    return style;
  }

  runControl(id: string): void {
    const control: Control = this.getControl(id);
    if (this.isTextFieldMouseDown) {
      this.isTextFieldMouseDown = false;
    } else if (!createToggleStyle(control)) {
      control.run();
    }
  }

  getArrowRightIcon(): string | undefined {
    return getImageRegistry().getUrl('arrowRight');
  }

  hasTextField(id: string): boolean {
    return this.getInputControl(id) !== undefined;
  }

  getTextFieldValue(id: string): Value | undefined {
    return this.getInputControl(id)?.getValue();
  }

  isTextFieldDisabled(id: string): boolean {
    return this.getInputControl(id)?.isDisabled() ?? false;
  }

  getTextFieldType(id: string): 'text' | 'number' {
    return typeof this.getTextFieldValue(id) === 'string' ? 'text' : 'number';
  }

  getTextFieldMin(id: string): number | null {
    return typeof this.getTextFieldValue(id) === 'string' ? null : 1;
  }

  onTextFieldMouseDown(): void {
    this.isTextFieldMouseDown = true;
  }

  onTextFieldInput(id: string, event: Event): void {
    this.getInputListener(id)?.onInput(event);
  }

  onTextFieldKeyDown(id: string, event: KeyboardEvent): void {
    this.getInputListener(id)?.onKeyDown(event);
    event.key === 'Enter' && this.model().setVisible(false);
  }

  onTextFieldFocusOut(id: string): void {
    this.getInputListener(id)?.onFocusOut();
  }

  getMenuItemWindow(id: string): Window {
    const popupControl: PopupControl | undefined = //
      asPopupControl(this.getControl(id));
    if (popupControl) return popupControl.getWindow();
    else throw new Error(`Invalid popup control for id '${id}'`);
  }

  onMenuItemMouseEnter(id: string, event: MouseEvent): void {
    const popupControl: PopupControl | undefined = //
      asPopupControl(this.getControl(id));
    if (!popupControl) {
      throw new Error(`Invalid popup control with id '${id}'.`);
    }
    const menuItem: HTMLElement = event.target as HTMLElement;
    const rect: DOMRect = menuItem.getBoundingClientRect();
    popupControl
      .getWindow()
      .setPosition({ x: rect.left + rect.width - 10, y: rect.top });
    createWindowListener(popupControl.getWindow()).onShow();
  }

  onMenuItemMouseLeave(id: string): void {
    asPopupControl(this.getControl(id))?.getWindow().setVisible(false);
  }

  private getInputListener(id: string): InputControlListener | undefined {
    let inputListener: InputControlListener | undefined =
      this.inputListeners.get(id);
    if (!inputListener) {
      const control: InputControl | undefined = this.getInputControl(id);
      if (control) {
        inputListener = createInputControlListener(control);
        this.inputListeners.set(id, inputListener);
      }
    }
    return inputListener;
  }

  private getInputControl(id: string): InputControl | undefined {
    const menuItem: InputControl | undefined = //
      asInputControl(this.getControl(id));
    return menuItem;
  }
}
