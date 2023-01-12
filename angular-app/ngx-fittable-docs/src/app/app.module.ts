import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerModelConfig } from 'fit-core/model';
import { registerOperationConfig } from 'fit-core/operations';
import { FIT_MODEL_CONFIG } from 'fit-model';
import { FIT_OPERATION_CONFIG } from 'fit-model-operations';
import { NgxFittableModule } from 'ngx-fittable';

import { AppComponent } from './app.component';
import { NavigationTreeComponent } from './navigation-tree/navigation-tree.component';
import { IntroductionComponent } from './content/introduction/introduction.component';
import { RowHeaderComponent } from './content/row-header/row-header.component';
import { RowHeightComponent } from './content/row-height/row-height.component';
import { ColumnHeaderComponent } from './content/column-header/column-header.component';
import { ColumnWidthtComponent } from './content/column-width/column-width.component';
import { CellValueComponent } from './content/cell-value/cell-value.component';
import { CellStyleComponent } from './content/cell-style/cell-style.component';
import { CellMergeComponent } from './content/cell-merge/cell-merge.component';
import { TableDtoComponent } from './content/table-dto/table-dto.component';

registerModelConfig(FIT_MODEL_CONFIG);
registerOperationConfig(FIT_OPERATION_CONFIG);

@NgModule({
  declarations: [
    AppComponent,
    NavigationTreeComponent,
    IntroductionComponent,
    RowHeaderComponent,
    RowHeightComponent,
    ColumnHeaderComponent,
    ColumnWidthtComponent,
    CellValueComponent,
    CellStyleComponent,
    CellMergeComponent,
    TableDtoComponent,
  ],
  imports: [BrowserModule, NgxFittableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
