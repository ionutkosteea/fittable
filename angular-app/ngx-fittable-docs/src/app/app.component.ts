import { Subject, Subscription } from 'rxjs';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { TreeNode } from 'primeng/api';

import { TopicTitle } from './common/topic-title.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  public readonly activeTopic$: Subject<TreeNode<TopicTitle>> = new Subject();
  public activeTopic: TopicTitle = 'Introduction';
  public showSidebar = false;
  private subscription?: Subscription;

  @ViewChild('main') topicRef!: ElementRef;

  public ngOnInit(): void {
    this.subscription = this.activeTopic$.subscribe(
      (title: TreeNode<TopicTitle>): void => {
        this.activeTopic = title.label as TopicTitle;
        this.topicRef.nativeElement.scrollTop = 0;
        if (this.showSidebar) this.showSidebar = false;
      }
    );
  }

  public onHamburgerClick(): void {
    this.showSidebar = !this.showSidebar;
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
