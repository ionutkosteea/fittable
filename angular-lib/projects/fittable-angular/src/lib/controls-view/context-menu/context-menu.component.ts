import {
  Component,
  ElementRef,
  Input,
  AfterViewInit,
  ViewChild,
  OnInit,
} from '@angular/core';

import { CssStyle, Value, createStyle4Dto } from 'fittable-core/model';
import {
  Control,
  InputControl,
  InputControlListener,
  PopupControl,
  Window,
  asInputControl,
  asPopupControl,
  createInputControlListener,
  createWindowListener,
  getImageRegistry,
} from 'fittable-core/view-model';

import { WindowComponent } from '../common/window-component.model';
import { createToggleStyle } from '../common/style-functions.model';

@Component({
  selector: 'fit-context-menu',
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent
  extends WindowComponent
  implements OnInit, AfterViewInit
{
  @Input('model') window!: Window;
  @Input() position: 'absolute' | 'fixed' = 'absolute';
  @Input() left: number | string = 0;
  @Input() top: number | string = 0;
  @Input() bottom?: number | string;
  @Input() right?: number | string;
  @Input() maxHeight?: number | string;
  @Input() inputWidth?: number | string;
  @Input() inputHeight?: number | string;
  @Input() iconCol: 'left' | 'right' = 'left';
  @Input() controlStyleFn?: (control: Control) => CssStyle | null;

  @ViewChild('menuWindow') menuWindowRef!: ElementRef;

  private readonly inputListeners: Map<string, InputControlListener> =
    new Map();
  private isTextFieldMouseDown = false;
  private isSubMenu = false;

  public ngOnInit(): void {
    this.init();
  }

  public ngAfterViewInit(): void {
    const htmlMenu: HTMLElement = this.menuWindowRef.nativeElement;
    this.window //
      .setSize({
        getWidth: (): number => htmlMenu.clientWidth,
        getHeight: (): number => htmlMenu.clientHeight,
      });
  }

  public override getWindow(): Window {
    return this.window;
  }

  public onMouseEnter(): void {
    if (this.getWindow().isVisible()) return;
    this.getWindow().setVisible(true);
    this.isSubMenu = true;
  }

  public onMouseLeave(): void {
    this.isSubMenu && this.getWindow().setVisible(false);
  }

  public override getWindowStyle(): CssStyle {
    const style: CssStyle = super.getWindowStyle();
    style['position'] = this.position;
    style['left'] = this.left;
    style['top'] = this.top;
    if (this.right !== undefined) style['right'] = this.right;
    if (this.bottom !== undefined) style['bottom'] = this.bottom;
    if (this.maxHeight !== undefined) style['max-height'] = this.maxHeight;
    return style;
  }

  public hasControlIcon(id: string): boolean {
    return this.getControlIcon(id) !== undefined;
  }

  public getControlStyle(id: string): CssStyle | null {
    const control: Control = this.getControl(id);
    let style: CssStyle | null = createToggleStyle(control);
    if (this.controlStyleFn) {
      if (!style) style = {};
      const controlStyle: CssStyle | null = this.controlStyleFn(control);
      if (controlStyle) {
        style = createStyle4Dto(style)
          .append(createStyle4Dto(controlStyle))
          .toCss();
      }
    }
    return style;
  }

  public override runControl(id: string): void {
    const control: Control = this.getControl(id);
    if (this.isTextFieldMouseDown) {
      this.isTextFieldMouseDown = false;
    } else if (!createToggleStyle(control)) {
      control.run();
    }
  }

  public getArrowRightIcon(): string | undefined {
    return getImageRegistry().getUrl('arrowRight');
  }

  public hasTextField(id: string): boolean {
    return this.getInputControl(id) !== undefined;
  }

  public getTextFieldValue(id: string): Value | undefined {
    return this.getInputControl(id)?.getValue();
  }

  public isTextFieldDisabled(id: string): boolean {
    return this.getInputControl(id)?.isDisabled() ?? false;
  }

  public getTextFieldType(id: string): 'text' | 'number' {
    return typeof this.getTextFieldValue(id) === 'string' ? 'text' : 'number';
  }

  public getTextFieldMin(id: string): number | null {
    return typeof this.getTextFieldValue(id) === 'string' ? null : 1;
  }

  public onTextFieldMouseDown(): void {
    this.isTextFieldMouseDown = true;
  }

  public onTextFieldInput(id: string, event: Event): void {
    this.getInputListener(id)?.onInput(event);
  }

  public onTextFieldKeyDown(id: string, event: KeyboardEvent): void {
    this.getInputListener(id)?.onKeyDown(event);
    event.key === 'Enter' && this.window.setVisible(false);
  }

  public onTextFieldFocusOut(id: string): void {
    this.getInputListener(id)?.onFocusOut();
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

  public getMenuItemWindow(id: string): Window {
    return this.getPopupControl(id).getWindow();
  }

  public onMenuItemMouseEnter(id: string, event: MouseEvent): void {
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

  public onMenuItemMouseLeave(id: string): void {
    asPopupControl(this.getControl(id))?.getWindow().setVisible(false);
  }
}
