import {
  AfterViewInit,
  Component,
  ComponentRef,
  DestroyRef,
  OnInit,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  createData,
  createDataDef,
  createDataType,
  createStyle, createTable,
  createTable4Dto,
  registerModelConfig,
  Value
} from 'fittable-core/model';
import { registerOperationConfig, TableChanges } from 'fittable-core/operations';
import {
  createTableDesigner,
  TableDesigner,
  getViewModelConfig,
  registerViewModelConfig,
  ViewModelConfig,
} from 'fittable-core/view-model';
import {
  FitTableDto,
  FIT_MODEL_CONFIG,
  FitDataDef,
  FitData,
  FitTable,
  FitStyle,
  FitDataType
} from 'fittable-model';
import { FIT_OPERATION_CONFIG, createTableChangeDataRefs, TableChangeDataRef } from 'fittable-model-operations';
import {
  createFitViewModelConfig,
  FitViewModelConfigDef,
  FIT_VIEW_MODEL_CONFIG
} from 'fittable-view-model';
import { FittableComponent } from 'fittable-angular';

import { TopicTitle } from '../../../common/topic-title.model';
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
  public fit!: WritableSignal<TableDesigner>;
  private readonly destroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    registerModelConfig(FIT_MODEL_CONFIG);
    registerOperationConfig(FIT_OPERATION_CONFIG);
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

    const tableName = 'employees';
    const valueFields = ['NAME', 'AGE', 'SALARY', 'BONUS_PERCENTAGE', 'HIRE_DATE', 'IS_ACTIVE'];
    const dataDef = createDataDef<FitDataDef>(tableName, valueFields)
      .setKeyFields('EMPLOYEE_ID')
      .setExpandRows(true);

    const values: Value[][] = [
      [1, 'John Doe', 30, 50000, 0.1, '2021-01-01', true],
      [2, 'Jane Smith', 25, 45000, 0.15, '2020-06-15', true],
      [3, 'Alice Johnson', 28, 48000, 0.12, '2019-11-20', false],
      [4, 'Bob Brown', 35, 52000, 0.08, '2018-03-10', true],
      [5, 'Charlie Davis', 40, 55000, 0.2, '2017-07-25', true],
    ];
    const data = createData<FitData>(tableName, values);

    const table = createTable<FitTable>()
      .setNumberOfRows(2)
      .setNumberOfCols(6)
      .setRowHeight(0, 40)
      .setStyle('s0', createStyle<FitStyle>()
        .set('font-weight', 'bold')
        .set('text-align', 'center')
      )
      .setCellValue(0, 0, 'Name')
      .setCellStyleName(0, 0, 's0')
      .setCellValue(0, 1, 'Age')
      .setCellStyleName(0, 1, 's0')
      .setCellValue(0, 2, 'Salary')
      .setCellStyleName(0, 2, 's0')
      .setCellValue(0, 3, 'Bonus Percentage')
      .setCellStyleName(0, 3, 's0')
      .setCellValue(0, 4, 'Hire Date')
      .setCellStyleName(0, 4, 's0')
      .setCellValue(0, 5, 'Is Active')
      .setCellStyleName(0, 5, 's0')
      .setCellDataType(1, 2, createDataType<FitDataType>('number', '$#,#.00'))
      .setCellDataType(1, 3, createDataType<FitDataType>('number', '#%'))
      .setCellDataType(1, 4, createDataType<FitDataType>('date-time', 'dd.MM.yyyy'))
      .setDataDef(1, 0, dataDef)
      .loadData(data);

    const tableDesigner = createTableDesigner(table);
    tableDesigner.operationExecutor?.onBeforeRun$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((changes: TableChanges) => {
        const dataRefs: TableChangeDataRef[] = createTableChangeDataRefs(table, changes);
        for (const dataRef of dataRefs) {
          console.log(`Reference: ${dataRef.ref}`);
          console.log(`Value: ${dataRef.value}`);
          // Output:
          // Reference: {"dataDef":"employees","valueField":"NAME","keyFields":{"EMPLOYEE_ID":1}}
          // Value: John Doe
        }
      });

    this.fit = signal(tableDesigner);
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
    this.fit.set(createTableDesigner(createTable4Dto(this.fit().table as unknown as FitTableDto)));
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
