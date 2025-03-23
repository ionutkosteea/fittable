import {
  asTableDataTypes,
  asTableStyles,
  TableStyles,
  TableDataTypes,
  TableData,
  asTableData
} from 'fittable-core/model';
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
import { createDataRefPopup } from './controls/data-ref-popup.js';

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
  | 'data-type'
  | 'data-ref'
  | `${'separator'}${string}`;

export class FitToolbarFactory implements ToolbarFactory {
  private separatorCounter = 0;

  public createToolbar(args: ControlArgs): Container {
    const toolbar: FitContainer<FitToolbarControlId> = new FitContainer();
    toolbar
      .addControl('undo', createUndoButton(args))
      .addControl('redo', createRedoButton(args))
      .addControl(this.getSeparatorId(), new FitSeparator());
    const hasCellSelection: boolean = args.getSelectedCells().length > 0;
    if (hasCellSelection) {
      const tableStyles: TableStyles | undefined = asTableStyles(args.operationExecutor.getTable());
      const tableDataTypes: TableDataTypes | undefined = asTableDataTypes(args.operationExecutor.getTable());
      tableStyles && this.addStyleUpdateControls(toolbar, args);
      tableDataTypes && this.addDataTypeUpdateControls(toolbar, args);
    }
    const tableData: TableData | undefined = asTableData(args.operationExecutor.getTable());
    tableData && this.addDataRefUpdateControls(toolbar, args);
    return toolbar;
  }

  private addStyleUpdateControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: ControlArgs
  ): void {
    toolbar
      .addControl('paint-format', createPaintFormatButton(args))
      .addControl(this.getSeparatorId(), new FitSeparator())
      .addControl('bold', createBoldButton(args))
      .addControl('italic', createItalicButton(args))
      .addControl('strike', createStrikeButton(args))
      .addControl('underline', createUnderlineButton(args))
      .addControl(this.getSeparatorId(), new FitSeparator())
      .addControl('font-family', createFontFamilyCombo(args))
      .addControl(this.getSeparatorId(), new FitSeparator())
      .addControl('font-size', createFontSizeInput(args))
      .addControl(this.getSeparatorId(), new FitSeparator())
      .addControl('color', createColorPopup(args))
      .addControl('background-color', createBackgroundColorPopup(args))
      .addControl(this.getSeparatorId(), new FitSeparator())
      .addControl('vertical-align', createVerticalAlignPopup(args))
      .addControl('horizontal-align', createHorizontalAlignPopup(args))
      .addControl('border', createBorderPopup(args))
      .addControl(this.getSeparatorId(), new FitSeparator());
  }

  private addDataTypeUpdateControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: ControlArgs
  ): void {
    toolbar.addControl('data-type', createDataTypePopup(args));
  }

  private addDataRefUpdateControls(
    toolbar: FitContainer<FitToolbarControlId>,
    args: ControlArgs
  ): void {
    toolbar.addControl('data-ref', createDataRefPopup(args));
  }

  private getSeparatorId(): FitToolbarControlId {
    this.separatorCounter++;
    return `separator${this.separatorCounter}`;
  }
}
