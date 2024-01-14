import { NgModule } from '@angular/core';

import { FittableComponent } from './fittable.component';
import { ToolbarComponent } from './controls-view/toolbar/toolbar.component';
import { SettingsBarComponent } from './controls-view/settings-bar/settings-bar.component';
import { StatusbarComponent } from './controls-view/statusbar/statusbar.component';
import { ContextMenuComponent } from './controls-view/context-menu/context-menu.component';
import { TableComponent } from './table-view/table.component';

@NgModule({
  imports: [
    FittableComponent,
    ToolbarComponent,
    SettingsBarComponent,
    StatusbarComponent,
    ContextMenuComponent,
    TableComponent,
  ],
  exports: [
    FittableComponent,
    ToolbarComponent,
    SettingsBarComponent,
    StatusbarComponent,
    ContextMenuComponent,
    TableComponent,
  ],
})
export class FittableModule {}
