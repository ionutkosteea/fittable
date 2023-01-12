import {
  AfterViewInit,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { createTable4Dto } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  getViewModelConfig,
  registerViewModelConfig,
  ViewModelConfig,
} from 'fit-core/view-model';
import { FitTableDto } from 'fit-model';
import {
  createFitViewModelConfig,
  FitViewModelConfigDef,
  FIT_VIEW_MODEL_CONFIG,
} from 'fit-view-model';
import { TableViewComponent } from 'ngx-fittable';

const FIT_TABLE_DTO: FitTableDto = {
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
      'border-left': '2px solid #ff2020',
      'border-top': '2px solid #ffdc4b',
      'border-right': '2px solid #69c06d',
      'border-bottom': '2px solid #5488ff',
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

@Component({
  selector: 'introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['../common/common.css', './introduction.component.css'],
})
export class IntroductionComponent implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ViewContainerRef })
  vcr!: ViewContainerRef;
  ref!: ComponentRef<TableViewComponent>;

  public readonly navigation: NavigationItem[] = this.createNavigation();
  public fit!: FittableViewer;

  public ngOnInit(): void {
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
    this.fit = createFittableViewer(createTable4Dto(FIT_TABLE_DTO));
  }

  public ngAfterViewInit(): void {
    setTimeout((): void => this.updateFittableComponent());
  }

  private createNavigation(): NavigationItem[] {
    const navigation: NavigationItem[] = [];
    navigation.push(this.createSettingsBarItem());
    navigation.push(this.createThemeSwitcherItem());
    navigation.push(this.createToolbarItem());
    navigation.push(this.createVirtualRowsItem());
    navigation.push(this.createVirtualColumnsItem());
    navigation.push(this.createRowHeaderItem());
    navigation.push(this.createColumnHeaderItem());
    navigation.push(this.createCellSelectionItem());
    navigation.push(this.createCellEditorItem());
    navigation.push(this.createContextMenuItem());
    navigation.push(this.createStatusbarItem());
    return navigation;
  }

  private createSettingsBarItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Settings bar',
      isChecked: (): boolean =>
        getViewModelConfig().settingsBarFactory !== undefined,
      run: (): void => this.run({ settingsBar: !item.isChecked() }),
    };
    return item;
  }

  private createThemeSwitcherItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Theme switcher',
      isChecked: (): boolean =>
        getViewModelConfig().themeSwitcherFactory !== undefined,
      run: (): void => this.run({ themeSwitcher: !item.isChecked() }),
    };
    return item;
  }

  private createToolbarItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Toolbar',
      isChecked: (): boolean =>
        getViewModelConfig().toolbarFactory !== undefined,
      run: (): void => this.run({ toolbar: !item.isChecked() }),
    };
    return item;
  }

  private createVirtualRowsItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Virtual rows',
      isChecked: (): boolean =>
        getViewModelConfig().disableVirtualRows ? false : true,
      run: (): void => this.run({ disableVirtualRows: item.isChecked() }),
    };
    return item;
  }

  private createVirtualColumnsItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Virtual columns',
      isChecked: (): boolean =>
        getViewModelConfig().disableVirtualColumns ? false : true,
      run: (): void =>
        this.run({
          disableVirtualColumns: item.isChecked(),
        }),
    };
    return item;
  }

  private createRowHeaderItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Row header',
      isChecked: (): boolean => getViewModelConfig().showRowHeader ?? false,
      run: (): void => this.run({ rowHeader: !item.isChecked() }),
    };
    return item;
  }

  private createColumnHeaderItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Column header',
      isChecked: (): boolean => getViewModelConfig().showColumnHeader ?? false,
      run: (): void => this.run({ columnHeader: !item.isChecked() }),
    };
    return item;
  }

  private createCellSelectionItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Cell selection',
      isChecked: (): boolean =>
        getViewModelConfig().cellSelectionFactory !== undefined,
      run: (): void => this.run({ cellSelection: !item.isChecked() }),
    };
    return item;
  }

  private createCellEditorItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Cell editor',
      isChecked: (): boolean =>
        getViewModelConfig().cellEditorFactory !== undefined,
      run: (): void => this.run({ cellEditor: !item.isChecked() }),
    };
    return item;
  }

  private createContextMenuItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Context menu',
      isChecked: (): boolean =>
        getViewModelConfig().contextMenuFactory !== undefined,
      run: (): void => this.run({ contextMenu: !item.isChecked() }),
    };
    return item;
  }

  private createStatusbarItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Statusbar',
      isChecked: (): boolean =>
        getViewModelConfig().statusbarFactory !== undefined,
      run: (): void => this.run({ statusbar: !item.isChecked() }),
    };
    return item;
  }

  private run(configDef: FitViewModelConfigDef): void {
    const srcConfig: ViewModelConfig = getViewModelConfig();
    registerViewModelConfig(createFitViewModelConfig(configDef, srcConfig));
    this.fit = createFittableViewer(createTable4Dto(FIT_TABLE_DTO));
    this.updateFittableComponent();
  }

  private updateFittableComponent(): void {
    if (this.ref) {
      const index = this.vcr.indexOf(this.ref.hostView);
      if (index != -1) this.vcr.remove(index);
    }
    this.ref = this.vcr.createComponent(TableViewComponent);
    this.ref.setInput('viewer', this.fit);
  }
}

interface NavigationItem {
  label: string;
  isChecked: () => boolean;
  run: () => void;
}
