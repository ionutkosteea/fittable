import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { ContentTitle } from './common/content-title.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly activeContent$: Subject<ContentTitle> = new Subject();
  public activeContent: ContentTitle = 'Introduction';
  private subscription?: Subscription;

  public ngOnInit(): void {
    this.subscription = this.activeContent$.subscribe(
      (content: ContentTitle): void => {
        this.activeContent = content;
      }
    );
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
