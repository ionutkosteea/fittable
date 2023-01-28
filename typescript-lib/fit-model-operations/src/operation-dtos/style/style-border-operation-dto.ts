import {
  Table,
  Style,
  createStyle,
  CellRange,
  TableStyles,
} from 'fit-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fit-core/operations/index.js';

import { appendStyleStepsDto } from '../../utils/style/style-dto-functions.js';
import { CellRangeAddressStyles } from '../../utils/cell/cell-range-address-styles.js';
import { getMaxStyleNameUid } from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';
import { StyleUpdateOperationDtoBuilder } from './style-update-operation-dto.js';

export type BorderLocation =
  | 'none'
  | 'all'
  | 'around'
  | 'cross'
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';

export type BorderType = 'solid' | 'dotted' | 'dashed';

export type BorderStyle = {
  location: BorderLocation;
  thickness: number;
  type: BorderType;
  color: string;
};

export type StyleBorderOperationDtoArgs = OperationId<'style-border'> & {
  selectedCells: CellRange[];
  borderStyle: BorderStyle;
};

export type BorderName =
  | 'border-left'
  | 'border-top'
  | 'border-right'
  | 'border-bottom';

export class StyleBorderOperationDtoBuilder {
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  private readonly operationDto: OperationDto;

  private newBorders: CellRangeAddressStyles = new CellRangeAddressStyles();

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleBorderOperationDtoArgs
  ) {
    this.operationDto = {
      id: args.id,
      steps: [this.styleStepDto],
      undoOperation: { steps: [this.undoStyleStepDto] },
    };
  }

  public build(): OperationDto {
    this.prepareNewBorders();
    this.defineBorderStyles();
    return this.operationDto;
  }

  private prepareNewBorders(): void {
    const location: BorderLocation = this.args.borderStyle.location;
    if (location === 'none') this.prepareBordersNone();
    else if (location === 'all') this.prepareBordersAll();
    else if (location === 'around') this.prepareBordersArround();
    else if (location === 'cross') this.prepareBordersCross();
    else if (location === 'left') this.prepareBordersLeft();
    else if (location === 'center') this.prepareBordersCenter();
    else if (location === 'right') this.prepareBordersRight();
    else if (location === 'top') this.prepareBordersTop();
    else if (location === 'middle') this.prepareBordersMiddle();
    else if (location === 'bottom') this.prepareBordersBottom();
  }

  private prepareBordersBottom(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        if (cellRange.getTo().getRowId() === rowId) {
          this.setBorder(rowId, colId, this.createBorderStyle('border-bottom'));
        }
      });
    }
  }

  private createBorderStyle(name: BorderName): Style {
    return createStyle().set(name, this.borderValueAsCss());
  }

  private prepareBordersTop(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        if (cellRange.getFrom().getRowId() === rowId) {
          this.setBorder(rowId, colId, this.createBorderStyle('border-top'));
        }
      });
    }
  }

  private prepareBordersRight(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        if (cellRange.getTo().getColId() === colId) {
          this.setBorder(rowId, colId, this.createBorderStyle('border-right'));
        }
      });
    }
  }

  private prepareBordersLeft(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        if (cellRange.getFrom().getColId() === colId) {
          this.setBorder(rowId, colId, this.createBorderStyle('border-left'));
        }
      });
    }
  }

  private prepareBordersMiddle(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        const style: Style = this.createBordersMiddleStyle(cellRange, rowId);
        if (Object.keys(style).length > 0) {
          this.setBorder(rowId, colId, style);
        }
      });
    }
  }

  private createBordersMiddleStyle(cellRange: CellRange, rowId: number): Style {
    const style: Style = createStyle();
    if (cellRange.getFrom().getRowId() === rowId) {
      style.set('border-bottom', this.borderValueAsCss());
    } else if (cellRange.getTo().getRowId() === rowId) {
      style.set('border-top', this.borderValueAsCss());
    } else {
      style
        .set('border-top', this.borderValueAsCss())
        .set('border-bottom', this.borderValueAsCss());
    }
    return style;
  }

  private prepareBordersCenter(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        const style: Style = this.createBordersCenterStyle(cellRange, colId);
        if (Object.keys(style).length > 0) {
          this.setBorder(rowId, colId, style);
        }
      });
    }
  }

  private createBordersCenterStyle(cellRange: CellRange, colId: number): Style {
    const style: Style = createStyle();
    if (cellRange.getFrom().getColId() === colId) {
      style.set('border-right', this.borderValueAsCss());
    } else if (cellRange.getTo().getColId() === colId) {
      style.set('border-left', this.borderValueAsCss());
    } else {
      style
        .set('border-left', this.borderValueAsCss())
        .set('border-right', this.borderValueAsCss());
    }
    return style;
  }

  private prepareBordersCross(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        const center: Style = this.createBordersCenterStyle(cellRange, colId);
        const middle: Style = this.createBordersMiddleStyle(cellRange, rowId);
        const style: Style = center.append(middle);
        if (Object.keys(style).length > 0) {
          this.setBorder(rowId, colId, style);
        }
      });
    }
  }

  private prepareBordersArround(): void {
    for (const cellRange of this.args.selectedCells) {
      cellRange.forEachCell((rowId: number, colId: number) => {
        const style: Style = createStyle();
        if (cellRange.getFrom().getColId() === colId) {
          style.set('border-left', this.borderValueAsCss());
        }
        if (cellRange.getFrom().getRowId() === rowId) {
          style.set('border-top', this.borderValueAsCss());
        }
        if (cellRange.getTo().getColId() === colId) {
          style.set('border-right', this.borderValueAsCss());
        }
        if (cellRange.getTo().getRowId() === rowId) {
          style.set('border-bottom', this.borderValueAsCss());
        }
        this.setBorder(rowId, colId, style);
      });
    }
  }

  private setBorder(rowId: number, colId: number, style: Style): void {
    return this.newBorders.set(style, rowId, colId);
  }

  private prepareBordersAll(): void {
    const style: Style = createStyle()
      .set('border-left', this.borderValueAsCss())
      .set('border-top', this.borderValueAsCss())
      .set('border-right', this.borderValueAsCss())
      .set('border-bottom', this.borderValueAsCss());
    this.newBorders = new CellRangeAddressStyles({
      style,
      address: this.args.selectedCells,
    });
  }

  private prepareBordersNone(): void {
    const style: Style = createStyle()
      .set('border-left', undefined)
      .set('border-top', undefined)
      .set('border-right', undefined)
      .set('border-bottom', undefined);
    this.newBorders = new CellRangeAddressStyles({
      style,
      address: this.args.selectedCells,
    });
  }

  private borderValueAsCss(): string {
    const border: BorderStyle = this.args.borderStyle;
    return border.thickness + 'px ' + border.type + ' ' + border.color;
  }

  private defineBorderStyles(): void {
    let maxStyleNameUid = getMaxStyleNameUid(this.table);
    this.newBorders.forEach((style: Style, address: CellRange[]): void => {
      if (Object.keys(style.toCss()).length <= 0) return;
      const builder: StyleUpdateOperationDtoBuilder =
        new StyleUpdateOperationDtoBuilder(
          this.table,
          { id: 'style-update', selectedCells: address, style },
          maxStyleNameUid
        );
      builder.build();
      appendStyleStepsDto(builder.styleStepDto, this.styleStepDto);
      appendStyleStepsDto(builder.undoStyleStepDto, this.undoStyleStepDto);
      maxStyleNameUid = builder.maxStyleNameUid;
    });
  }
}

export class StyleBorderOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableStyles,
    args: StyleBorderOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new StyleBorderOperationDtoBuilder(table, args).build();
  }
}
