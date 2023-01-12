import { FitImageId } from '../../../image-registry/fit-image-registry.js';
import { FitTextKey } from '../../../language-dictionary/language-dictionary-keys.js';
import { FitOperationArgs } from '../../../operation-executor/operation-args.js';
import { MenuItem } from './menu-item.js';

export class CellClearMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Clear cells';
  protected iconId: FitImageId = 'clear';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-value',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}

export class CellRemoveMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Remove cells';
  protected iconId: FitImageId = 'remove';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-remove',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}

export class CellCutMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Cut cells';
  protected iconId: FitImageId = 'cut';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-cut',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}

export class CellCopyMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Copy cells';
  protected iconId: FitImageId = 'copy';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-copy',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}

export class CellPasteMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Paste cells';
  protected iconId: FitImageId = 'paste';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-paste',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}

export class CellMergeMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Merge cells';
  protected iconId: FitImageId = 'merge';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-merge',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}

export class CellUnmergeMenuItem extends MenuItem {
  protected labelKey: FitTextKey = 'Unmerge cells';
  protected iconId: FitImageId = 'unmerge';

  public run(): void {
    this.args.operationExecutor.run(this.getArgs());
  }

  private getArgs(): FitOperationArgs {
    return {
      id: 'cell-unmerge',
      selectedCells: this.args.getSelectedCells(),
    };
  }
}
