import { Subject, Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { TreeNodeSelectEvent } from 'primeng/tree';

import { TopicTitle } from '../common/topic-title.model';

export interface Composite {
  label: string;
  isExpended: boolean;
  leafs: TopicTitle[];
}

@Component({
  selector: 'navigation-tree',
  templateUrl: './navigation-tree.component.html',
  styleUrls: ['./navigation-tree.component.css'],
})
export class NavigationTreeComponent implements OnInit, OnDestroy {
  @Input() treeSelection$: Subject<TreeNode<TopicTitle>> = new Subject();
  public tree: TreeNode<TopicTitle>[];
  public treeSelection: TreeNode<TopicTitle> | TreeNode<TopicTitle>[] | null;
  private firstSelection: TreeNode<TopicTitle>;
  private subscription?: Subscription;

  constructor() {
    this.firstSelection = { label: 'Introduction' };
    this.treeSelection = this.firstSelection;
    this.tree = this.createTree();
  }

  public ngOnInit(): void {
    this.subscription = this.treeSelection$.subscribe(
      (selection: TreeNode<TopicTitle>): void => {
        this.treeSelection = selection;
      }
    );
  }

  public onNodeSelect(event: TreeNodeSelectEvent): void {
    if (event.node.children) {
      event.node.expanded = !event.node.expanded;
    } else {
      this.treeSelection$.next(event.node);
    }
  }

  public ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  private createTree(): TreeNode<TopicTitle>[] {
    return [
      {
        label: 'Getting started',
        expanded: true,
        children: [
          this.firstSelection,
          { label: 'Playground' },
          { label: 'Architecture' },
          { label: 'Installation' },
        ],
      },
      {
        label: 'Table model',
        children: [
          { label: 'Row height' },
          { label: 'Column width' },
          { label: 'Cell value' },
          { label: 'Cell data-type' },
          { label: 'Cell style' },
          { label: 'Cell merge' },
          { label: 'Table DTO' },
          { label: 'Custom table' },
        ],
      },
      {
        label: 'Table operations',
        children: [
          { label: 'Update style' },
          { label: 'Paint format' },
          { label: 'Resize rows' },
          { label: 'Insert rows above' },
          { label: 'Insert rows below' },
          { label: 'Remove rows' },
          { label: 'Resize columns' },
          { label: 'Insert columns left' },
          { label: 'Insert columns right' },
          { label: 'Remove columns' },
          { label: 'Cell values' },
          { label: 'Cell data-types' },
          { label: 'Clear cells' },
          { label: 'Remove cells' },
          { label: 'Cut / Paste cells' },
          { label: 'Copy / Paste cells' },
          { label: 'Merge cells' },
          { label: 'Unmerge cells' },
          { label: 'Table changes' },
          { label: 'Custom operation' },
          { label: 'Table interoperability' },
        ],
      },
      {
        label: 'Table designer',
        children: [
          { label: 'Row header' },
          { label: 'Column header' },
          { label: 'Row heights' },
          { label: 'Column widths' },
          { label: 'Column filters (1/2)' },
          { label: 'Column filters (2/2)' },
          { label: 'Cell selection' },
          { label: 'Cell editor' },
          { label: 'Table scroll container' },
          { label: 'Language dictionary' },
          { label: 'Image registry' },
          { label: 'Theme switcher' },
          { label: 'Settings bar' },
          { label: 'Toolbar' },
          { label: 'Context menu' },
          { label: 'Statusbar' },
          { label: 'Custom view model' },
          { label: 'Custom view' },
        ],
      },
    ];
  }
}
