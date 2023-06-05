import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableLeftTopCornerComponent } from './table-view/table-left-top-corner/table-left-top-corner.component';
import { TableTopComponent } from './table-view/table-top/table-top.component';
import { TableLeftComponent } from './table-view/table-left/table-left.component';
import { TableCenterComponent } from './table-view/table-center/table-center.component';
import { FittableComponent } from './fittable.component';
import { ScrollContainerDirective } from './table-view/common/scroll-container.directive';
import { CellSelectionDirective } from './table-view/common/cell-selection.directive';
import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { ButtonComponent } from './controls-view/button/button.component';
import { ComboComponent } from './controls-view/combo/combo.component';
import { InputComponent } from './controls-view/input/input.component';
import { PopUpButtonComponent } from './controls-view/pop-up-button/pop-up-button.component';
import { ColorPickerComponent } from './controls-view/color-picker/color-picker.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';
import { MenuItemComponent } from './controls-view/context-menu/menu-item/menu-item.component';
import { BorderPopUpButtonComponent } from './controls-view/border-pop-up/border-pop-up.component';
import { BorderTypeComponent } from './controls-view/border-pop-up/border-type/border-type.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { CellEditorOpenDirective } from './controls-view/cell-editor/cell-editor.directive';
import { CellEditorComponent } from './controls-view/cell-editor/cell-editor.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { SettingsButtonComponent } from './controls-view/settings-bar/settings-button/settings-button.component';
import {
  FilterPopupButtonComponent,
  FilterPopupWindowComponent,
} from './controls-view/filter-pop-up/filter-pop-up.component';
import { TableComponent } from './table-view/table.component';

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
    PopUpButtonComponent,
    ColorPickerComponent,
    ContextMenuComponent,
    MenuItemComponent,
    BorderPopUpButtonComponent,
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
