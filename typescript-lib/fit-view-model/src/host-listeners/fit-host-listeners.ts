import { Subscription } from 'rxjs';

import {
  HostListeners,
  TableScrollerListener,
  createTableScrollerListener,
  CellSelectionListener,
  CellEditorListener,
  createCellSelectionListener,
  createCellEditorListener,
  createWindowListener,
  ViewModel,
  HostListenersFactory,
  WindowListener,
  InputControlListener,
  createInputControlListener,
  FitMouseEvent,
} from 'fit-core/view-model/index.js';

export class FitHostListeners implements HostListeners {
  public readonly tableScrollerListener: TableScrollerListener;
  public readonly cellSelectionListener?: CellSelectionListener;
  public readonly cellEditorListener?: CellEditorListener;
  public readonly windowListener?: WindowListener;
  public readonly inputControlListener?: InputControlListener;

  private subscriptions: Subscription[] = [];

  constructor(private readonly viewModel: ViewModel) {
    this.tableScrollerListener = this.createTableScrollerListener();
    this.cellSelectionListener = this.createCellSelectionListener();
    this.cellEditorListener = this.createCellEditorListener();
    this.windowListener = this.createWindowListener();
    this.inputControlListener = this.createInputControlListener();

    this.createSubscriptions();
  }

  private createTableScrollerListener(): TableScrollerListener {
    return createTableScrollerListener(this.viewModel.tableScroller);
  }

  private createCellSelectionListener(): CellSelectionListener | undefined {
    try {
      return (
        this.viewModel.cellSelection &&
        createCellSelectionListener(
          this.viewModel.cellSelection,
          this.viewModel.cellSelectionScroller
        )
      );
    } catch {
      return undefined;
    }
  }

  private createCellEditorListener(): CellEditorListener | undefined {
    try {
      return this.viewModel.cellEditor && createCellEditorListener();
    } catch {
      return undefined;
    }
  }

  private createWindowListener(): WindowListener | undefined {
    try {
      return createWindowListener();
    } catch {
      return undefined;
    }
  }

  private createInputControlListener(): InputControlListener | undefined {
    try {
      return createInputControlListener();
    } catch {
      return undefined;
    }
  }

  private createSubscriptions(): void {
    const cellEditorMenu$: Subscription | undefined =
      this.openCellEditorContextMenu$();
    cellEditorMenu$ && this.subscriptions.push(cellEditorMenu$);
  }

  private openCellEditorContextMenu$(): Subscription | undefined {
    return this.cellEditorListener
      ?.onContextMenu$()
      .subscribe((event: FitMouseEvent): void => {
        this.viewModel.contextMenu &&
          this.windowListener
            ?.setWindow(this.viewModel.contextMenu)
            .onShow(event);
      });
  }

  public destroy(): void {
    this.subscriptions.forEach((s: Subscription): void => s.unsubscribe());
  }
}

export class FitHostListenersFactory implements HostListenersFactory {
  public createHostListeners(viewModel: ViewModel): HostListeners {
    return new FitHostListeners(viewModel);
  }
}
