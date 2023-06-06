import { HostListener, Injectable } from '@angular/core';

import { Value, CssStyle } from 'fittable-core/model';
import {
  Control,
  PopupControl,
  asPopupControl,
  asValueControl,
  WindowListener,
} from 'fittable-core/view-model';

import { ControlType } from './control-type.model';
import { createWindowStyle } from './style-functions.model';

@Injectable({ providedIn: 'root' })
export abstract class PopupControlComponent {
  public abstract model: PopupControl;
  public abstract windowListener: WindowListener;

  public getWindowStyle(): CssStyle {
    return createWindowStyle(this.model.getWindow());
  }

  public getControl(id: string): Control {
    return this.model.getWindow().getControl(id);
  }

  public getPopupControl(id: string): PopupControl {
    const control: Control = this.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error('Invalid popup control for id ' + id);
  }

  public getPopupIds(): string[] {
    return this.model.getWindow().getControlIds();
  }

  public showPopupWindow(): void {
    if (this.model.isDisabled()) return;
    this.windowListener.onShow();
  }

  public getLabel(): string {
    return this.model.getLabel();
  }

  public getPopupLabel(id: string): string {
    return this.getControl(id).getLabel();
  }

  public getSelectedLabel(): string | undefined {
    return this.getSelectedControl()?.getLabel();
  }

  public getPopupValue(id: string): Value | undefined {
    return asValueControl(this.getControl(id))?.getValue();
  }

  public getSelectedValue(): Value | undefined {
    return asValueControl(this.getSelectedControl())?.getValue();
  }

  public getIcon(): string | undefined {
    return this.model.getIcon();
  }

  public getPopupIcon(id: string): string | undefined {
    return this.getControl(id).getIcon();
  }

  public getPopupType(id: string): ControlType | undefined {
    return this.getControl(id).getType() as ControlType;
  }

  public getSelectedIcon(): string | undefined {
    return this.getSelectedControl()?.getIcon();
  }

  public getSelectedControl(): Control | undefined {
    let id: string | undefined = this.model.getSelectedControl();
    if (!id) id = this.model.getWindow().getControlIds()[0];
    return id ? this.getControl(id) : undefined;
  }

  public runPopup(id: string): void {
    this.getControl(id).run();
    this.model.setSelectedControl(id).run();
    this.hidePopupWindow();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.hidePopupWindow();
  }

  private hidePopupWindow(): void {
    this.windowListener.onGlobalMouseDown();
  }
}
