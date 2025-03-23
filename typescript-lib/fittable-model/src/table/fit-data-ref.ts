import { DataRefFactory, Fields } from "fittable-core/model";

import { FitDataRefDto } from "./dto/fit-table-dto.js";


export class FitDataRefFactory implements DataRefFactory {
    createDataRef(dataDef: string, valueField: string, keyFields: Fields): string {
        return JSON.stringify({ dataDef, valueField, keyFields });
    }

    createDataRefDto(dataRef: string): FitDataRefDto {
        return JSON.parse(dataRef);
    }
}