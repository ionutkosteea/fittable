import { DataType, DataTypeFactory, DataTypeName } from "fittable-core/model";

import { FitDataTypeDto } from "./dto/fit-table-dto.js";

export class FitDataType implements DataType {
    private readonly dto: FitDataTypeDto = { name: 'string' };

    constructor(dto?: FitDataTypeDto) {
        if (dto) this.dto = dto;
    }

    getDto(): FitDataTypeDto {
        return this.dto;
    }

    getName(): DataTypeName {
        return this.dto.name;
    }

    setName(name: DataTypeName): this {
        this.dto.name = name;
        return this;
    }

    getFormat(): string | undefined {
        return this.dto.format;
    }

    setFormat(format?: string): this {
        this.dto.format = format;
        return this;
    }
}

export class FitDataTypeFactory implements DataTypeFactory {
    createDataType(name: DataTypeName, format?: string): DataType {
        return new FitDataType().setName(name).setFormat(format);
    }

    createDataType4Dto?(dto: FitDataTypeDto): DataType {
        return new FitDataType(dto);
    }

}