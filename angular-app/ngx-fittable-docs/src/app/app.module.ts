import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { TreeModule } from 'primeng/tree';
import { SidebarModule } from 'primeng/sidebar';

import { FittableModule } from 'fittable-angular';

import { AppComponent } from './app.component';
import { NavigationTreeComponent } from './navigation-tree/navigation-tree.component';
import { IntroductionComponent } from './topics/getting-started/introduction/introduction.component';
import { PlaygroundComponent } from './topics/getting-started/playground/playground.component';
import { RowHeightComponent } from './topics/table-model/row-height.component';
import { ColWidthtComponent } from './topics/table-model/col-width.component';
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
import { ResizeColsComponent } from './topics/table-operations/resize-cols.component';
import { InsertColsLeftComponent } from './topics/table-operations/insert-cols-left.component';
import { InsertColsRightComponent } from './topics/table-operations/insert-cols-right.component';
import { RemoveColsComponent } from './topics/table-operations/remove-cols.component';
import { ClearCellsComponent } from './topics/table-operations/clear-cells.component';
import { CellValuesComponent } from './topics/table-operations/cell-values.component';
import { RemoveCellsComponent } from './topics/table-operations/remove-cells.component';
import { CutPasteCellsComponent } from './topics/table-operations/cut-paste-cells.component';
import { CopyPasteCellsComponent } from './topics/table-operations/copy-paste-cells.component';
import { MergeCellsComponent } from './topics/table-operations/merge-cells.component';
import { UnmergeCellsComponent } from './topics/table-operations/unmerge-cells.component';
import { OperationDtoComponent } from './topics/table-operations/operation-dto.component';
import { CustomOperationComponent } from './topics/table-operations/custom-operation.component';
import { RowHeaderComponent } from './topics/table-designer/row-header.component';
import { ColHeaderComponent } from './topics/table-designer/col-header.component';
import { RowHeightsComponent } from './topics/table-designer/row-heights.component';
import { ColWidthtsComponent } from './topics/table-designer/col-widths.component';
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
import { ColFiltersComponent } from './topics/table-designer/col-filters.component';
import { ColFilterExecutorComponent } from './topics/table-designer/col-filter-executor.component';
import { TableInteroperabilityComponent } from './topics/table-operations/table-interoperability/table-interoperability.component';
import { InstallationComponent } from './topics/getting-started/installation/installation.component';
import { CustomViewComponent } from './topics/table-designer/custom-view/custom-view.component';
import { CustomContextMenuComponent } from './topics/table-designer/custom-view/custom-context-menu.component';
import { CustomToolbarComponent } from './topics/table-designer/custom-view/custom-toolbar.component';
import { CustomStatusbarComponent } from './topics/table-designer/custom-view/custom-statusbar.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationTreeComponent,
    IntroductionComponent,
    PlaygroundComponent,
    ArchitectureComponent,
    InstallationComponent,
    RowHeightComponent,
    ColWidthtComponent,
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
    ResizeColsComponent,
    InsertColsLeftComponent,
    InsertColsRightComponent,
    RemoveColsComponent,
    ClearCellsComponent,
    CellValuesComponent,
    RemoveCellsComponent,
    CutPasteCellsComponent,
    CopyPasteCellsComponent,
    MergeCellsComponent,
    UnmergeCellsComponent,
    OperationDtoComponent,
    CustomOperationComponent,
    RowHeaderComponent,
    ColHeaderComponent,
    RowHeightsComponent,
    ColWidthtsComponent,
    ColFiltersComponent,
    ColFilterExecutorComponent,
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
    TableInteroperabilityComponent,
    CustomViewComponent,
    CustomContextMenuComponent,
    CustomToolbarComponent,
    CustomStatusbarComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToolbarModule,
    ButtonModule,
    TreeModule,
    SidebarModule,
    FittableModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
