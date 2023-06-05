import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { registerModelConfig } from 'fittable-core/model';
import { registerOperationConfig } from 'fittable-core/operations';
import { registerViewModelConfig } from 'fittable-core/view-model';
import { FIT_MODEL_CONFIG } from 'fittable-model';
import { FIT_OPERATION_CONFIG } from 'fittable-model-operations';
import { FIT_VIEW_MODEL_CONFIG } from 'fittable-view-model';
import { FittableModule } from 'fittable-angular';

import { AppComponent } from './app.component';

// Register functionalities
registerModelConfig(FIT_MODEL_CONFIG);
registerOperationConfig(FIT_OPERATION_CONFIG);
registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FittableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
