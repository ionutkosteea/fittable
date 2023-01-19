import { Subject } from 'rxjs';

import {
  CellRange,
  createLineRange,
  LineRange,
  LineRangeList,
} from 'fit-core/model/index.js';
import {
  Control,
  ControlArgs,
  InputControl,
} from 'fit-core/view-model/index.js';

import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitImageId } from '../../../image-registry/fit-image-ids.js';
import { FitControlType } from '../../../common/controls/fit-control-type.js';

export abstract class MenuItem implements Control {
  protected abstract labelKey: FitTextKey;
  protected abstract iconId: FitImageId;

  constructor(protected readonly args: ControlArgs) {}

  public abstract run(): void;

  public getLabel(): string {
    return this.args.dictionary.getText(this.labelKey);
  }

  public getIcon(): string | undefined {
    let imgUrl: string | undefined;
    if (this.iconId) {
      if (this.args.imageRegistry) {
        imgUrl = this.args.imageRegistry.getImageUrl(this.iconId);
      } else {
        console.warn('Missing imageRegistry for iconId ' + this.iconId);
      }
    }
    return imgUrl;
  }

  public getType(): FitControlType {
    return 'menu-item';
  }

  public isValid(): boolean {
    return true;
  }

  protected getSelectedRows(): LineRange[] {
    const lineRangeList: LineRangeList = new LineRangeList();
    this.args
      .getSelectedCells()
      .forEach((cellRange: CellRange) =>
        lineRangeList.add(
          createLineRange(
            cellRange.getFrom().getRowId(),
            cellRange.getTo().getRowId()
          )
        )
      );
    return lineRangeList.getRanges();
  }

  protected getSelectedColumns(): LineRange[] {
    const lineRangeList: LineRangeList = new LineRangeList();
    this.args
      .getSelectedCells()
      .forEach((cellRange: CellRange) =>
        lineRangeList.add(
          createLineRange(
            cellRange.getFrom().getColId(),
            cellRange.getTo().getColId()
          )
        )
      );
    return lineRangeList.getRanges();
  }

  protected getFirstLine(lineRanges: LineRange[]): LineRange[] {
    const resultLine: LineRange[] = [];
    const firstRange: LineRange | undefined = lineRanges[0];
    firstRange && resultLine.push(createLineRange(firstRange.getFrom()));
    return resultLine;
  }
}

export abstract class InputMenuItem extends MenuItem implements InputControl {
  public readonly focus$: Subject<boolean> = new Subject();

  protected value?: number;
  private textCursor = true;

  public getValue(): number | undefined {
    return this.value;
  }

  public setValue(value?: number): this {
    this.value = value;
    return this;
  }

  public hasTextCursor(): boolean {
    return this.textCursor;
  }

  public setTextCursor(visible: boolean): this {
    this.textCursor = visible;
    return this;
  }
}
