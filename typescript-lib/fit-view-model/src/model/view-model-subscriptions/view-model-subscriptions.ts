import { Subject, Subscription } from 'rxjs';

import { CellRange } from 'fit-core/model/cell-range.js';
import {
  TableScroller,
  CellEditor,
  CellSelection,
  Container,
  Control,
  FocusableObject,
  Window,
  Statusbar,
} from 'fit-core/view-model/index.js';

import { StyleCombo } from '../controls/toolbar/controls/common/style-combo.js';
import { StylePushButton } from '../controls/toolbar/controls/common/style-push-button.js';
import { FontSizeInput } from '../controls/toolbar/controls/font-size-input.js';
import { PaintFormatButton } from '../controls/toolbar/controls/paint-format-button.js';

export type ViewModelSubscriptionsArgs = {
  tableScroller: TableScroller;
  cellEditor?: CellEditor;
  cellSelection?: CellSelection;
  toolbar?: Container;
  contextMenu?: Window;
  statusbar?: Statusbar;
};

export class ViewModelSubscriptions {
  private readonly subscriptions: Subscription[] = [];

  constructor(private args: ViewModelSubscriptionsArgs) {}

  public init(): void {
    window?.addEventListener('resize', this.onWindowResize);
    this.updateToolbarByCellSelection();
    this.focusActiveObject();
    this.focusBodySelectionOnCellEditorFocusOut();
    this.hideCellEditorOnFocusHeader();
  }

  private onWindowResize = (): void => {
    this.args.tableScroller
      .resizeViewportHeight()
      .resizeViewportWidth()
      .renderTable();
  };

  private updateToolbarByCellSelection(): void {
    const afterCellSelection$: Subject<CellRange[]> = new Subject();
    this.args.cellSelection?.body.addOnEnd$(afterCellSelection$);
    this.args.toolbar?.getControls().forEach((control: Control): void => {
      if (
        control instanceof StyleCombo ||
        control instanceof StylePushButton ||
        control instanceof FontSizeInput ||
        control instanceof PaintFormatButton
      ) {
        const subscription: Subscription = afterCellSelection$.subscribe(
          (): void => control.updateByCellSelection()
        );
        this.subscriptions.push(subscription);
      }
    });
  }

  private focusActiveObject(): void {
    this.getFocusableObjects().forEach((obj) => {
      this.subscriptions.push(this.createFocusSubscription(obj));
    });
  }

  private createFocusSubscription(object: FocusableObject): Subscription {
    let other: FocusableObject[] = this.getFocusableObjects();
    const subscription: Subscription = this.ifObjectIsFocusedFocusOutOthers$(
      object,
      other.filter((obj) => obj !== object)
    );
    return subscription;
  }

  private getFocusableObjects(): FocusableObject[] {
    const objects: FocusableObject[] = [];
    this.args.toolbar && objects.push(this.args.toolbar);
    this.args.contextMenu && objects.push(this.args.contextMenu);
    this.args.cellEditor && objects.push(this.args.cellEditor);
    this.args.cellSelection?.body && objects.push(this.args.cellSelection.body);
    this.args.cellSelection?.rowHeader &&
      objects.push(this.args.cellSelection.rowHeader);
    this.args.cellSelection?.colHeader &&
      objects.push(this.args.cellSelection.colHeader);
    this.args.cellSelection?.pageHeader &&
      objects.push(this.args.cellSelection.pageHeader);
    this.args.statusbar && objects.push(this.args.statusbar);
    return objects;
  }

  private ifObjectIsFocusedFocusOutOthers$(
    object: FocusableObject,
    others: FocusableObject[]
  ): Subscription {
    return object.onAfterSetFocus$().subscribe((focus: boolean): void => {
      if (!focus) return;
      others.forEach((o: FocusableObject) => o.setFocus(false, true));
    });
  }

  private focusBodySelectionOnCellEditorFocusOut(): void {
    const subscription: Subscription | undefined = this.args.cellEditor
      ?.onAfterSetFocus$()
      .subscribe((focus: boolean): void => {
        if (!focus) this.args.cellSelection?.body.setFocus(true, true);
      });
    subscription && this.subscriptions.push(subscription);
  }

  private hideCellEditorOnFocusHeader(): void {
    const focusableObjects: (FocusableObject | undefined)[] = [
      this.args.cellSelection?.rowHeader,
      this.args.cellSelection?.colHeader,
      this.args.cellSelection?.pageHeader,
    ];
    for (const obj of focusableObjects) {
      const subscription: Subscription | undefined =
        this.createHeaderFocusSubscription(obj);
      subscription && this.subscriptions.push(subscription);
    }
  }

  private createHeaderFocusSubscription(
    header?: FocusableObject
  ): Subscription | undefined {
    return header?.onAfterSetFocus$().subscribe((focus: boolean): void => {
      if (!focus) return;
      this.args.cellEditor?.setVisible(false);
    });
  }

  public destroy(): void {
    window?.removeEventListener('resize', this.onWindowResize);
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}
