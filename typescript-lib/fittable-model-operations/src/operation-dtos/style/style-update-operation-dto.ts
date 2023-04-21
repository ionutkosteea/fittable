import {
  Table,
  Style,
  TableStyles,
  createDto4CellRangeList,
  CellRangeList,
  CellRange,
  createStyle4Dto,
} from 'fittable-core/model/index.js';
import {
  OperationDto,
  OperationDtoFactory,
  OperationId,
} from 'fittable-core/operations/index.js';

import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
  createStyleName,
  findUpdatableCellStyles,
  getMaxStyleNameUid,
} from '../../utils/style/style-functions.js';
import { StyleOperationStepDto } from '../../operation-steps/style/style-operation-step.js';

export type StyleUpdateOperationDtoArgs = OperationId<'style-update'> & {
  selectedCells: CellRange[];
  styleSnippet: Style;
};

export class StyleUpdateOperationDtoBuilder {
  public readonly styleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly undoStyleStepDto: StyleOperationStepDto = {
    id: 'style-changes',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public maxStyleNameUid = 0;
  private readonly operationDto: OperationDto;
  private readonly updatableCellStyles: Map<string | undefined, CellRangeList>;

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleUpdateOperationDtoArgs,
    maxStyleNameUid?: number
  ) {
    this.operationDto = {
      id: args.id,
      steps: [this.styleStepDto],
      undoOperation: { steps: [this.undoStyleStepDto] },
    };
    this.updatableCellStyles = findUpdatableCellStyles(
      table,
      args.selectedCells,
      args.styleSnippet
    );
    this.maxStyleNameUid = maxStyleNameUid ?? getMaxStyleNameUid(this.table);
  }

  public build(): OperationDto {
    this.runStyleAction(
      this.createStyleOrAttachExistingOne,
      this.updateStyleOrAttachExistingOne
    );
    return this.operationDto;
  }

