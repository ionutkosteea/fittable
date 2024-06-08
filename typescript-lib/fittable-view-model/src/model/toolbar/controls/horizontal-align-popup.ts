import { Control, ControlArgs } from 'fittable-core/view-model';

import { FitSelectorWindow } from '../../common/controls/fit-selector-window.js';
import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { getLanguageDictionary } from '../../language/language-def.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';
import { StyleCombo } from './common/style-combo.js';

export function createHorizontalAlignPopup(args: ControlArgs): StyleCombo {
  return new HorizontalAlignPopupBuilder(args).build();
}

class HorizontalAlignPopupBuilder {
  private combo: StyleCombo;

  constructor(args: ControlArgs) {
    this.combo = new StyleCombo('text-align', args) //
      .setChangeSelectionIcon(true);
  }

  public build(): StyleCombo {
    this.initCombo();
    this.createControls();
    return this.combo;
  }

  private initCombo(): void {
    this.combo
      .setType('popup-button')
      .setLabel((): string => {
        return this.combo.getWindow().getSelectedControl()?.getLabel() ?? '';
      })
      .setIcon((): string | undefined => {
        return this.combo.getWindow().getSelectedControl()?.getIcon();
      })
      .setRun((): void => {
        !this.combo.isDisabled() &&
          !this.combo.getWindow().isVisible() &&
          this.combo.getWindow().setVisible(true);
      });
  }

  private createControls(): void {
    const window: FitSelectorWindow<string> = this.combo.getWindow();
    const alignLeftControl: Control = new FitValueControl()
      .setLabel((): string => getLanguageDictionary().getText('Align left'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('alignLeft'))
      .setValue('left');
    window.addControl('align-left', alignLeftControl);
    window.setControlId('align-left');
    const alignCenterControl: Control = new FitValueControl()
      .setLabel((): string => getLanguageDictionary().getText('Align center'))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl('alignCenter')
      )
      .setValue('center');
    window.addControl('align-center', alignCenterControl);
    const alignRightControl: Control = new FitValueControl()
      .setLabel((): string => getLanguageDictionary().getText('Align right'))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl('alignRight')
      )
      .setValue('right');
    window.addControl('align-right', alignRightControl);
  }
}
