import {
  Control,
  ControlArgs,
  ValueControl,
  Window,
  asValueControl,
} from 'fittable-core/view-model';

import {
  BorderLocation,
  BorderStyle,
  BorderType,
  FitUIOperationArgs,
} from '../../operation-executor/operation-args.js';
import {
  FitTextKey,
  getLanguageDictionary,
} from '../../language/language-def.js';
import { FitControl } from '../../common/controls/fit-control.js';
import { FitPopupControl } from '../../common/controls/fit-popup-control.js';
import { FitValueControl } from '../../common/controls/fit-value-control.js';
import { FitImageId } from '../../image-registry/fit-image-ids.js';
import { FitSeparator } from '../../common/controls/fit-separator.js';
import { FitSelectorWindow } from '../../common/controls/fit-selector-window.js';
import { getImageRegistry } from '../../image-registry/fit-image-registry.js';
import { createColorControls } from './color-popup.js';

export function createBorderPopup(args: ControlArgs): FitPopupControl<string> {
  return new BorderPopupBuilder(args).build();
}

class BorderPopupBuilder {
  private readonly borderButton: FitPopupControl<string>;
  private readonly borderStyle: BorderStyle;

  constructor(private readonly args: ControlArgs) {
    const window: FitSelectorWindow<string> = new FitSelectorWindow();
    this.borderButton = new FitPopupControl<string>(window)
      .setType('border-popup-button')
      .setLabel((): string => getLanguageDictionary().getText('Borders'))
      .setIcon((): string | undefined => getImageRegistry().getUrl('borderAll'))
      .setRun((): void => {
        !this.borderButton.isDisabled() &&
          !window.isVisible() &&
          window.setVisible(true);
      });
    this.borderStyle = {
      location: 'around',
      type: 'solid',
      thickness: 1,
      color: '#000000',
    };
  }

  public build(): FitPopupControl<string> {
    const window: Window = this.borderButton.getWindow();
    window.addControl('border-type', this.createTypePopup());
    window.addControl('border-color', this.createColorPickerPopup());
    window.addControl('separator', new FitSeparator());
    const buttons: FitControl[] = this.createLocationButtons();
    for (const button of buttons) {
      window.addControl(button.getLabel(), button);
    }
    return this.borderButton;
  }

  private createTypePopup(): FitPopupControl<string> {
    const window: FitSelectorWindow<string> = new FitSelectorWindow();
    this.addTypeMenuItem(window, 'Solid 3px', 'solid 3');
    this.addTypeMenuItem(window, 'Solid 2px', 'solid 2');
    this.addTypeMenuItem(window, 'Solid 1px', 'solid 1');
    this.addTypeMenuItem(window, 'Dashed 1px', 'dashed 1');
    this.addTypeMenuItem(window, 'Dotted 1px', 'dotted 1');
    return new FitPopupControl<string>(window)
      .setType('popup-button')
      .setLabel((): string => getLanguageDictionary().getText('Border type'))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl('borderType')
      )
      .setRun((): void => {
        window.setVisible(true);
      });
  }

  private addTypeMenuItem(
    window: FitSelectorWindow<string>,
    label: string,
    value: string
  ): void {
    const control: FitValueControl = new FitValueControl()
      .setType('menu-item')
      .setLabel((): string => label)
      .setValue(value)
      .setRun((): void => {
        const parts: string[] = value.split(' ');
        this.borderStyle.type = parts[0] as BorderType;
        this.borderStyle.thickness = Number(parts[1]).valueOf();
        window.setVisible(false);
      });
    window.addControl(label, control);
  }

  private createColorPickerPopup(): FitPopupControl<string> {
    const window: FitSelectorWindow<string> = this.createFitSelectorWindow();
    createColorControls(window);
    return new FitPopupControl<string>(window)
      .setType('color-picker')
      .setLabel((): string => getLanguageDictionary().getText('Border color'))
      .setIcon((): string | undefined =>
        getImageRegistry().getUrl('borderColor')
      )
      .setRun((): void => {
        window.setVisible(true);
      });
  }

  private createFitSelectorWindow(): FitSelectorWindow<string> {
    const borderStyle: BorderStyle = this.borderStyle;
    return new (class extends FitSelectorWindow<string> {
      constructor() {
        super();
      }
      override addControl(id: string, control: Control): this {
        super.addControl(id, control);
        this.createRunFn(id, control);
        return this;
      }
      createRunFn(id: string, control: Control): void {
        const valueControl: ValueControl | undefined = asValueControl(control);
        if (!valueControl) {
          throw new Error(`Invalid value control for id '${id}'`);
        }
        valueControl.run = (): void => {
          borderStyle.color = valueControl.getValue()
            ? (valueControl.getValue() as string)
            : '#000000';
          this.setControlId(id);
          this.setVisible(false);
        };
      }
    })();
  }

  private createLocationButtons(): FitControl[] {
    return [
      this.createLocationButton('Clear borders', 'none', 'borderNone'),
      this.createLocationButton('Left borders', 'left', 'borderLeft'),
      this.createLocationButton('Horizontal borders', 'center', 'borderCenter'),
      this.createLocationButton('Right borders', 'right', 'borderRight'),
      this.createLocationButton('Top borders', 'top', 'borderTop'),
      this.createLocationButton('Vertical borders', 'middle', 'borderMiddle'),
      this.createLocationButton('Bottom borders', 'bottom', 'borderBottom'),
      this.createLocationButton('Inner borders', 'cross', 'borderCross'),
      this.createLocationButton('Outer borders', 'around', 'borderAround'),
      this.createLocationButton('All borders', 'all', 'borderAll'),
    ];
  }

  private createLocationButton(
    label: FitTextKey,
    value: BorderLocation,
    icon: FitImageId
  ): FitControl {
    return new FitValueControl()
      .setType('button')
      .setLabel((): string => getLanguageDictionary().getText(label))
      .setIcon((): string | undefined => getImageRegistry().getUrl(icon))
      .setValue(value)
      .setRun((): void => {
        this.borderStyle.location = value;
        const args: FitUIOperationArgs = {
          id: 'style-border',
          selectedCells: this.args.getSelectedCells(),
          borderStyle: this.borderStyle,
        };
        this.args.operationExecutor.run(args);
        this.borderButton.getWindow().setVisible(false);
      });
  }
}
