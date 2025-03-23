import { DataDef } from "fittable-core/model";

import { FitDataDefDto } from "./dto/fit-table-dto.js";

export class FitDataDef implements DataDef {
    constructor(private readonly dto: FitDataDefDto) { }

    getDto(): FitDataDefDto {
        return this.dto;
    }

    getName(): string {
        return this.dto.name;
    }

    getValueFields(): string[] {
        return this.dto.valueFields;
    }

    getKeyFields(): string[] {
        return this.dto.keyFields ?? [];
    }

    setKeyFields(...fieldNames: string[]): this {
        this.dto.keyFields = fieldNames;
        return this;
    }

    canExpandRows(): boolean {
        return this.dto.expandRows ?? false;
    }

    setExpandRows(canExpand: boolean): this {
        this.dto.expandRows = canExpand;
        return this;
    }
}

export class FitDataDefFactory {
    createDataDef(name: string, valueFields: string[]): DataDef {
        return new FitDataDef({ name, valueFields });
    }

    createDataDef4Dto(dto: FitDataDefDto): DataDef {
        return new FitDataDef(dto);
    }
}