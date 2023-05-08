import { Control } from 'fittable-core/view-model';

export class FitSeparator implements Control {
  public readonly getLabel = (): string => 'Separator';
  public readonly getType = (): string => 'separator';
  public readonly isValid = (): boolean => true;
  public readonly getIcon = (): undefined => undefined;
  public readonly isDisabled = (): boolean => false;

  public run(): void {
    throw new Error('Method not implemented.');
  }
}
