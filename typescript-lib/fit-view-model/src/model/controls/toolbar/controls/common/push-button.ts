import { Control, ControlArgs } from 'fit-core/view-model/index.js';

import { FitImageId } from '../../../../image-registry/fit-image-registry.js';
import { FitTextKey } from '../../../../language-dictionary/language-dictionary-keys.js';
import { ControlType } from '../../../../common/view-model-utils.js';

export abstract class PushButton implements Control {
  protected abstract labelKey: FitTextKey;
  protected abstract iconPushedId: FitImageId;
  protected abstract iconPulledId: FitImageId;

  public constructor(protected readonly args: ControlArgs) {}

  public abstract getType(): ControlType | undefined;
  public abstract run(): void;
  protected abstract isPushed(): boolean;

  public getLabel(): string {
    return this.args.dictionary.getText(this.labelKey);
  }

  public getIcon(): string | undefined {
    return this.isPushed()
      ? this.args.imageRegistry.getImageUrl(this.iconPushedId)
      : this.args.imageRegistry.getImageUrl(this.iconPulledId);
  }

  public isValid(): boolean {
    return true;
  }
}
