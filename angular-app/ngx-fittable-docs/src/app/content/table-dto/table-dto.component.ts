import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { createTable4Dto } from 'fit-core/model';
import {
  createFittableViewer,
  FittableViewer,
  registerViewModelConfig,
} from 'fit-core/view-model';
import { FitTableDto } from 'fit-model';
import { FIT_VIEW_MODEL_CONFIG } from 'fit-view-model';
import { ContentTitle } from 'src/app/common/content-title.model';

let fitTableDto: FitTableDto = {
  numberOfRows: 50,
  numberOfColumns: 10,
  rows: {
    1: {
      cells: {
        1: { value: '[1,1]' },
        2: { value: '[1,2]' },
        3: { value: '[1,3]' },
      },
    },
    2: {
      cells: {
        1: { value: '[2,1]' },
        2: { value: '[2,2]' },
        3: { value: '[2,3]' },
      },
    },
    3: {
      cells: {
        1: { value: '[3,1]' },
        2: { value: '[3,2]' },
        3: { value: '[3,3]' },
      },
    },
  },
};

@Component({
  selector: 'table-dto',
  templateUrl: './table-dto.component.html',
  styleUrls: ['./table-dto.component.css', '../common/common.css'],
})
export class TableDtoComponent implements OnInit {
  @ViewChild('console') console!: ElementRef;

  public readonly title: ContentTitle = 'Table DTO';
  public fit!: FittableViewer;

  public getDtoText(): string {
    return JSON.stringify(fitTableDto, null, 2);
  }

  public consoleTextAsDto(): FitTableDto | undefined {
    try {
      return JSON.parse(this.console.nativeElement.value) as FitTableDto;
    } catch (error: unknown) {
      this.console.nativeElement.value = this.getDtoText();
      alert(error);
      return undefined;
    }
  }

  public ngOnInit(): void {
    registerViewModelConfig(FIT_VIEW_MODEL_CONFIG);
    this.fit = createFittableViewer(createTable4Dto(fitTableDto));
  }

  public onLoadDto(): void {
    const tableDto: FitTableDto | undefined = this.consoleTextAsDto();
    if (tableDto) {
      this.fit.loadTable(createTable4Dto(tableDto));
      fitTableDto = tableDto;
    }
  }
}
