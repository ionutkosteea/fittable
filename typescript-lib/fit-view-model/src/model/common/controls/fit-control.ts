import { Control } from 'fit-core/view-model/index.js';

import { ControlType } from '../view-model-utils.js';

export class FitControl implements Control {
  private labelFn!: () => string;
  private iconFn?: () => string | undefined;
  private type?: ControlType;
  private isValidFn?: () => boolean;
  private runFn?: () => void;

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

  public getType(): ControlType | undefined {
    return this.type;
  }

  public setType(type?: ControlType): this {
    this.type = type;
    return this;
  }

  public isValid(): boolean {
    return this.isValidFn ? this.isValidFn() : true;
  }

  public setIsValidFn(isValidFn: () => boolean): this {
    this.isValidFn = isValidFn;
    return this;
  }

  public run(): void {
    if (this.isValid()) this.runFn && this.runFn();
    else throw new Error('Control is not valid!');
  }

  public setRun(runFn?: () => void): this {
    this.runFn = runFn;
    return this;
  }
}
