import { FittableDesigner } from 'fittable-core/view-model';

import { TopicTitle } from '../../../common/topic-title.model';
import { CodeSnippet } from '../../common/code-snippet.model';

export interface Button {
  disabled?: 'disabled';
  getLabel(): string;
  run(): void;
}

export interface ConsoleTopic {
  title: TopicTitle;
  htmlCode: CodeSnippet[];
  typescriptCode: CodeSnippet[];
  buttons: Button[];
  fit: FittableDesigner;
  getConsoleText(): string;
}
