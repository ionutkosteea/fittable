import {
  Table,
  Style,
  TableStyles,
  createDto4CellRangeList,
  CellRangeList,
  CellRange,
  createStyle4Dto,
} from 'fittable-core/model';
import {
  TableChanges,
  TableChangesFactory,
  Args,
} from 'fittable-core/operations';

import {
  countAllCellStyleNames,
  countSelectedCellStyleNames,
  createStyleName,
  findUpdatableCellStyles,
  getMaxStyleNameUid,
} from '../../utils/style/style-functions.js';
import { StyleChange } from '../../table-change-writter/style/style-change-writter.js';

export type StyleUpdateArgs = Args<'style-update'> & {
  selectedCells: CellRange[];
  styleSnippet: Style;
};

export class StyleUpdateChangesBuilder {
  public readonly styleChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public readonly styleUndoChange: StyleChange = {
    id: 'style-update',
    createStyles: [],
    updateStyles: [],
    removeStyles: [],
    cellStyleNames: [],
  };
  public maxStyleNameUid = 0;
  private readonly changes: TableChanges;
  private readonly updatableCellStyles: Map<string | undefined, CellRangeList>;

  constructor(
    private readonly table: Table & TableStyles,
    private readonly args: StyleUpdateArgs,
    maxStyleNameUid?: number
  ) {
    this.changes = {
      id: args.id,
      changes: [this.styleChange],
      undoChanges: { changes: [this.styleUndoChange] },
    };
    this.updatableCellStyles = findUpdatableCellStyles(table, args.selectedCells, args.styleSnippet);
    this.maxStyleNameUid = maxStyleNameUid ?? getMaxStyleNameUid(this.table);
  }

  public build(): TableChanges {
    this.updateStyles();
    return this.changes;
  }

  private updateStyles(): void {
    const allCellsCnt: Map<string, number> = countAllCellStyleNames(this.table);
    const selectedCellsCnt: Map<string, number> = countSelectedCellStyleNames(this.table, this.args.selectedCells);
    for (const oldStyleName of this.updatableCellStyles.keys()) {
      if (oldStyleName) {
        const numOfAllCells: number = allCellsCnt.get(oldStyleName) ?? 0;
        const numOfSelectedCells: number =
          selectedCellsCnt.get(oldStyleName) ?? 0;
        if (numOfAllCells > numOfSelectedCells) {
          this.createStyleOrAttachExistingOne(oldStyleName);
        } else {
          this.updateStyleOrAttachExistingOne(
            oldStyleName,
            numOfAllCells === numOfSelectedCells
          );
        }
      } else {
        this.createStyleOrAttachExistingOne();
      }
    }
  }

  private createStyleOrAttachExistingOne(oldStyleName?: string): void {
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
  }

  private attachNewStyle(oldStyleName?: string): void {
    const cellRanges: unknown[] = createDto4CellRangeList(
      this.updatableCellStyles.get(oldStyleName)?.getRanges() ?? []
    );
    const newStyle: Style = this.createNewStyle(oldStyleName);
    if (newStyle.hasProperties()) {
      const newStyleName: string = this.createStyleName();
      this.styleChange.cellStyleNames.push({
        cellRanges,
        styleName: newStyleName,
      });
      this.styleChange.createStyles.push({
        styleName: newStyleName,
        style: newStyle.getDto(),
      });
      this.styleUndoChange.cellStyleNames.push({
        cellRanges,
        styleName: oldStyleName,
      });
      this.styleUndoChange.removeStyles.push(newStyleName);
    } else if (oldStyleName) {
      this.styleChange.cellStyleNames.push({ cellRanges });
      this.styleUndoChange.cellStyleNames.push({
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
    for (const styleEntryDto of this.styleChange.createStyles) {
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

  private updateStyleOrAttachExistingOne(
    oldStyleName: string,
    hasAllStyledCellsSelected: boolean
  ): void {
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
        hasAllStyledCellsSelected &&
          this.removeStyleWithoutStyleNames(oldStyleName, oldStyle);
      } else {
        this.updateStyle(oldStyleName, oldStyle, newStyle);
      }
    } else {
      this.removeStyle(oldStyleName, oldStyle);
    }
  }

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
    this.styleChange.cellStyleNames.push({
      cellRanges,
      styleName: existingStyleName,
    });
    this.styleUndoChange.cellStyleNames.push({
      cellRanges,
      styleName: oldStyleName,
    });
  }

  private updateStyle(
    oldStyleName: string,
    oldStyle: Style,
    newStyle: Style
  ): void {
    this.styleChange.updateStyles.push({
      styleName: oldStyleName,
      style: newStyle.getDto(),
    });
    this.styleUndoChange.updateStyles.push({
      styleName: oldStyleName,
      style: this.createUndoStyle(oldStyle),
    });
  }

  private createUndoStyle(oldStyle: Style): unknown {
    const undoStyle: Style = oldStyle.clone();
    const updateStyle: Style = this.args.styleSnippet;
    updateStyle.forEach((name: string): boolean => {
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
    this.styleChange.cellStyleNames.push({ cellRanges });
    this.styleChange.removeStyles.push(oldStyleName);
    this.styleUndoChange.cellStyleNames.push({
      cellRanges,
      styleName: oldStyleName,
    });
    this.styleUndoChange.createStyles.push({
      styleName: oldStyleName,
      style: oldStyle.getDto(),
    });
  }

  private removeStyleWithoutStyleNames(
    oldStyleName: string,
    oldStyle: Style
  ): void {
    this.styleChange.removeStyles.push(oldStyleName);
    this.styleUndoChange.createStyles.push({
      styleName: oldStyleName,
      style: oldStyle.getDto(),
    });
  }
}

export class StyleUpdateChangesFactory implements TableChangesFactory {
  public createTableChanges(
    table: Table & TableStyles,
    args: StyleUpdateArgs
  ): TableChanges | Promise<TableChanges> {
    return new StyleUpdateChangesBuilder(table, args).build();
  }
}
