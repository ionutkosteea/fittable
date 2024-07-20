import {
  AfterViewInit,
  Component,
  ComponentRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
  signal,
} from '@angular/core';

import { createTable4Dto, registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import {
  createFittableDesigner,
  FittableDesigner,
  getViewModelConfig,
  registerViewModelConfig,
  ViewModelConfig,
} from 'fittable-core/view-model';
import { FitTableDto, FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import {
  createFitViewModelConfig,
  FitViewModelConfigDef,
  FIT_VIEW_MODEL_CONFIG,
} from 'fittable-view-model';
import { FittableComponent } from 'fittable-angular';

import { TopicTitle } from '../../../common/topic-title.model';

const getFitTableDto = (): FitTableDto => ({
  numberOfRows: 100,
  numberOfCols: 20,
  styles: {
    s0: { 'font-weight': 'bold' },
    s1: { 'font-style': 'italic' },
    s2: { 'text-decoration': 'line-through' },
    s3: { 'text-decoration': 'underline' },
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
  mergedCells: { 14: { 1: { rowSpan: 2, colSpan: 2 } } },
  cols: { 2: { width: 50 }, 4: { width: 140 } },
  rows: { 13: { height: 42 } },
  cells: {
    1: {
      1: { value: 'line1\nline2\nline3' },
      3: { value: 1000, dataType: { name: 'string' } },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'yyyy-MM-dd' },
      },
      5: { value: true },
    },
    2: {
      1: { styleName: 's0', value: 'Bold' },
      3: { value: 1000 },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'dd.MM.yyyy' },
      },
      5: { value: false },
    },
    3: {
      1: { styleName: 's1', value: 'Italic' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: '#.00' },
      },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'MM/dd/yyyy' },
      },
    },
    4: {
      1: { styleName: 's2', value: 'Line-through' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: '#,#' },
      },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'hh:mm' },
      },
    },
    5: {
      1: { styleName: 's3', value: 'Underline' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: '#,#.00' },
      },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'hh:mm:ss' },
      },
    },
    6: {
      1: { styleName: 's4', value: 'Font fantasy' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: '$#' },
      },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'dd-MM-yyy hh:mm' },
      },
    },
    7: {
      1: { styleName: 's5', value: 'Font size 16' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: '#.00 €' },
      },
      4: {
        value: '2023-12-31 12:30:59',
        dataType: { name: 'date-time', format: 'MM/dd/yy hh:mm:ss' },
      },
    },
    8: {
      1: { styleName: 's6', value: 'Color' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: 'CAD#,#' },
      },
    },
    9: {
      1: { styleName: 's7', value: 'Backgroundcolor' },
      3: {
        value: 1000,
        dataType: { name: 'number', format: 'GBP #,#.00' },
      },
    },
    10: {
      1: { styleName: 's8', value: 'Align bottom' },
      3: {
        value: 0.1,
        dataType: { name: 'number', format: '#%' },
      },
    },
    11: {
      1: { styleName: 's9', value: 'Align right' },
      3: {
        value: 0.1,
        dataType: { name: 'number', format: '#.00%' },
      },
    },
    12: {
      1: { styleName: 's10', value: 'Border' },
      3: {
        value: 10,
        dataType: { name: 'number', format: '#,# %' },
      },
    },
    13: {
      1: { value: 'Row height' },
      2: { value: 'Column width' },
      3: {
        value: 10,
        dataType: { name: 'number', format: '#,#.00 %' },
      },
    },
    14: { 1: { value: 'Merged cells' } },
  },
});

@Component({
  selector: 'playground',
  templateUrl: './playground.component.html',
  styleUrls: ['../../common/common.css', './playground.component.css'],
})
export class PlaygroundComponent implements OnInit, AfterViewInit {
  @ViewChild('content', { read: ViewContainerRef })
  vcr!: ViewContainerRef;
  ref!: ComponentRef<FittableComponent>;

  public readonly title: TopicTitle = 'Playground';
  public readonly navigation: NavigationItem[] = this.createNavigation();
  public fit!: WritableSignal<FittableDesigner>;

  public ngOnInit(): void {
    // The register functions should be called, in most cases, from the Angular main module.
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    this.fit = signal(createFittableDesigner(createTable4Dto(getFitTableDto())));
  }

  public ngAfterViewInit(): void {
    this.updateFittableComponent();
  }

  private createNavigation(): NavigationItem[] {
    const navigation: NavigationItem[] = [];
    navigation.push(this.createSettingsBarItem());
    navigation.push(this.createThemeSwitcherItem());
    navigation.push(this.createToolbarItem());
    navigation.push(this.createVirtualRowsItem());
    navigation.push(this.createVirtualColsItem());
    navigation.push(this.createRowHeaderItem());
    navigation.push(this.createColHeaderItem());
    navigation.push(this.createColFiltersItem());
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

  private createVirtualColsItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Virtual columns',
      isChecked: (): boolean =>
        getViewModelConfig().disableVirtualCols ? false : true,
      run: (): void =>
        this.run({
          disableVirtualCols: item.isChecked(),
        }),
    };
    return item;
  }

  private createRowHeaderItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Row header',
      isChecked: (): boolean =>
        getViewModelConfig().rowHeaderWidth ? true : false,
      run: (): void => this.run({ rowHeader: !item.isChecked() }),
    };
    return item;
  }

  private createColHeaderItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Column header',
      isChecked: (): boolean =>
        getViewModelConfig().colHeaderHeight ? true : false,
      run: (): void => this.run({ colHeader: !item.isChecked() }),
    };
    return item;
  }

  private createColFiltersItem(): NavigationItem {
    const item: NavigationItem = {
      label: 'Column filters',
      isChecked: (): boolean =>
        getViewModelConfig().colFiltersFactory !== undefined,
      run: (): void => this.run({ colFilters: !item.isChecked() }),
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
    this.fit.set(createFittableDesigner(createTable4Dto(getFitTableDto())));
    this.updateFittableComponent();
  }

  private updateFittableComponent(): void {
    if (this.ref) {
      const index = this.vcr.indexOf(this.ref.hostView);
      if (index != -1) this.vcr.remove(index);
    }
    this.ref = this.vcr.createComponent(FittableComponent);
    this.ref.setInput('designer', this.fit());
  }
}

interface NavigationItem {
  label: string;
  isChecked: () => boolean;
  run: () => void;
}
