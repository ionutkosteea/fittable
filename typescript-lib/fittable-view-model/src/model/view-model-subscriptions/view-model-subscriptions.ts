import { Subscription } from 'rxjs';

import {
  ScrollContainer,
  CellEditor,
  CellSelection,
  Container,
  FocusableObject,
  Window,
  ColFilters,
  Control,
  asPopupControl,
} from 'fittable-core/view-model';

import { FitSettingsBarControlId } from '../settings-bar/fit-settings-bar-factory.js';

export type ViewModelSubscriptionsArgs = {
  tableScrollContainer: ScrollContainer;
  cellEditor?: CellEditor;
  cellSelection?: CellSelection;
  settingsBar?: Container;
  toolbar?: Container;
  contextMenu?: Window;
  colFilters?: ColFilters;
};

export class ViewModelSubscriptions {
  private readonly subscriptions: Set<Subscription | undefined> = new Set();

  constructor(private args: ViewModelSubscriptionsArgs) {}

  public init(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onWindowResize);
      window.addEventListener('keydown', this.onWindowKeyDown);
    }
    this.focusActiveObject();
    this.focusBodyOnCellEditorMove();
    this.hideCellEditorOnFocusHeader();
  }

  private onWindowResize = (): void => {
    this.args.tableScrollContainer.renderModel();
  };

  private onWindowKeyDown = (event: KeyboardEvent): void => {
    if (event.key.toUpperCase() === 'F' && event.metaKey) {
      for (const obj of this.getFocusableObjects()) {
        obj.setFocus(false, true);
      }
    }
  };

  private focusActiveObject(): void {
    this.getFocusableObjects().forEach((obj: FocusableObject): void => {
      this.subscriptions.add(this.focusOutOthers$(obj));
    });
  }

  private focusOutOthers$(object: FocusableObject): Subscription {
    const other: FocusableObject[] = this.getFocusableObjects();
    const subscription: Subscription = this.ifObjectIsFocusedFocusOutOthers$(
      object,
      other.filter((obj: FocusableObject): boolean => obj !== object)
    );
    return subscription;
  }

  private getFocusableObjects(): FocusableObject[] {
    const objects: FocusableObject[] = [];
    this.args.contextMenu && objects.push(this.args.contextMenu);
    this.args.cellEditor && objects.push(this.args.cellEditor);
    this.args.cellSelection?.body && objects.push(this.args.cellSelection.body);
    this.args.cellSelection?.rowHeader &&
      objects.push(this.args.cellSelection.rowHeader);
    this.args.cellSelection?.colHeader &&
      objects.push(this.args.cellSelection.colHeader);
    this.args.cellSelection?.pageHeader &&
      objects.push(this.args.cellSelection.pageHeader);
    this.args.colFilters &&
      objects.push(this.args.colFilters.getPopupButton(0).getWindow());
    const settingsWindow: Window | undefined = this.getSettingsWindow();
    settingsWindow && objects.push(settingsWindow);
    return objects;
  }

  private getSettingsWindow(): Window | undefined {
    if (!this.args.settingsBar) return undefined;
    const id: FitSettingsBarControlId = 'settings-button';
    const control: Control = this.args.settingsBar.getControl(id);
    return asPopupControl(control)?.getWindow();
  }

  private ifObjectIsFocusedFocusOutOthers$(
    object: FocusableObject,
    others: FocusableObject[]
  ): Subscription {
    return object.onAfterSetFocus$().subscribe((focus: boolean): void => {
      if (!focus) return;
      others.forEach((o: FocusableObject): void => {
        o.hasFocus() && o.setFocus(false, true);
      });
    });
  }

  private focusBodyOnCellEditorMove(): void {
    const subscription: Subscription | undefined = this.args.cellEditor
      ?.onAfterSetCell$()
      .subscribe((): void => {
        this.args.cellEditor?.hasFocus() &&
          !this.args.cellSelection?.body.hasFocus() &&
          this.args.cellSelection?.body.setFocus(true);
      });
    this.subscriptions.add(subscription);
  }

  private hideCellEditorOnFocusHeader(): void {
    const focusableObjects: (FocusableObject | undefined)[] = [
      this.args.cellSelection?.rowHeader,
      this.args.cellSelection?.colHeader,
      this.args.cellSelection?.pageHeader,
    ];
    for (const obj of focusableObjects) {
      this.subscriptions.add(this.createHeaderFocus$(obj));
    }
  }

  private createHeaderFocus$(
    header?: FocusableObject
  ): Subscription | undefined {
    return header?.onAfterSetFocus$().subscribe((focus: boolean): void => {
      focus && this.args.cellEditor?.setVisible(false);
    });
  }

  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize);
      window.removeEventListener('keydown', this.onWindowKeyDown);
    }
    this.subscriptions.forEach((s?: Subscription): void => s?.unsubscribe());
  }
}
