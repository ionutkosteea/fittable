import {
  Operation,
  TableChangeWritter,
  OperationFactory,
  TableChanges,
  Args,
  BaseTableChanges,
} from 'fittable-core/operations';

export class FitOperation implements Operation {
  public readonly properties: { [id in string]?: unknown } = {};

  constructor(
    public readonly id: string,
    private readonly changeWritters: TableChangeWritter[],
    private readonly undoChanges?: FitOperation
  ) {}

  public run(): this {
    this.changeWritters //
      .forEach((writter: TableChangeWritter): void => writter.run());
    return this;
  }

  public canUndo(): boolean {
    return this.undoChanges !== undefined;
  }

  public undo(): this {
    this.undoChanges?.changeWritters //
      .forEach((writter: TableChangeWritter): void => writter.run());
    return this;
  }
}

export class FitOperationFactory implements OperationFactory {
  constructor(
    public readonly createChangeWritter: (
      change: Args<string>
    ) => TableChangeWritter
  ) {}

  public createOperation(changes: TableChanges): FitOperation {
    const writters: TableChangeWritter[] = this.createChangeWritters(changes);
    if (changes.undoChanges) {
      const undoWritters: TableChangeWritter[] = //
        this.createChangeWritters(changes.undoChanges);
      return new FitOperation(
        changes.id,
        writters,
        new FitOperation(changes.id, undoWritters)
      );
    } else {
      return new FitOperation(changes.id, writters);
    }
  }

  private createChangeWritters(
    changes: BaseTableChanges
  ): TableChangeWritter[] {
    const writters: TableChangeWritter[] = [];
    for (const change of changes.changes) {
      const writter: TableChangeWritter = this.createChangeWritter(change);
      writters.push(writter);
    }
    if (writters.length > 0) {
      return writters;
    } else {
      throw Error(`Missing table change writters for: ${changes}`);
    }
  }
}
