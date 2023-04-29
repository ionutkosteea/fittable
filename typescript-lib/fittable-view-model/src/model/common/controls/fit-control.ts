import { Control } from 'fittable-core/view-model/index.js';

import { FitControlType } from './fit-control-type.js';

export class FitControl implements Control {
  private labelFn!: () => string;
  private iconFn?: () => string | undefined;
  private type?: FitControlType;
  private validFn?: () => boolean;
  private runFn?: () => void;
  private disabled = false;

  public getLabel(): string {
    return this.labelFn();
  }

  public setLabel(labelFn: () => string): this {
    this.labelFn = labelFn;
    return this;
  }

  public getIcon(): string | undefined {
    return this.iconFn && this.iconFn();
  }

  public setIcon(iconFn: () => string | undefined): this {
    this.iconFn = iconFn;
    return this;
  }

  public getType(): FitControlType | undefined {
    return this.type;
  }

  public setType(type?: FitControlType): this {
    this.type = type;
    return this;
  }

  public isValid(): boolean {
    return this.validFn ? this.validFn() : true;
  }

  public setValid(validFn: () => boolean): this {
    this.validFn = validFn;
    return this;
  }

  public isDisabled(): boolean {
    return this.disabled;
  }

  public setDisabled(disabled: boolean): this {
    this.disabled = disabled;
    return this;
  }

  public run(): void {
    this.runFn && this.runFn();
  }

  public setRun(runFn?: () => void): this {
    this.runFn = runFn;
    return this;
  }
}
