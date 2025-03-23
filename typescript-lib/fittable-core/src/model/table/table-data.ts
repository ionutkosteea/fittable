import { MissingFactoryError } from "../../common/factory-error.js";
import { getModelConfig } from "../model-config.js";

export type Value = string | number | boolean;

export interface DataDef {
    getDto(): unknown;
    getName(): string;
    getValueFields(): string[];
    getKeyFields(): string[];
    setKeyFields(...fieldNames: string[]): this;
    canExpandRows(): boolean;
    setExpandRows(canExpand: boolean): this;
}

export interface DataDefFactory {
    createDataDef(name: string, valueFields: string[]): DataDef;
    createDataDef4Dto(dto: unknown): DataDef;
}

export function createDataDef<T extends DataDef>(name: string, valueFields: string[]): T {
    const factory: DataDefFactory | undefined = getModelConfig().dataDefFactory;
    if (factory) return factory.createDataDef(name, valueFields) as T;
    throw MissingFactoryError;
}

export function createDataDef4Dto<T extends DataDef>(dto: unknown): T {
    const factory: DataDefFactory | undefined = getModelConfig().dataDefFactory;
    if (factory) return factory.createDataDef4Dto(dto) as T;
    throw MissingFactoryError;
}

export interface Data {
    getDto(): unknown;
    getDataDef(): string;
    getValues(): (Value | null)[][];
}

export interface DataFactory {
    createData(dataDef: string, values: (Value | null)[][]): Data;
    createData4Dto(dto: unknown): Data;
}

export function createData<T extends Data>(dataDef: string, values: (Value | null)[][]): T {
    const factory: DataFactory | undefined = getModelConfig().dataFactory;
    if (factory) return factory.createData(dataDef, values) as T;
    throw MissingFactoryError;
}

export function createData4Dto<T extends Data>(dto: unknown): T {
    const factory: DataFactory | undefined = getModelConfig().dataFactory;
    if (factory) return factory.createData4Dto(dto) as T;
    throw MissingFactoryError;
}

export type Fields = { [name: string]: Value | null };

export interface DataRefFactory {
    createDataRef(dataDef: string, valueField: string, keyFields: Fields): string;
    createDataRefDto(dataRef: string): unknown;
}

export function createDataRef(dataDef: string, valueField: string, keysFields: Fields): string {
    const factory: DataRefFactory | undefined = getModelConfig().dataRefFactory;
    if (factory) return factory.createDataRef(dataDef, valueField, keysFields);
    throw MissingFactoryError;
}

export function createDataRefDto<T>(dataRef: string): T {
    const factory: DataRefFactory | undefined = getModelConfig().dataRefFactory;
    if (factory) return factory.createDataRefDto(dataRef) as T;
    throw MissingFactoryError;
}