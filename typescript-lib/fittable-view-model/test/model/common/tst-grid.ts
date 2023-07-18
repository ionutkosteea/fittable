import { ScrollContainerArgs } from 'fittable-core/view-model';

export class TstGrid implements ScrollContainerArgs {
  constructor(private numberOfRows: number, private numberOfCols: number) {}

  public getNumberOfRows(): number {
    return this.numberOfRows;
  }

  public setNumberOfRows(numberOfRows: number): this {
    this.numberOfRows = numberOfRows;
    return this;
  }

  public getNumberOfCols(): number {
    return this.numberOfCols;
  }

  public setNumberOfCols(numberOfCols: number): this {
    this.numberOfCols = numberOfCols;
    return this;
  }
}
