import { Subject, Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

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

  @ViewChild('content') htmlContent!: ElementRef;

  public ngOnInit(): void {
    this.subscription = this.activeContent$.subscribe(
      (content: TopicTitle): void => {
        this.activeContent = content;
        this.htmlContent.nativeElement.scrollTop = 0;
      }
    );
  }

  public onNpmJs(): void {
    window.open('https://www.npmjs.com/package/fittable-angular', '_blank');
  }

  public onGitHub(): void {
    window.open('https://github.com/ionutkosteea/fittable.git', '_blank');
  }

  public onContact(): void {
    window.open('mailto:ionut.kosteea@gmail.com');
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
