import { MissingFactoryError, MissingFactoryMethodError } from "../../common/factory-error.js";
import { getModelConfig } from "../model-config.js";

export type DataTypeName = 'string' | 'number' | 'date-time' | 'boolean';

export interface DataType {
    getDto(): unknown;
    getName(): DataTypeName;
    getFormat(): string | undefined;
}

export interface DataTypeFactory {
    createDataType(name: DataTypeName, format?: string): DataType;
    createDataType4Dto?(dto: unknown): DataType;
}

export function createDataType<T extends DataType>(name: DataTypeName, format?: string): T {
    return getFactory().createDataType(name, format) as T;
}

export function createDataType4Dto<T extends DataType>(dto: unknown): T {
    const factory: DataTypeFactory = getFactory();
    if (factory.createDataType4Dto) return factory.createDataType4Dto(dto) as T;
    else throw new MissingFactoryMethodError();
}

function getFactory(): DataTypeFactory {
    const factory: DataTypeFactory | undefined = getModelConfig().dataTypeFactory;
    if (factory) return factory;
    else throw new MissingFactoryError();
}
