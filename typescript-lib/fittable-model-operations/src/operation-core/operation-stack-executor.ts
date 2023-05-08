import { Subject } from 'rxjs';

import {
  OperationDto,
  OperationId,
  OperationStep,
} from 'fittable-core/operations';

import { FitOperation, FitOperationFactory } from './fit-operation.js';

export class OperationStackExecutor {
  public readonly beforeRun$: Subject<OperationDto> = new Subject();
  public readonly afterRun$: Subject<OperationDto> = new Subject();
  public readonly beforeUndo$: Subject<OperationDto> = new Subject();
  public readonly afterUndo$: Subject<OperationDto> = new Subject();
  public readonly beforeRedo$: Subject<OperationDto> = new Subject();
  public readonly afterRedo$: Subject<OperationDto> = new Subject();

  private readonly operationStack: OperationDto[] = [];
  private activeOperationIndex = -1;

  constructor(
    private readonly createOperationStep: (
      stepDto: OperationId<string>
    ) => OperationStep
  ) {}

  public run(operationDto: OperationDto): this {
    this.beforeRun$.next(operationDto);
    this.createOperation(operationDto).run();
    this.afterRun$.next(operationDto);
    if (operationDto.undoOperation) {
      if (this.activeOperationIndex === this.operationStack.length - 1) {
        this.operationStack.push(operationDto);
      } else {
        this.operationStack.splice(
          this.activeOperationIndex + 1,
          this.operationStack.length - this.activeOperationIndex,
          operationDto
        );
      }
      this.activeOperationIndex++;
    }
    return this;
  }

  public canUndo(): boolean {
    return this.activeOperationIndex > -1;
  }

  public undo(): this {
    if (this.canUndo()) {
      const operationDto: OperationDto = this.getActiveOperationDto();
      this.beforeUndo$.next(operationDto);
      this.createOperation(operationDto).undo();
      this.afterUndo$.next(operationDto);
      this.activeOperationIndex--;
    }
    return this;
  }

  public canRedo(): boolean {
    return this.activeOperationIndex < this.operationStack.length - 1;
  }

  public redo(): this {
    if (this.canRedo()) {
      this.activeOperationIndex++;
      const operationDto: OperationDto = this.getActiveOperationDto();
      this.beforeRedo$.next(operationDto);
      this.createOperation(operationDto).run();
      this.afterRedo$.next(operationDto);
    }
    return this;
  }

  private createOperation(operationDto: OperationDto): FitOperation {
    const factory: FitOperationFactory = //
      new FitOperationFactory(this.createOperationStep);
    return factory.createOperation(operationDto);
  }

  private getActiveOperationDto(): OperationDto {
    const operationDto: OperationDto | undefined =
      this.operationStack[this.activeOperationIndex];
    if (operationDto) return operationDto;
    else throw new Error('No active operation is defined!');
  }

  public clearOperations(): this {
    while (this.operationStack.length > 0) this.operationStack.pop();
    this.activeOperationIndex = -1;
    return this;
  }
}
