import {
  MergedRegions,
  MergedRegionsFactory,
  createCellRange4Dto,
} from 'fit-core/model/index.js';

import { FitCellRangeDto } from './dto/fit-table-dto.js';
import { FitCellRange } from './fit-cell-range.js';
import { FitCellCoord } from './fit-cell-coord.js';

export class FitMergedRegion extends FitCellRange {
  public getRowSpan(): number {
    return this.getTo().getRowId() + 1 - this.getFrom().getRowId();
  }

  public getColSpan(): number {
    return this.getTo().getColId() + 1 - this.getFrom().getColId();
  }
}

export class FitMergedRegions implements MergedRegions {
  private readonly dto: FitCellRangeDto[] = [];

  constructor(dto?: FitCellRangeDto[]) {
    if (dto) this.dto = dto;
  }

  public getDto(): FitCellRangeDto[] {
    return this.dto;
  }

  public getRowSpan(rowId: number, colId: number): number {
    return this.getLineSpan(rowId, colId, (region: FitMergedRegion): number =>
      region.getRowSpan()
    );
  }

  public getColSpan(rowId: number, colId: number): number {
    return this.getLineSpan(rowId, colId, (region: FitMergedRegion): number =>
      region.getColSpan()
    );
  }
  private getLineSpan(
    rowId: number,
    colId: number,
    getLineSpanFn: (region: FitMergedRegion) => number
  ): number {
    const region: FitMergedRegion | undefined = this.getRegion(rowId, colId);
    if (!region) return 1;
    const from: FitCellCoord = region.getFrom();
    if (rowId === from.getRowId() && colId === from.getColId()) {
      return getLineSpanFn(region);
    }
    return 0;
  }

  public getRegion(rowId: number, colId: number): FitMergedRegion | undefined {
    for (const regionDto of this.dto) {
      const region: FitMergedRegion = new FitMergedRegion(regionDto);
      if (region.hasCell(rowId, colId)) return region;
    }
    return undefined;
  }

  public addRegion(from: FitCellCoord, to: FitCellCoord): this {
    this.dto.push({ from: from.getDto(), to: to.getDto() });
    return this;
  }

  public removeRegion(from: FitCellCoord): this {
    const rowId: number = from.getRowId();
    const colId: number = from.getColId();
    for (let i = 0; i < this.dto.length; i++) {
      const region: FitCellRangeDto = this.dto[i];
      if (rowId === region.from.rowId && colId === region.from.colId) {
        this.dto.splice(i, 1);
        break;
      }
    }
    return this;
  }

  public forEachRegion(regionFn: (region: FitMergedRegion) => void): void {
    for (const rangeDto of this.dto) {
      regionFn(new FitMergedRegion(rangeDto));
    }
  }

  public hasProperties(): boolean {
    return this.dto.length > 0;
  }

  public clone(): FitMergedRegions {
    return new FitMergedRegions({ ...this.dto });
  }

  public equals(other?: FitMergedRegions): boolean {
    if (this.dto.length !== other?.getDto().length) return false;
    for (let i = 0; i < this.dto.length; i++) {
      const dto: unknown = this.dto[i];
      const range: FitMergedRegion = createCellRange4Dto<FitMergedRegion>(dto);
      const otherDto: unknown = other.getDto()[i];
      const otherRange: FitMergedRegion =
        createCellRange4Dto<FitMergedRegion>(otherDto);
      if (range) {
        if (!range.equals(otherRange)) return false;
      } else if (otherRange) {
        return false;
      }
    }
    return true;
  }
}

export class FitMergedRegionsFactory implements MergedRegionsFactory {
  public createMergedRegions(): FitMergedRegions {
    return new FitMergedRegions();
  }

  public createMergedRegions4Dto(dto: FitCellRangeDto[]): FitMergedRegions {
    if (Array.isArray(dto)) {
      return new FitMergedRegions(dto);
    } else {
      throw new Error('Invalid merged regions DTO.');
    }
  }
}
