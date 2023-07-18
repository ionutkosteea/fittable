import { Component, Input, OnDestroy } from '@angular/core';

import {
  Container,
  Window,
  Statusbar,
  ViewModel,
  FittableDesigner,
  ScrollContainer,
  LanguageDictionary,
} from 'fittable-core/view-model';

@Component({
  selector: 'fittable',
  templateUrl: './fittable.component.html',
  styleUrls: ['./fittable.component.css'],
})
export class FittableComponent implements OnDestroy {
  @Input() designer!: FittableDesigner;

  public readonly getViewModel = (): ViewModel => this.designer.viewModel;

  public readonly getTableScrollContainer = (): ScrollContainer =>
    this.designer.viewModel.tableScrollContainer;

  public readonly hasToolbar = (): boolean =>
    this.designer.viewModel.toolbar !== undefined;

  public readonly getToolbar = (): Container =>
    this.designer.viewModel.toolbar as Container;

  public readonly hasContextMenu = (): boolean =>
    this.designer.viewModel.contextMenu !== undefined;

  public readonly getContextMenu = (): Window =>
    this.designer.viewModel.contextMenu as Window;

  public readonly hasStatusbar = (): boolean =>
    this.designer.viewModel.statusbar !== undefined;

  public readonly getStatusbar = (): Statusbar =>
    this.designer.viewModel.statusbar as Statusbar;

  public readonly getDictionary = (): LanguageDictionary =>
    this.designer.viewModel.dictionary;

  public readonly hasSettingsBar = (): boolean =>
    this.designer.viewModel.settingsBar !== undefined;

  public readonly getSettingsBar = (): Container =>
    this.designer.viewModel.settingsBar as Container;

  public ngOnDestroy(): void {
    this.designer.viewModel.destroy();
  }
}
