import { asTableStyles } from 'fittable-core/model';
import { Container, ToolbarFactory } from 'fittable-core/view-model';

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
  createColorMenu,
  createBackgroundColorMenu,
} from './controls/color-menus.js';
import { createVerticalAlignMenu } from './controls/vertical-align-menu.js';
import { createHorizontalAlignMenu } from './controls/horizontal-align-menu.js';
import { createBorderMenu } from './controls/border-menu.js';
import { FitControlArgs } from './controls/common/fit-control-args.js';

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
  | `${'separator'}${string}`;

export class FitToolbarFactory implements ToolbarFactory {
  public createToolbar(args: FitControlArgs): Container {
    const toolbar: FitContainer<FitToolbarControlId> = new FitContainer();
    toolbar
      .addControl('undo', createUndoButton(args))
      .addControl('redo', createRedoButton(args))
      .addControl('separator1', new FitSeparator());
    const isStyledTable: boolean =
      asTableStyles(args.operationExecutor.getTable()) !== undefined;
    const hasCellSelection: boolean = args.getSelectedCells().length > 0;
    if (isStyledTable && hasCellSelection) {
      this.addStyleUpdateControls(toolbar, args);
    }
    return toolbar;
  }

  private addStyleUpdateControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: FitControlArgs
  ): void {
    toolbar
      .addControl('paint-format', createPaintFormatButton(args))
      .addControl('separator2', new FitSeparator())
      .addControl('bold', createBoldButton(args))
      .addControl('italic', createItalicButton(args))
      .addControl('underline', createUnderlineButton(args))
      .addControl('strike', createStrikeButton(args))
      .addControl('separator3', new FitSeparator())
      .addControl('font-family', createFontFamilyCombo(args))
      .addControl('font-size', createFontSizeInput(args))
      .addControl('separator4', new FitSeparator())
      .addControl('color', createColorMenu(args))
      .addControl('background-color', createBackgroundColorMenu(args))
      .addControl('separator5', new FitSeparator())
      .addControl('vertical-align', createVerticalAlignMenu(args))
      .addControl('horizontal-align', createHorizontalAlignMenu(args))
      .addControl('separator6', new FitSeparator())
      .addControl('border', createBorderMenu(args));
  }
}
