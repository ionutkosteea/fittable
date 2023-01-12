import { Subject, Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { ContentTitle } from '../common/content-title.model';

export interface Composite {
  label: string;
  isExpended: boolean;
  leafs: ContentTitle[];
}

@Component({
  selector: 'navigation-tree',
  templateUrl: './navigation-tree.component.html',
  styleUrls: ['./navigation-tree.component.css'],
})
export class NavigationTreeComponent implements OnInit, OnDestroy {
  @Input() clickedLeaf$: Subject<ContentTitle> = new Subject();
  public tree: Composite[] = createTree();
  public clickedLeaf: ContentTitle = 'Introduction';
  private subscription?: Subscription;

  public ngOnInit(): void {
    this.subscription = this.clickedLeaf$.subscribe(
      (leaf: ContentTitle): void => {
        this.clickedLeaf = leaf;
      }
    );
  }

  public onCompositeClick(composite: Composite): void {
    composite.isExpended = !composite.isExpended;
  }

  public onLeafClick(leaf: ContentTitle): void {
    this.clickedLeaf$.next(leaf);
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

function createTree(): Composite[] {
  return [
    {
      label: 'Getting started',
      isExpended: true,
      leafs: ['Introduction', 'Installation'],
    },
    {
      label: 'Table model',
      isExpended: false,
      leafs: [
        'Row header',
        'Row height',
        'Column header',
        'Column width',
        'Cell value',
        'Cell style',
        'Cell merge',
        'Table DTO',
        'Table configuration',
      ],
    },
    {
      label: 'Table operations',
      isExpended: false,
      leafs: [
        'Update style',
        'Paint format',
        'Resize rows',
        'Insert rows above',
        'Insert rows below',
        'Remove rows',
        'Resize columns',
        'Insert columns above',
        'Insert columns below',
        'Remove columns',
        'Clear cells',
        'Remove cells',
        'Cut cells',
        'Copy cells',
        'Paste cells',
        'Merge cells',
        'Merge cells',
        'Unmerge cells',
        'Undo',
        'Redo',
        'Operation DTO',
        'Operation configuration',
      ],
    },
    {
      label: 'Table viewer',
      isExpended: false,
      leafs: [
        'Language dictionary',
        'Image registry',
        'Table viewer',
        'Table scroller',
        'Cell selection',
        'Cell editor',
        'Theme switcher',
        'Settings bar',
        'Toolbar',
        'Context menu',
        'Statusbar',
        'View model configuration',
      ],
    },
  ];
}
