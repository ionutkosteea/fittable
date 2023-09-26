import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableLeftTopCornerComponent } from './table-view/table-left-top-corner/table-left-top-corner.component';
import { TableTopComponent } from './table-view/table-top/table-top.component';
import { TableLeftComponent } from './table-view/table-left/table-left.component';
import { TableCenterComponent } from './table-view/table-center/table-center.component';
import { FittableComponent } from './fittable.component';
import { ScrollContainerDirective } from './controls-view/common/scroll-container.directive';
import { CellSelectionDirective } from './table-view/common/cell-selection.directive';
import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { ButtonComponent } from './controls-view/button/button.component';
import { ComboComponent } from './controls-view/combo/combo.component';
import { InputComponent } from './controls-view/input/input.component';
import { PopupButtonComponent } from './controls-view/popup-button/popup-button.component';
import { ColorPickerComponent } from './controls-view/color-picker/color-picker.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';
import { BorderPopupButtonComponent } from './controls-view/border-popup/border-popup.component';
import { BorderTypeComponent } from './controls-view/border-popup/border-type/border-type.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { CellEditorOpenDirective } from './controls-view/cell-editor/cell-editor.directive';
import { CellEditorComponent } from './controls-view/cell-editor/cell-editor.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { SettingsButtonComponent } from './controls-view/settings-bar/settings-button/settings-button.component';
import {
  FilterPopupButtonComponent,
  FilterPopupWindowComponent,
} from './controls-view/filter-popup/filter-popup.component';
import { TableComponent } from './table-view/table.component';
import { ContextMenuButtonComponent } from './controls-view/context-menu/context-menu-button.component';

@NgModule({
  declarations: [
    TableLeftTopCornerComponent,
    TableTopComponent,
    TableLeftComponent,
    TableCenterComponent,
    FittableComponent,
    ScrollContainerDirective,
    CellSelectionDirective,
    ToolbarComponent,
    ButtonComponent,
    ComboComponent,
    InputComponent,
    PopupButtonComponent,
    ColorPickerComponent,
    ContextMenuComponent,
    ContextMenuButtonComponent,
    BorderPopupButtonComponent,
    BorderTypeComponent,
    StatusbarComponent,
    CellEditorOpenDirective,
    CellEditorComponent,
    SettingsBarComponent,
    SettingsButtonComponent,
    FilterPopupButtonComponent,
    FilterPopupWindowComponent,
    TableComponent,
  ],
  imports: [CommonModule],
  providers: [],
  bootstrap: [],
  exports: [
    FittableComponent,
    ToolbarComponent,
    TableComponent,
    StatusbarComponent,
    SettingsBarComponent,
    ContextMenuComponent,
  ],
})
export class FittableModule {}
