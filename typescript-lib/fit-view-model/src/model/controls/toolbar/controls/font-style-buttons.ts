import { createStyle, Style } from 'fit-core/model/index.js';

import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { ControlType } from '../../../common/view-model-utils.js';
import { StylePushButton } from './common/style-push-button.js';

export class BoldButton extends StylePushButton {
  protected readonly labelKey: FitTextKey = 'Bold';
  protected readonly iconPushedId: FitImageId = 'boldBlue';
  protected readonly iconPulledId: FitImageId = 'bold';
  protected readonly style: Style = createStyle().set('font-weight', 'bold');

  public getType(): ControlType {
    return 'push-button';
  }
}

export class ItalicButton extends StylePushButton {
  protected readonly labelKey: FitTextKey = 'Italic';
  protected readonly iconPushedId: FitImageId = 'italicBlue';
  protected readonly iconPulledId: FitImageId = 'italic';
  protected readonly style: Style = createStyle().set('font-style', 'italic');

  public getType(): ControlType {
    return 'push-button';
  }
}

export class UnderlineButton extends StylePushButton {
  protected readonly labelKey: FitTextKey = 'Underline';
  protected readonly iconPushedId: FitImageId = 'underlineBlue';
  protected readonly iconPulledId: FitImageId = 'underline';
  protected readonly style: Style = createStyle().set(
    'text-decoration',
    'underline'
  );

  public getType(): ControlType {
    return 'push-button';
  }
}

export class StrikeButton extends StylePushButton {
  protected readonly labelKey: FitTextKey = 'Strike';
  protected readonly iconPushedId: FitImageId = 'strikeBlue';
  protected readonly iconPulledId: FitImageId = 'strike';
  protected readonly style: Style = createStyle().set(
    'text-decoration',
    'line-through'
  );

  public getType(): ControlType {
    return 'push-button';
  }
}
