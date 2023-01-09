import {
  ControlArgs,
  Window,
  ValueControl,
} from 'fit-core/view-model/index.js';

import {
  BorderLocation,
  BorderStyle,
  BorderType,
  FitOperationArgs,
} from '../../../operation-executor/operation-args.js';
import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { FitControl } from '../../../common/controls/fit-control.js';
import { FitOptionsControl } from '../../../common/controls/fit-options-control.js';
import { FitWindow } from '../../../common/controls/fit-window.js';
import { createSeparator } from '../../../common/view-model-utils.js';
import { FitValueControl } from '../../../common/controls/fit-value-control.js';
import {
  colorControls,
  createColorControls,
  setColorControls,
} from './color-menus.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';

export class BorderMenuBuilder {
  private readonly borderButton: FitOptionsControl;
  private readonly borderStyle: BorderStyle;

  constructor(private readonly args: ControlArgs) {
    this.borderButton = new FitOptionsControl(new FitWindow()) //
      .setType('border-pop-up-button');
    this.borderStyle = {
      location: 'around',
      type: 'solid',
      thickness: 1,
      color: '#000000',
    };
  }

  public build(): FitOptionsControl {
    const window: Window = this.borderButton.getWindow();
    window.addControl('border-type', this.createTypeMenu());
    window.addControl('border-color', this.createColorPickerMenu());
    window.addControl('separator', createSeparator());
    const buttons: FitControl[] = this.createLocationButtons();
    for (const button of buttons) {
      window.addControl(button.getLabel(), button);
    }
    return this.borderButton;
  }

  private createTypeMenu(): FitOptionsControl {
    const window: FitWindow<string> = new FitWindow()
      .addControl('solid-3', this.createTypeMenuItem('Solid 3px', 'solid 3'))
      .addControl('solid-2', this.createTypeMenuItem('Solid 2px', 'solid 2'))
      .addControl('solid-1', this.createTypeMenuItem('Solid 1px', 'solid 1'))
      .addControl('dashed-1', this.createTypeMenuItem('Dashed 1px', 'dashed 1'))
      .addControl(
        'dotted-1',
        this.createTypeMenuItem('Dotted 1px', 'dotted 1')
      );
    return new FitOptionsControl(window)
      .setType('pop-up-button')
      .setLabel(() => 'solid')
      .setIcon((): string | undefined => this.getImageUrl('borderType'));
  }

  private createTypeMenuItem(label: string, value: string): FitControl {
    return new FitValueControl()
      .setType('menu-item')
      .setLabel((): string => label)
      .setValue(value)
      .setRun((): void => {
        const parts: string[] = value.split(' ');
        this.borderStyle.type = parts[0] as BorderType;
        const numberValue: Number = new Number(parts[1]);
        this.borderStyle.thickness = numberValue.valueOf();
      });
  }

  private createColorPickerMenu(): FitOptionsControl {
    if (Object.keys(colorControls).length <= 0) {
      setColorControls(createColorControls(this.getText, this.getImageUrl));
    }
    const window: FitWindow<string> = new FitWindow();
    window.setControls(colorControls);
    const optionsControl: FitOptionsControl = new FitOptionsControl(window)
      .setType('color-picker')
      .setLabel(() => 'Colors')
      .setIcon((): string | undefined => this.getImageUrl('borderColor'));
    optionsControl.setRun((): void => {
      const id: string = '' + optionsControl.getSelectedControl();
      const control: ValueControl = optionsControl
        .getWindow()
        .getControl(id) as ValueControl;
      this.borderStyle.color = control.getValue()
        ? (control.getValue() as string)
        : '#000000';
    });
    return optionsControl;
  }

  private createLocationButtons(): FitControl[] {
    return [
      this.createLocationButton('None', 'none', 'borderNone'),
      this.createLocationButton('Left', 'left', 'borderLeft'),
      this.createLocationButton('Center', 'center', 'borderCenter'),
      this.createLocationButton('Right', 'right', 'borderRight'),
      this.createLocationButton('Top', 'top', 'borderTop'),
      this.createLocationButton('Middle', 'middle', 'borderMiddle'),
      this.createLocationButton('Bottom', 'bottom', 'borderBottom'),
      this.createLocationButton('Cross', 'cross', 'borderCross'),
      this.createLocationButton('Around', 'around', 'borderAround'),
      this.createLocationButton('All', 'all', 'borderAll'),
    ];
  }

  private createLocationButton(
    label: string,
    value: BorderLocation,
    icon: FitImageId
  ): FitControl {
    return new FitValueControl()
      .setType('push-button')
      .setLabel((): string => label)
      .setIcon((): string | undefined => this.getImageUrl(icon))
      .setValue(value)
      .setRun((): void => {
        this.borderStyle.location = value;
        const args: FitOperationArgs = {
          id: 'style-border',
          selectedCells: this.args.getSelectedCells(),
          borderStyle: this.borderStyle,
        };
        this.args.executor.run(args);
      });
  }

  private readonly getText = (textKey: FitTextKey): string =>
    this.args.dictionary.getText(textKey);

  private readonly getImageUrl = (imageId: FitImageId): string | undefined =>
    this.args.imageRegistry.getImageUrl(imageId);
}
