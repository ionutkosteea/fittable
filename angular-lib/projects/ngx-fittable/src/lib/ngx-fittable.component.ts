import { Observable, Subscription } from 'rxjs';
import {
  AfterViewInit,
  Component,
  ComponentRef,
  Input,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

import { ViewModel, HostListeners } from 'fit-core/view-model/index.js';

import { TableViewComponent } from './table-view/table-view.component';
import { FittableBuidler } from './fittable-builder';

@Component({
  selector: 'fittable',
  template: '<ng-template #content></ng-template>',
})
export class NgxFittableComponent implements AfterViewInit, OnDestroy {
  @Input() builder: FittableBuidler = new FittableBuidler();
  @Input() refreshView$?: Observable<void>;

  @ViewChild('content', { read: ViewContainerRef })
  vcr!: ViewContainerRef;
  ref!: ComponentRef<TableViewComponent>;

  private subscription?: Subscription;

  public ngAfterViewInit(): void {
    this.createView();
    this.subscription = this.refreshView$?.subscribe((): void => {
      this.createView();
    });
  }

  private async createView(): Promise<void> {
    await this.builder.build();
    this.removeTableViewComponent();
    this.createTableViewComponent(
      this.builder.getViewModel(),
      this.builder.getHostListeners()
    );
  }

  private removeTableViewComponent(): void {
    if (!this.ref) return;
    const index = this.vcr.indexOf(this.ref.hostView);
    if (index != -1) this.vcr.remove(index);
  }

  private createTableViewComponent(
    viewModel: ViewModel,
    hostListeners: HostListeners
  ): void {
    this.ref = this.vcr.createComponent(TableViewComponent);
    this.ref.setInput('viewModel', viewModel);
    this.ref.setInput('hostListeners', hostListeners);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
