import { FittableDesigner } from 'fit-core/view-model';

import { TopicTitle } from '../../../common/topic-title.model';
import { CodeSnippet } from '../../common/code-snippet.model';

export abstract class ConsoleTopic {
  public abstract title: TopicTitle;
  public abstract htmlCode: CodeSnippet[];
  public abstract typescriptCode: CodeSnippet[];
  public abstract consoleText: string;
  public abstract buttonText: string;
  public abstract fit: FittableDesigner;
  public abstract runOperation(): void;

  public undo(): void {
    this.fit.operationExecutor?.undo();
  }

  public redo(): void {
    this.fit.operationExecutor?.redo();
  }
}
