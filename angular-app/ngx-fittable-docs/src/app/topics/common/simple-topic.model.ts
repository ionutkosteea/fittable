import { TableDesigner } from 'fittable-core/view-model';

import { CodeSnippet } from './code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';

export interface SimpleTopic {
  title: TopicTitle;
  fit: TableDesigner;
  htmlCode: CodeSnippet[];
  typescriptCode: CodeSnippet[];
}
