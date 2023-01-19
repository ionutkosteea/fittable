import { FittableDesigner } from 'fit-core/view-model';

import { CodeSnippet } from './code-snippet.model';
import { TopicTitle } from '../../common/topic-title.model';

export interface SimpleTopic {
  title: TopicTitle;
  fit: FittableDesigner;
  htmlCode: CodeSnippet[];
  typescriptCode: CodeSnippet[];
}