  private runStyleAction(
    createFn: (oldStyleName?: string) => void,
    updateFn: (oldStyleName: string, isOldStyleOnSingleCell: boolean) => void
  ): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(
      this.table,
      this.args.selectedCells
    );
    for (const oldStyleName of this.updatableCellStyles.keys()) {
      if (oldStyleName) {
        const numOfAllCells: number = allCellsCnt.get(oldStyleName) ?? 0;
        const numOfSelectedCells: number =
          selectedCellsCnt.get(oldStyleName) ?? 0;
        if (numOfAllCells > numOfSelectedCells) createFn(oldStyleName);
        else updateFn(oldStyleName, numOfAllCells === 1);
      } else {
        createFn();
      }
    }
  }

  private readonly createStyleOrAttachExistingOne = (
    oldStyleName?: string
  ): void => {
    let existingStyleName: string | undefined;
    if (oldStyleName) {
      const newStyle: Style = this.createNewStyle(oldStyleName);
      if (newStyle.hasProperties()) {
        existingStyleName = this.findName4Style(newStyle);
      }
    } else {
      existingStyleName = this.findName4Style(this.args.styleSnippet);
    }
    if (existingStyleName) {
      this.attachExistingStyle(existingStyleName, oldStyleName);
    } else {
      this.attachNewStyle(oldStyleName);
    }
  };

  private attachNewStyle(oldStyleName?: string): void {
    const cellRanges: unknown[] = createDto4CellRangeList(
      this.updatableCellStyles.get(oldStyleName)?.getRanges() ?? []
    );
    const newStyle: Style = this.createNewStyle(oldStyleName);
    if (newStyle.hasProperties()) {
      const newStyleName: string = this.createStyleName();
      this.styleStepDto.cellStyleNames.push({
        cellRanges,
        styleName: newStyleName,
      });
      this.styleStepDto.createStyles.push({
        styleName: newStyleName,
        style: newStyle.getDto(),
      });
      this.undoStyleStepDto.cellStyleNames.push({
        cellRanges,
        styleName: oldStyleName,
      });
      this.undoStyleStepDto.removeStyles.push(newStyleName);
    } else if (oldStyleName) {
      this.styleStepDto.cellStyleNames.push({ cellRanges });
      this.undoStyleStepDto.cellStyleNames.push({
        cellRanges,
        styleName: oldStyleName,
      });
    }
  }

  private createNewStyle(oldStyleName?: string): Style {
    let newStyle: Style = this.args.styleSnippet;
    if (oldStyleName) {
      const oldStyle: Style | undefined = this.table.getStyle(oldStyleName);
      if (oldStyle) {
        newStyle = this.updateStyleProperties(oldStyle, this.args.styleSnippet);
      }
    }
    return newStyle;
  }

  private createStyleName(): string {
    this.maxStyleNameUid++;
    return createStyleName(this.maxStyleNameUid);
  }

  private findName4Style(style: Style): string | undefined {
    for (const styleEntryDto of this.styleStepDto.createStyles) {
      const newStyle: Style = createStyle4Dto(styleEntryDto.style);
      if (style.equals(newStyle)) return styleEntryDto.styleName;
    }
    const styleNames: string[] = this.table.getStyleNames();
    for (const styleName of styleNames) {
      const oldStyle: Style | undefined = this.table.getStyle(styleName);
      if (style.equals(oldStyle)) return styleName;
    }
    return undefined;
  }

  private readonly updateStyleOrAttachExistingOne = (
    oldStyleName: string,
    isOldStyleOnSingleCell: boolean
  ): void => {
    const oldStyle: Style | undefined = this.table.getStyle(oldStyleName);
    if (!oldStyle) return;
    const newStyle: Style = this.updateStyleProperties(
      oldStyle,
      this.args.styleSnippet
    );
    if (newStyle.hasProperties()) {
      const existingStyleName: string | undefined =
        this.findName4Style(newStyle);
      if (existingStyleName) {
        this.attachExistingStyle(existingStyleName, oldStyleName);
        isOldStyleOnSingleCell &&
          this.removeStyleWithoutStyleNames(oldStyleName, oldStyle);
      } else {
        this.updateStyle(oldStyleName, oldStyle, newStyle);
      }
    } else {
      this.removeStyle(oldStyleName, oldStyle);
    }
  };

  private updateStyleProperties(style: Style, newProperties: Style): Style {
    const newStyle: Style = style.clone();
    newProperties.forEach((name: string, value?: string | number): boolean => {
      newStyle.set(name, value);
      return true;
    });
    return newStyle;
  }

  private attachExistingStyle(
    existingStyleName: string,
    oldStyleName?: string
  ): void {
    const cellRanges: unknown[] = createDto4CellRangeList(
      this.updatableCellStyles.get(oldStyleName)?.getRanges() ?? []
    );
    this.styleStepDto.cellStyleNames.push({
      cellRanges,
      styleName: existingStyleName,
    });
    this.undoStyleStepDto.cellStyleNames.push({
      cellRanges,
      styleName: oldStyleName,
    });
  }

  private updateStyle(
    oldStyleName: string,
    oldStyle: Style,
    newStyle: Style
  ): void {
    this.styleStepDto.updateStyles.push({
      styleName: oldStyleName,
      style: newStyle.getDto(),
    });
    this.undoStyleStepDto.updateStyles.push({
      styleName: oldStyleName,
      style: this.createUndoStyle(oldStyle),
    });
  }

  private createUndoStyle(oldStyle: Style): unknown {
    const undoStyle: Style = oldStyle.clone();
    const updateStyle: Style = this.args.styleSnippet;
    updateStyle.forEach((name: string) => {
      const oldValue: string | number | undefined = undoStyle.get(name);
      !oldValue && undoStyle.set(name, undefined);
      return true;
    });
    return undoStyle.getDto();
  }

  private removeStyle(oldStyleName: string, oldStyle: Style): void {
    const cellRanges: unknown[] = createDto4CellRangeList(
      this.updatableCellStyles.get(oldStyleName)?.getRanges() ?? []
    );
    this.styleStepDto.cellStyleNames.push({ cellRanges });
    this.styleStepDto.removeStyles.push(oldStyleName);
    this.undoStyleStepDto.cellStyleNames.push({
      cellRanges,
      styleName: oldStyleName,
    });
    this.undoStyleStepDto.createStyles.push({
      styleName: oldStyleName,
      style: oldStyle.getDto(),
    });
  }

  private removeStyleWithoutStyleNames(
    oldStyleName: string,
    oldStyle: Style
  ): void {
    this.styleStepDto.removeStyles.push(oldStyleName);
    this.undoStyleStepDto.createStyles.push({
      styleName: oldStyleName,
      style: oldStyle.getDto(),
    });
  }
}

export class StyleUpdateOperationDtoFactory implements OperationDtoFactory {
  public createOperationDto(
    table: Table & TableStyles,
    args: StyleUpdateOperationDtoArgs
  ): OperationDto | Promise<OperationDto> {
    return new StyleUpdateOperationDtoBuilder(table, args).build();
  }
}
