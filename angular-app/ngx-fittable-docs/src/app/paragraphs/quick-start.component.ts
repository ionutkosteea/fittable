import { Subject } from 'rxjs';
import { Component } from '@angular/core';

import { Table, createTable4Dto } from 'fit-core/model';
import { ViewModelConfig } from 'fit-core/view-model';
import { FitTableDto } from 'fit-model';
import { ViewModelConfigBuilder } from 'fit-view-model';
import { FittableBuidler } from 'ngx-fittable';

@Component({
  selector: 'quick-start',
  templateUrl: './paragraph.html',
  styleUrls: ['./paragraph.css'],
})
export class QuickStartComponent {
  public title = 'Quick start';
  public showCode = false;
  public setShowCode = (show: boolean) => (this.showCode = show);

  private readonly viewModelConfigBuilder: ViewModelConfigBuilder =
    new ViewModelConfigBuilder()
      .setSettingsBar(true)
      .setThemeSwitcher(true)
      .setToolbar(true)
      .setContextMenu(true)
      .setStatusbar(true)
      .setRowHeader(true)
      .setColumnHeader(true)
      .setCellSelection(true)
      .setCellEditor(true);

  private viewModelConfig: ViewModelConfig =
    this.viewModelConfigBuilder.build();

  public readonly fittableBuilder: FittableBuidler = new FittableBuidler()
    .setViewModelConfig(this.viewModelConfig)
    .setCreateTableFn(this.createTable);

  public readonly fittableRefresh$: Subject<void> = new Subject();

  public readonly navigation: NavigationItem[] = this.createNavigation();

  private createTable(): Table {
    const dto: FitTableDto = {
      numberOfRows: 100,
      numberOfColumns: 20,
      rowHeader: { numberOfColumns: 1 },
      columnHeader: { numberOfRows: 1 },
      styles: {
        s0: { 'font-weight': 'bold' },
        s1: { 'font-style': 'italic' },
        s2: { 'text-decoration': 'underline' },
        s3: { 'text-decoration': 'line-through' },
        s4: { 'font-family': 'fantasy' },
        s5: { 'font-size.px': 16 },
        s6: { color: '#5498ff' },
        s7: { 'background-color': '#5498ff' },
        s8: { 'place-items': 'end normal' },
        s9: { 'text-align': 'right' },
        s10: {
          'border-left': '4px dotted #5498ff',
          'border-top': '4px dotted #5498ff',
          'border-right': '4px dotted #5498ff',
          'border-bottom': '4px dotted #5498ff',
        },
      },
      mergedRegions: [
        { from: { rowId: 13, colId: 1 }, to: { rowId: 14, colId: 2 } },
      ],
      columns: { 2: { width: 50 } },
      rows: {
        1: { cells: { 1: { value: 'line1\nline2\nline3' } } },
        2: { cells: { 1: { styleName: 's0', value: 'Bold' } } },
        3: { cells: { 1: { styleName: 's1', value: 'Italic' } } },
        4: { cells: { 1: { styleName: 's2', value: 'Underline' } } },
        5: { cells: { 1: { styleName: 's3', value: 'Line-through' } } },
        6: { cells: { 1: { styleName: 's4', value: 'Font fantasy' } } },
        7: { cells: { 1: { styleName: 's5', value: 'Font size 16' } } },
        8: { cells: { 1: { styleName: 's6', value: 'Color' } } },
        9: { cells: { 1: { styleName: 's7', value: 'Backgroundcolor' } } },
        10: { cells: { 1: { styleName: 's8', value: 'Align bottom' } } },
        11: { cells: { 1: { styleName: 's9', value: 'Align right' } } },
        12: { cells: { 1: { styleName: 's10', value: 'Border' } } },
        13: { cells: { 1: { value: 'Merged cells' } } },
        15: {
          height: 42,
          cells: { 1: { value: 'Row height' }, 2: { value: 'Column width' } },
        },
      },
    };
    return createTable4Dto(dto);
  }

  private createNavigation(): NavigationItem[] {
    const navigation: NavigationItem[] = [];
    const settingsBarItem: NavigationItem = {
      label: 'Settings bar',
      isChecked: (): boolean =>
        this.viewModelConfig.settingsBarFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setSettingsBar(!settingsBarItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(settingsBarItem);
    const themeSwitcherItem: NavigationItem = {
      label: 'Theme switcher',
      isChecked: (): boolean =>
        this.viewModelConfig.themeSwitcherFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setThemeSwitcher(!themeSwitcherItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(themeSwitcherItem);
    const toolbarItem: NavigationItem = {
      label: 'Toolbar',
      isChecked: (): boolean =>
        this.viewModelConfig.toolbarFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setToolbar(!toolbarItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(toolbarItem);
    const disableVirtualRowsItem: NavigationItem = {
      label: 'Virtual rows',
      isChecked: (): boolean =>
        this.viewModelConfig.disableVirtualRows ? false : true,
      run: (): void => {
        this.viewModelConfigBuilder
          .setDisableVirtualRows(disableVirtualRowsItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(disableVirtualRowsItem);
    const disableVirtualColumnsItem: NavigationItem = {
      label: 'Virtual columns',
      isChecked: (): boolean =>
        this.viewModelConfig.disableVirtualColumns ? false : true,
      run: (): void => {
        this.viewModelConfigBuilder
          .setDisableVirtualColumns(disableVirtualColumnsItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(disableVirtualColumnsItem);
    const rowHeaderItem: NavigationItem = {
      label: 'Row header',
      isChecked: (): boolean => this.viewModelConfig.showRowHeader ?? false,
      run: (): void => {
        this.viewModelConfigBuilder
          .setRowHeader(!rowHeaderItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(rowHeaderItem);
    const columnHeaderItem: NavigationItem = {
      label: 'Column header',
      isChecked: (): boolean => this.viewModelConfig.showColumnHeader ?? false,
      run: (): void => {
        this.viewModelConfigBuilder
          .setColumnHeader(!columnHeaderItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(columnHeaderItem);
    const cellSelectionItem: NavigationItem = {
      label: 'Cell selection',
      isChecked: (): boolean =>
        this.viewModelConfig.cellSelectionFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setCellSelection(!cellSelectionItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(cellSelectionItem);
    const cellEditorItem: NavigationItem = {
      label: 'Cell editor',
      isChecked: (): boolean =>
        this.viewModelConfig.cellEditorFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setCellEditor(!cellEditorItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(cellEditorItem);
    const contextMenuItem: NavigationItem = {
      label: 'Context menu',
      isChecked: (): boolean =>
        this.viewModelConfig.contextMenuFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setContextMenu(!contextMenuItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(contextMenuItem);
    const statusBarItem: NavigationItem = {
      label: 'Statusbar',
      isChecked: (): boolean =>
        this.viewModelConfig.statusbarFactory !== undefined,
      run: (): void => {
        this.viewModelConfigBuilder
          .setStatusbar(!statusBarItem.isChecked())
          .build();
        this.fittableRefresh$.next();
      },
    };
    navigation.push(statusBarItem);
    return navigation;
  }
}

export interface NavigationItem {
  label: string;
  isChecked: () => boolean;
  run: () => void;
}
