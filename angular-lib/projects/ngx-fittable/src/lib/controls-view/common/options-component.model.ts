import { HostListener, Injectable } from '@angular/core';

import { Value, CssStyle } from 'fit-core/model';
import {
  Control,
  OptionsControl,
  asOptionsControl,
  asValueControl,
  WindowListener,
} from 'fit-core/view-model';

import { ControlType } from './control-type.model';
import { createWindowStyle } from './style-functions.model';

@Injectable({ providedIn: 'root' })
export class OptionsComponent {
  public model!: OptionsControl;
  protected windowListener!: WindowListener;

  public getWindowStyle(): CssStyle {
    return createWindowStyle(this.model.getWindow());
  }

  public getControl(id: string): Control {
    return this.model.getWindow().getControl(id);
  }

  public getOptionsControl(id: string): OptionsControl {
    const control: Control = this.getControl(id);
    const options: OptionsControl | undefined = asOptionsControl(control);
    if (options) return options;
    else throw new Error('Invalid options control for id ' + id);
  }

  public getOptionIds(): string[] {
    return this.model.getWindow().getControlIds();
  }

  public showOptionsWindow(): void {
    if (this.model.isDisabled()) return;
    this.windowListener.onShow();
  }

  public getLabel(): string {
    return this.model.getLabel();
  }

  public getOptionLabel(id: string): string {
    return this.getControl(id).getLabel();
  }

  public getSelectedLabel(): string | undefined {
    return this.getSelectedControl()?.getLabel();
  }

  public getOptionValue(id: string): Value | undefined {
    return asValueControl(this.getControl(id))?.getValue();
  }

  public getSelectedValue(): Value | undefined {
    return asValueControl(this.getSelectedControl())?.getValue();
  }

  public getIcon(): string | undefined {
    return this.model.getIcon();
  }

  public getOptionIcon(id: string): string | undefined {
    return this.getControl(id).getIcon();
  }

  public getOptionType(id: string): ControlType | undefined {
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

  public runOption(id: string): void {
    this.getControl(id).run();
    this.model.setSelectedControl(id).run();
    this.hideOptionsWindow();
  }

  @HostListener('mousedown', ['$event']) onMouseDown(event: MouseEvent): void {
    this.windowListener.onMouseDown(event);
  }

  @HostListener('window:mousedown') onGlobalMouseDown(): void {
    this.hideOptionsWindow();
  }

  private hideOptionsWindow(): void {
    this.windowListener.onGlobalMouseDown();
  }
}
