import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableLeftTopCornerComponent } from './table-view/table-left-top-corner/table-left-top-corner.component';
import { TableTopComponent } from './table-view/table-top/table-top.component';
import { TableLeftComponent } from './table-view/table-left/table-left.component';
import { TableCenterComponent } from './table-view/table-center/table-center.component';
import { TableViewComponent } from './table-view/table-view.component';
import { TableScrollerDirective } from './table-view/common/table-scroller.directive';
import { CellSelectionDirective } from './table-view/common/cell-selection.directive';
import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { ButtonComponent } from './controls-view/button/button.component';
import { ComboComponent } from './controls-view/combo/combo.component';
import { InputComponent } from './controls-view/input/input.component';
import { PopUpButtonComponent } from './controls-view/pop-up-button/pop-up-button.component';
import { ColorPickerComponent } from './controls-view/color-picker/color-picker.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';
import { MenuItemComponent } from './controls-view/context-menu/menu-item/menu-item.component';
import { BorderPopUpButtonComponent } from './controls-view/border-pop-up-botton/border-pop-up-button.component';
import { BorderTypeComponent } from './controls-view/border-pop-up-botton/border-type/border-type.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { CellEditorOpenDirective } from './controls-view/cell-editor/cell-editor.directive';
import { CellEditorComponent } from './controls-view/cell-editor/cell-editor.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { SettingsButtonComponent } from './controls-view/settings-bar/settings-button/settings-button.component';
import { NgxFittableComponent } from './ngx-fittable.component';

@NgModule({
  declarations: [
    TableLeftTopCornerComponent,
    TableTopComponent,
    TableLeftComponent,
    TableCenterComponent,
    TableViewComponent,
    TableScrollerDirective,
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
    NgxFittableComponent,
  ],
  imports: [CommonModule],
  providers: [],
  bootstrap: [],
  exports: [NgxFittableComponent],
})
export class NgxFittableModule {}
