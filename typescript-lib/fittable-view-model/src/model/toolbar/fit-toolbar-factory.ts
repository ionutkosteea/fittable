import { asTableCellDataType, asTableStyles } from 'fittable-core/model';
import {
  Container,
  ControlArgs,
  ToolbarFactory,
} from 'fittable-core/view-model';

import { FitSeparator } from '../common/controls/fit-separator.js';
import { FitContainer } from '../common/controls/fit-container.js';
import {
  createUndoButton,
  createRedoButton,
} from './controls/undo-redo-buttons.js';
import { createPaintFormatButton } from './controls/paint-format-button.js';
import {
  createBoldButton,
  createItalicButton,
  createUnderlineButton,
  createStrikeButton,
} from './controls/font-style-buttons.js';
import { createFontFamilyCombo } from './controls/font-family-combo.js';
import { createFontSizeInput } from './controls/font-size-input.js';
import {
  createColorPopup,
  createBackgroundColorPopup,
} from './controls/color-popup.js';
import { createVerticalAlignPopup } from './controls/vertical-align-popup.js';
import { createHorizontalAlignPopup } from './controls/horizontal-align-popup.js';
import { createBorderPopup } from './controls/border-popup.js';
import { createDataTypePopup } from './controls/data-type-popup.js';

export type FitToolbarControlId =
  | 'undo'
  | 'redo'
  | 'paint-format'
  | 'bold'
  | 'italic'
  | 'underline'
  | 'strike'
  | 'font-family'
  | 'font-size'
  | 'color'
  | 'background-color'
  | 'vertical-align'
  | 'horizontal-align'
  | 'border'
  | 'format'
  | `${'separator'}${string}`;

export class FitToolbarFactory implements ToolbarFactory {
  public createToolbar(args: ControlArgs): Container {
    const toolbar: FitContainer<FitToolbarControlId> = new FitContainer();
    toolbar
      .addControl('undo', createUndoButton(args))
      .addControl('redo', createRedoButton(args))
      .addControl('separator1', new FitSeparator());
    const hasCellSelection: boolean = args.getSelectedCells().length > 0;
    const isStyledTable: boolean =
      asTableStyles(args.operationExecutor.getTable()) !== undefined;
    const isDataTypeTable: boolean =
      asTableCellDataType(args.operationExecutor.getTable()) !== undefined;
    if (hasCellSelection) {
      isStyledTable && this.addStyleUpdateControls(toolbar, args);
      isDataTypeTable && this.addDataTypeUpdateControls(toolbar, args);
    }
    return toolbar;
  }

  private addStyleUpdateControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: ControlArgs
  ): void {
    toolbar
      .addControl('paint-format', createPaintFormatButton(args))
      .addControl('separator2', new FitSeparator())
      .addControl('bold', createBoldButton(args))
      .addControl('italic', createItalicButton(args))
      .addControl('underline', createUnderlineButton(args))
      .addControl('strike', createStrikeButton(args))
      .addControl('font-family', createFontFamilyCombo(args))
      .addControl('font-size', createFontSizeInput(args))
      .addControl('color', createColorPopup(args))
      .addControl('background-color', createBackgroundColorPopup(args))
      .addControl('vertical-align', createVerticalAlignPopup(args))
      .addControl('horizontal-align', createHorizontalAlignPopup(args))
      .addControl('border', createBorderPopup(args))
      .addControl('separator7', new FitSeparator());
  }

  private addDataTypeUpdateControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: ControlArgs
  ): void {
    toolbar.addControl('format', createDataTypePopup(args));
  }
}
