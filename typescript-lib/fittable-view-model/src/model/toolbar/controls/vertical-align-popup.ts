import { getLanguageDictionary } from 'fittable-core/model';
import { Control, ControlArgs } from 'fittable-core/view-model';

import { FitSelectorWindow } from '../../common/controls/fit-selector-window.js';
import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { StyleCombo } from './common/style-combo.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';

export function createVerticalAlignPopup(args: ControlArgs): StyleCombo {
  return new VerticalAlignPopupBuilder(args).build();
}

class VerticalAlignPopupBuilder {
  private combo: StyleCombo;

  constructor(args: ControlArgs) {
    this.combo = new StyleCombo('place-items', args) //
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
      .setLabel((): string => getLanguageDictionary().getText('Align top'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('alignTop'));
    window.addControl('align-top', alignLeftControl);
    window.setControlId('align-top');
    const alignCenterControl: Control = new FitValueControl()
      .setLabel((): string => getLanguageDictionary().getText('Align middle'))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl('alignMiddle')
      )
      .setValue('center normal');
    window.addControl('align-middle', alignCenterControl);
    const alignRightControl: Control = new FitValueControl()
      .setLabel((): string => getLanguageDictionary().getText('Align bottom'))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl('alignBottom')
      )
      .setValue('end normal');
    window.addControl('align-bottom', alignRightControl);
  }
}
