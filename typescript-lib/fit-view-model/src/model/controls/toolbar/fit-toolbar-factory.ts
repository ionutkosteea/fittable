import {
  Container,
  ToolbarFactory,
  ControlArgs,
} from 'fit-core/view-model/index.js';

import { FitContainer } from '../../common/controls/fit-container.js';
import { createSeparator } from '../../common/view-model-utils.js';
import { UndoButton, RedoButton } from './controls/undo-redo-buttons.js';
import { PaintFormatButton } from './controls/paint-format-button.js';
import {
  BoldButton,
  ItalicButton,
  UnderlineButton,
  StrikeButton,
} from './controls/font-style-buttons.js';
import { FontFamilyCombo } from './controls/font-family-combo.js';
import { FontSizeInput } from './controls/font-size-input.js';
import { ColorMenu, BackgroundColorMenu } from './controls/color-menus.js';
import { VerticalAlignMenu } from './controls/vertical-align-menu.js';
import { HorizontalAlignMenu } from './controls/horizontal-align-menu.js';
import { BorderMenuBuilder } from './controls/border-menu.js';
import { asTableStyles } from 'fit-core/model/table.js';

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
  public createToolbar(args: ControlArgs): Container {
    const toolbar: FitContainer<FitToolbarControlId> = new FitContainer();
    toolbar
      .addControl('undo', new UndoButton(args))
      .addControl('redo', new RedoButton(args))
      .addControl('separator1', createSeparator());
    const isStyledTable: boolean =
      asTableStyles(args.operationExecutor.getTable()) !== undefined;
    const hasCellSelection: boolean = args.getSelectedCells().length > 0;
    if (isStyledTable && hasCellSelection) {
      this.addCellSelectionDependentControls(toolbar, args);
    }
    return toolbar;
  }

  private addCellSelectionDependentControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: ControlArgs
  ): void {
    toolbar
      .addControl('paint-format', new PaintFormatButton(args))
      .addControl('separator2', createSeparator())
      .addControl('bold', new BoldButton(args))
      .addControl('italic', new ItalicButton(args))
      .addControl('underline', new UnderlineButton(args))
      .addControl('strike', new StrikeButton(args))
      .addControl('separator3', createSeparator())
      .addControl('font-family', new FontFamilyCombo(args))
      .addControl('font-size', new FontSizeInput(args))
      .addControl('separator4', createSeparator())
      .addControl('color', new ColorMenu(args))
      .addControl('background-color', new BackgroundColorMenu(args))
      .addControl('separator5', createSeparator())
      .addControl('vertical-align', new VerticalAlignMenu(args))
      .addControl('horizontal-align', new HorizontalAlignMenu(args))
      .addControl('separator5', createSeparator())
      .addControl('border', new BorderMenuBuilder(args).build());
  }
}
