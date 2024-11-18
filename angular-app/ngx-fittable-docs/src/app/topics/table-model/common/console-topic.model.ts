import { ElementRef } from '@angular/core';

import { createTable4Dto } from 'fittable-core/model';
import { TableDesigner } from 'fittable-core/view-model';
import { FitTableDto } from 'fittable-model';

import { TopicTitle } from '../../../common/topic-title.model';
import { CodeSnippet } from '../../common/code-snippet.model';

export abstract class ConsoleTopic {
  public abstract title: TopicTitle;
  public abstract htmlCode: CodeSnippet[];
  public abstract typescriptCode: CodeSnippet[];
  public abstract fit: TableDesigner;
  public abstract console: ElementRef;
  public fitTableDto?: unknown;
  public isConsoleDisabled = false;

  public getConsoleText(): string {
    return JSON.stringify(this.fitTableDto, null, 2);
  }

  public consoleTextAsDto(): FitTableDto | undefined {
    try {
      return JSON.parse(this.console.nativeElement.value) as FitTableDto;
    } catch (error: unknown) {
      this.console.nativeElement.value = this.getConsoleText();
      alert(error);
      return undefined;
    }
  }

  public onLoadDto(): void {
    const tableDto: FitTableDto | undefined = this.consoleTextAsDto();
    if (tableDto) {
      this.fit.loadTable(createTable4Dto(tableDto));
      this.fitTableDto = tableDto;
    }
  }
}
