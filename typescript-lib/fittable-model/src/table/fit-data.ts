import { Data, Value } from "fittable-core/model";
import { FitDataDto } from "./dto/fit-table-dto.js";

export class FitData implements Data {
    constructor(private readonly dto: FitDataDto) { }

    getDto(): FitDataDto {
        return this.dto;
    }

    getDataDef(): string {
        return this.dto.dataDef;
    }

    getValues(): (Value | null)[][] {
        return this.dto.values;
    }
}

export class FitDataFactory {
    createData(dataDef: string, values: (Value | null)[][]): Data {
        return new FitData({ dataDef, values });
    }

    createData4Dto(dto: unknown): Data {
        return new FitData(dto as FitDataDto);
    }
}