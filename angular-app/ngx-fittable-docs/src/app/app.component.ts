import { Subject, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { TopicTitle } from './common/topic-title.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly activeContent$: Subject<TopicTitle> = new Subject();
  public activeContent: TopicTitle = 'Introduction';
  private subscription?: Subscription;

  public ngOnInit(): void {
    this.subscription = this.activeContent$.subscribe(
      (content: TopicTitle): void => {
        this.activeContent = content;
      }
    );
  }

  public onContactClick(): void {
    window.open('mailto:ionut.kosteea@gmail.com');
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
