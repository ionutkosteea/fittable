import {
  ModelConfig,
  Table,
  registerModelConfig,
  createTable,
} from 'fit-core/model';
import {
  OperationConfig,
  registerOperationConfig,
  OperationExecutor,
  Id,
} from 'fit-core/operations';
import {
  ViewModelConfig,
  registerViewModelConfig,
  ViewModel,
  createViewModel,
  HostListeners,
  createHostListeners,
} from 'fit-core/view-model';

export class FittableBuidler {
  private modelConfig!: ModelConfig;
  private operationConfig!: OperationConfig;
  private viewModelConfig!: ViewModelConfig;
  private createTable: () => Table = () => createTable(100, 10);

  private viewModel!: ViewModel;
  private hostListeners!: HostListeners;

  public setModelConfig(config: ModelConfig): this {
    this.modelConfig = config;
    return this;
  }

  public setOperationConfig(config: OperationConfig): this {
    this.operationConfig = config;
    return this;
  }

  public setViewModelConfig(config: ViewModelConfig): this {
    this.viewModelConfig = config;
    return this;
  }

  public setCreateTableFn(fn: () => Table): this {
    this.createTable = fn;
    return this;
  }

  public async build(): Promise<void> {
    return new Promise((reason: (message?: string) => void): void => reason())
      .then(async (): Promise<void> => {
        await this.setUndefinedModelConfig();
        await this.setUndefinedOperationConfig();
        await this.setUndefinedViewModelConfig();
        registerModelConfig(this.modelConfig);
        registerOperationConfig(this.operationConfig);
        registerViewModelConfig(this.viewModelConfig);
        this.viewModel = createViewModel(this.createTable());
        this.hostListeners = createHostListeners(this.viewModel);
      })
      .catch((error: unknown): void => console.error(error));
  }

  private async setUndefinedModelConfig(): Promise<void> {
    if (this.modelConfig) return;
    await import('fit-model').then((module): void => {
      this.modelConfig = { ...module.FIT_MODEL_CONFIG };
    });
  }

  private async setUndefinedOperationConfig(): Promise<void> {
    if (this.operationConfig) return;
    await import('fit-model-operations').then((module): void => {
      this.operationConfig = { ...module.FIT_OPERATION_CONFIG };
    });
  }

  private async setUndefinedViewModelConfig(): Promise<void> {
    if (this.viewModelConfig) return;
    await import('fit-view-model').then((module): void => {
      this.viewModelConfig = { ...module.FAT_VIEW_MODEL_CONFIG };
    });
  }

  public getTable(): Table {
    return this.viewModel.table;
  }

  public getOperationExecutor():
    | OperationExecutor<Id<string>, string>
    | undefined {
    return this.viewModel.executor;
  }

  public getViewModel(): ViewModel {
    return this.viewModel;
  }

  public getHostListeners(): HostListeners {
    return this.hostListeners;
  }
}
