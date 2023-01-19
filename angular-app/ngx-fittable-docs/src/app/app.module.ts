import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxFittableModule } from 'ngx-fittable';

import { AppComponent } from './app.component';
import { NavigationTreeComponent } from './navigation-tree/navigation-tree.component';
import { IntroductionComponent } from './topics/getting-started/introduction/introduction.component';
import { RowHeaderComponent } from './topics/table-model/row-header.component';
import { RowHeightComponent } from './topics/table-model/row-height.component';
import { ColumnHeaderComponent } from './topics/table-model/column-header.component';
import { ColumnWidthtComponent } from './topics/table-model/column-width.component';
import { CellValueComponent } from './topics/table-model/cell-value.component';
import { CellStyleComponent } from './topics/table-model/cell-style.component';
import { CellMergeComponent } from './topics/table-model/cell-merge.component';
import { TableDtoComponent } from './topics/table-model/table-dto.component';
import { CustomTableComponent } from './topics/table-model/custom-table.component';
import { UpdateStyleComponent } from './topics/table-operations/update-style.component';
import { PaintFormatComponent } from './topics/table-operations/paint-format.component';
import { ResizeRowsComponent } from './topics/table-operations/resize-rows.component';
import { InsertRowsAboveComponent } from './topics/table-operations/insert-rows-above.component';
import { InsertRowsBelowComponent } from './topics/table-operations/insert-rows-below.component';
import { RemoveRowsComponent } from './topics/table-operations/remove-rows.component';
import { ResizeColumnsComponent } from './topics/table-operations/resize-columns.component';
import { InsertColumnsLeftComponent } from './topics/table-operations/insert-columns-left.component';
import { InsertColumnsRightComponent } from './topics/table-operations/insert-columns-right.component';
import { RemoveColumnsComponent } from './topics/table-operations/remove-columns.component';
import { ClearCellsComponent } from './topics/table-operations/clear-cells.component';
import { CellValuesComponent } from './topics/table-operations/cell-values.component';
import { RemoveCellsComponent } from './topics/table-operations/remove-cells.component';
import { CutPasteCellsComponent } from './topics/table-operations/cut-paste-cells.component';
import { CopyPasteCellsComponent } from './topics/table-operations/copy-paste-cells.component';
import { MergeCellsComponent } from './topics/table-operations/merge-cells.component';
import { UnmergeCellsComponent } from './topics/table-operations/unmerge-cells.component';
import { OperationDtoComponent } from './topics/table-operations/operation-dto.component';
import { CustomOperationComponent } from './topics/table-operations/custom-operation.component';
import { TableScrollerComponent } from './topics/table-designer/table-scroller.component';
import { CellSelectionComponent } from './topics/table-designer/cell-selection.component';
import { CellEditorComponent } from './topics/table-designer/cell-editor.component';
import { LanguageDictionaryComponent } from './topics/table-designer/language-dictionary.component';
import { ImageRegistryComponent } from './topics/table-designer/image-registry.component';
import { ThemeSwitcherComponent } from './topics/table-designer/theme-switcher.component';
import { SettingsBarComponent } from './topics/table-designer/settings-bar.component';
import { ToolbarComponent } from './topics/table-designer/toolbar.component';
import { ContextMenuComponent } from './topics/table-designer/context-menu.component';
import { StatusbarComponent } from './topics/table-designer/statusbar.component';
import { CustomViewModelComponent } from './topics/table-designer/custom-view-model.component';
import { ArchitectureComponent } from './topics/getting-started/architecture/architecture.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationTreeComponent,
    IntroductionComponent,
    ArchitectureComponent,
    RowHeaderComponent,
    RowHeightComponent,
    ColumnHeaderComponent,
    ColumnWidthtComponent,
    CellValueComponent,
    CellStyleComponent,
    CellMergeComponent,
    TableDtoComponent,
    CustomTableComponent,
    UpdateStyleComponent,
    PaintFormatComponent,
    ResizeRowsComponent,
    InsertRowsAboveComponent,
    InsertRowsBelowComponent,
    RemoveRowsComponent,
    ResizeColumnsComponent,
    InsertColumnsLeftComponent,
    InsertColumnsRightComponent,
    RemoveColumnsComponent,
    ClearCellsComponent,
    CellValuesComponent,
    RemoveCellsComponent,
    CutPasteCellsComponent,
    CopyPasteCellsComponent,
    MergeCellsComponent,
    UnmergeCellsComponent,
    OperationDtoComponent,
    CustomOperationComponent,
    TableScrollerComponent,
    CellSelectionComponent,
    CellEditorComponent,
    LanguageDictionaryComponent,
    ImageRegistryComponent,
    ThemeSwitcherComponent,
    SettingsBarComponent,
    ToolbarComponent,
    ContextMenuComponent,
    StatusbarComponent,
    CustomViewModelComponent,
  ],
  imports: [BrowserModule, NgxFittableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
