import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgxFittableModule } from 'ngx-fittable';

import { AppComponent } from './app.component';
import { QuickStartComponent } from './paragraphs/quick-start.component';

@NgModule({
  declarations: [AppComponent, QuickStartComponent],
  imports: [BrowserModule, NgxFittableModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
