import { HostListener, Injectable } from '@angular/core';

import { CssStyle } from 'fittable-core/model';
import {
  Control,
  PopupControl,
  asPopupControl,
  Window,
  WindowListener,
  createWindowListener,
} from 'fittable-core/view-model';

import { createWindowStyle } from './style-functions.model';
import { ControlType } from './control-type.model';

@Injectable({ providedIn: 'root' })
export abstract class WindowComponent {
  public abstract getWindow(): Window;

  private windowListener!: WindowListener;

  public init(): void {
    this.windowListener = createWindowListener(this.getWindow());
  }

  public getWindowStyle(): CssStyle {
    return createWindowStyle(this.getWindow());
  }

  public getControlIds(): string[] {
    return this.getWindow().getControlIds();
  }

  public getControl(id: string): Control {
    return this.getWindow().getControl(id);
  }

  public getPopupControl(id: string): PopupControl {
    const control: Control = this.getControl(id);
    const popup: PopupControl | undefined = asPopupControl(control);
    if (popup) return popup;
    else throw new Error(`Invalid popup control for id '${id}'`);
  }

  public getControlType(id: string): ControlType {
    return this.getControl(id).getType() as ControlType;
  }

  public getControlLabel(id: string): string {
    return this.getControl(id).getLabel();
  }

  public getControlIcon(id: string): string | undefined {
    return this.getControl(id).getIcon();
  }

  public runControl(id: string): void {
    this.getControl(id).run();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.hideWindow();
  }

  public hideWindow(): void {
    this.windowListener.onGlobalMouseDown();
  }
}
