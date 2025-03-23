import {
    ObjectMatrix,
    ObjectList,
    ObjectMap,
    MissingFactoryError
} from "fittable-core/common";
import {
    ColConditionFn,
    createCellBooleanFormatter,
    createCellDateFormatter,
    createCellNumberFormatter,
    createDataType,
    createDataType4Dto,
    createStyle4Dto,
    createTable4Dto,
    DataDef,
    DataTypeName,
    getLanguageDictionary,
    TableBasics,
    TableColFilters,
    TableCols,
    TableData,
    TableDataTypes,
    TableFactory,
    TableMergedRegions,
    TableRows,
    TableStyles,
    Value,
    createDataRef,
    Fields,
    createDataDef4Dto
} from "fittable-core/model";

import {
    FitCellDto,
    FitColDto,
    FitDataDefDto,
    FitMergedCellDto,
    FitRowDto,
    FitStyleDto,
    FitTableDto
} from "./dto/fit-table-dto.js";
import { FitStyle } from "./fit-style.js";
import { FitDataType } from "./fit-data-type.js";
import { FitLanguageDictionary } from "../language/fit-language-dictionary.js";
import { FitDataDef } from "./fit-data-def.js";
import { FitData } from "./fit-data.js";

type DataDefWrapper = { rowId: number, colId: number, item: DataDef };
export class FitTable implements
    TableBasics,
    TableRows,
    TableCols,
    TableStyles,
    TableMergedRegions,
    TableColFilters,
    TableDataTypes,
    TableData {

    private readonly cells: ObjectMatrix<FitCellDto>;
    private readonly rows: ObjectList<FitRowDto>;
    private readonly cols: ObjectList<FitColDto>;
    private readonly styles: ObjectMap<string, FitStyleDto>;
    private readonly mergedCells: ObjectMatrix<FitMergedCellDto>;
    private readonly dataDefs: ObjectMatrix<FitDataDefDto>;

    constructor(private readonly dto: FitTableDto = {
        numberOfRows: 5,
        numberOfCols: 5,
    }) {
        this.cells = new ObjectMatrix(dto.cells ?? (dto.cells = {}));
        this.rows = new ObjectList(dto.rows ?? (dto.rows = {}));
        this.cols = new ObjectList(dto.cols ?? (dto.cols = {}));
        this.styles = new ObjectMap(dto.styles ?? (dto.styles = {}));
        this.mergedCells = new ObjectMatrix(dto.mergedCells ?? (dto.mergedCells = {}));
        this.dataDefs = new ObjectMatrix(dto.dataDefs ?? (dto.dataDefs = {}));
    }

    /** Table basics */

    getDto(): FitTableDto {
        return this.dto;
    }

    getNumberOfRows(): number {
        return this.dto.numberOfRows;
    }

    setNumberOfRows(numberOfRows: number): this {
        this.dto.numberOfRows = numberOfRows;
        return this;
    }

    getNumberOfCols(): number {
        return this.dto.numberOfCols;
    }

    setNumberOfCols(numberOfCols: number): this {
        this.dto.numberOfCols = numberOfCols;
        return this;
    }

    getCellValue(rowId: number, colId: number): Value | undefined {
        return this.cells.get(rowId, colId)?.value;
    }

    setCellValue(rowId: number, colId: number, value?: Value): this {
        const cell = this.cells.get(rowId, colId);
        if (value !== undefined) {
            const dataType: FitDataType | undefined = cell?.dataType
                ? createDataType4Dto<FitDataType>(cell?.dataType)
                : undefined;
            const formattedValue = this.cellFormattedValue(value, dataType);
            if (cell) {
                cell.value = value;
                cell.formattedValue = formattedValue;
            } else {
                this.cells.set(rowId, colId, { value, formattedValue });
            }
        } else if (cell) {
            delete cell['value'];
            delete cell['formattedValue'];
            !Object.keys(cell).length && this.cells.remove(rowId, colId);
        }
        return this;
    }

    hasCell(rowId: number, colId: number): boolean {
        const cell = this.cells.get(rowId, colId);
        return cell !== undefined;
    }

    removeCell(rowId: number, colId: number): this {
        this.cells.remove(rowId, colId);
        return this;
    }

    forEachCell(cellFn: (rowId: number, colId: number) => void): void {
        for (let i = 0; i < (this.dto.numberOfRows ?? 0); i++) {
            for (let j = 0; j < (this.dto.numberOfCols ?? 0); j++) {
                cellFn(i, j);
            }
        }
    }

    removeRowCells(rowId: number): this {
        this.cells.removeRow(rowId);
        this.dataDefs.removeRow(rowId);
        return this;
    }

    moveRowCells(rowId: number, move: number): this {
        this.cells.moveRow(rowId, move);
        this.dataDefs.moveRow(rowId, move);
        return this;
    }

    removeColCells(colId: number): this {
        this.cells.removeCol(colId);
        return this;
    }

    moveColCells(colId: number, move: number): this {
        this.cells.moveCol(colId, move);
        return this;
    }

    clone(): FitTable {
        return new FitTable({ ...this.dto });
    }

    /** Table rows */

    getRowHeight(rowId: number): number | undefined {
        return this.rows.get(rowId)?.height;
    }

    setRowHeight(rowId: number, height?: number): this {
        const row = this.rows.get(rowId);
        if (height) {
            if (row) row.height = height;
            else this.rows.set(rowId, { height });
        } else if (row) {
            delete row['height'];
            !Object.keys(row).length && this.rows.remove(rowId);
        }
        return this;
    }

    hasRow(rowId: number): boolean {
        return this.rows.get(rowId) !== undefined;
    }

    removeRow(rowId: number): this {
        this.rows.remove(rowId);
        return this;
    }

    moveRow(rowId: number, move: number): this {
        this.rows.move(rowId, move);
        return this;
    }

    /** Table columns */

    getColWidth(colId: number): number | undefined {
        return this.cols.get(colId)?.width;
    }

    setColWidth(colId: number, width?: number): this {
        const col = this.cols.get(colId);
        if (width) {
            if (col) col.width = width;
            else this.cols.set(colId, { width });
        } else if (col) {
            delete col['width'];
            !Object.keys(col).length && this.cols.remove(colId);
        }
        return this;
    }

    hasCol(colId: number): boolean {
        return this.cols.get(colId) !== null;
    }

    removeCol(colId: number): this {
        this.cols.remove(colId);
        return this;
    }

    moveCol(colId: number, move: number): this {
        this.cols.move(colId, move);
        return this;
    }

    /** Table styles */

    getStyle(name: string): FitStyle | undefined {
        const style = this.styles.get(name);
        return style ? createStyle4Dto<FitStyle>(style) : undefined;
    }

    setStyle(name: string, style: FitStyle): this {
        this.styles.set(name, style.getDto());
        return this;
    }

    removeStyle(name: string): this {
        this.styles.remove(name);
        return this;
    }

    getStyleNames(): string[] {
        return this.styles.getKeys();
    }

    getCellStyleName(rowId: number, colId: number): string | undefined {
        return this.cells.get(rowId, colId)?.styleName;
    }

    setCellStyleName(rowId: number, colId: number, styleName?: string): this {
        const cell = this.cells.get(rowId, colId);
        if (styleName) {
            if (cell) cell.styleName = styleName;
            else this.cells.set(rowId, colId, { styleName })
        } else if (cell) {
            delete cell['styleName'];
            !Object.keys(cell).length && this.cells.remove(rowId, colId);
        }
        return this;
    }

    /** Table merged regions */

    getRowSpan(rowId: number, colId: number): number | undefined {
        return this.mergedCells.get(rowId, colId)?.rowSpan;
    }

    setRowSpan(rowId: number, colId: number, rowSpan?: number): this {
        const cell = this.mergedCells.get(rowId, colId);
        if (rowSpan) {
            if (cell) cell.rowSpan = rowSpan;
            else this.mergedCells.set(rowId, colId, { rowSpan });
        } else if (cell) {
            delete cell['rowSpan'];
            !Object.keys(cell).length && this.mergedCells.remove(rowId, colId);
        }
        return this;
    }

    getColSpan(rowId: number, colId: number): number | undefined {
        return this.mergedCells.get(rowId, colId)?.colSpan;
    }

    setColSpan(rowId: number, colId: number, colSpan?: number): this {
        const cell = this.mergedCells.get(rowId, colId);
        if (colSpan) {
            if (cell) cell.colSpan = colSpan;
            else this.mergedCells.set(rowId, colId, { colSpan });
        } else if (cell) {
            delete cell['colSpan'];
            !Object.keys(cell).length && this.mergedCells.remove(rowId, colId);
        }
        return this;
    }

    forEachMergedCell(cellFn: (rowId: number, colId: number) => void): void {
        return this.mergedCells.forEach(cellFn);
    }

    moveRegion(rowId: number, colId: number, moveRow: number, moveCol: number): this {
        const cell = this.mergedCells.get(rowId, colId);
        if (cell) {
            const clone = { ...cell };
            this.mergedCells.remove(rowId, colId);
            this.mergedCells.set(rowId + moveRow, colId + moveCol, clone);
        }
        return this;
    }

    increaseRegion(rowId: number, colId: number, increaseRow: number, increaseCol: number): this {
        const cell = this.mergedCells.get(rowId, colId);
        if (cell) {
            if (cell.rowSpan) cell.rowSpan += increaseRow;
            if (cell.colSpan) cell.colSpan += increaseCol;
        }
        return this;
    }

    removeRowRegions(rowId: number): this {
        this.mergedCells.removeRow(rowId);
        return this;
    }

    removeColRegions(colId: number): this {
        this.mergedCells.removeCol(colId);
        return this;
    }

    /** Table filters */

    filterByCol(colId: number, conditionFn: ColConditionFn): FitTable {
        let numberOfRows = 0;
        const filterDto: FitTableDto = {
            locale: this.dto.locale,
            numberOfRows,
            numberOfCols: this.dto.numberOfCols,
            styles: this.dto.styles,
            cols: this.dto.cols
        };
        filterDto.cells = {};
        filterDto.rows = {};
        for (let rowId = 0; rowId < this.getNumberOfRows(); rowId++) {
            const value: Value | undefined = this.getCellValue(rowId, colId);
            if (!conditionFn(rowId, colId, value)) continue;
            if (this.dto.cells![rowId]) {
                filterDto.cells[numberOfRows] = this.dto.cells![rowId];
            }
            if (this.dto.rows && this.dto.rows[rowId]) {
                filterDto.rows[numberOfRows] = this.dto.rows[rowId];
            }
            numberOfRows++;
        }
        filterDto.numberOfRows = numberOfRows;
        return createTable4Dto<FitTable>(filterDto);
    }

    /** Table data types */

    getLocale(): string {
        return this.dto.locale ?? 'en-US';
    }

    setLocale(locale: string): this {
        if (locale !== this.dto.locale) {
            const dictionary = getLanguageDictionary()
                .setLocale(locale) as FitLanguageDictionary;
            const prevDictionary = dictionary.clone()
                .setLocale(this.getLocale()) as FitLanguageDictionary;
            this.adaptNumberFormatsToNewLocale(dictionary, prevDictionary);
            this.adaptBooleanValuesToNewLocale(dictionary);
            this.dto.locale = locale;
        }
        return this;
    }

    getCellDataType(rowId: number, colId: number): FitDataType | undefined {
        const dataType = this.cells.get(rowId, colId)?.dataType;
        return dataType ? createDataType4Dto<FitDataType>(dataType) : undefined;
    }

    setCellDataType(rowId: number, colId: number, dataType?: FitDataType): this {
        const cell = this.cells.get(rowId, colId);
        if (dataType) {
            const formattedValue = cell?.value
                ? this.cellFormattedValue(cell?.value, dataType)
                : undefined;
            if (cell) {
                cell.dataType = dataType.getDto();
                cell.formattedValue = formattedValue;
            } else {
                const newCell: FitCellDto = { dataType: dataType.getDto() };
                if (formattedValue) newCell.formattedValue = formattedValue;
                this.cells.set(rowId, colId, newCell);
            }
        } else if (cell) {
            delete cell['dataType'];
            delete cell['formattedValue'];
            !Object.keys(cell).length && this.cells.remove(rowId, colId);
        }
        return this;
    }

    getCellType(rowId: number, colId: number): DataTypeName {
        const cellValue = this.getCellValue(rowId, colId);
        const dataTypeName = this.getCellDataType(rowId, colId)?.getName();
        return this.cellType(cellValue, dataTypeName);
    }

    getCellFormattedValue(rowId: number, colId: number): string | undefined {
        return this.cells.get(rowId, colId)?.formattedValue;
    }

    private adaptNumberFormatsToNewLocale(dictionary: FitLanguageDictionary, prevDictionary: FitLanguageDictionary
    ): void {
        this.forEachCell((rowId: number, colId: number): void => {
            const dataType: FitDataType | undefined = this.getCellDataType(rowId, colId);
            if (!dataType || dataType.getName() !== 'number' || !dataType.getFormat()) return;
            const [part1, part2] = dataType.getFormat()!.split(prevDictionary.getText('thousandSeparator'));
            let format: string;
            if (part2) {
                format =
                    part1 +
                    dictionary.getText('thousandSeparator') +
                    part2.replace(prevDictionary.getText('decimalPoint'), dictionary.getText('decimalPoint'));
            } else {
                format = part1.replace(prevDictionary.getText('decimalPoint'), dictionary.getText('decimalPoint'));
            }
            this.setCellDataType(rowId, colId, createDataType<FitDataType>(dataType.getName(), format));
        });
    }

    private adaptBooleanValuesToNewLocale(dictionary: FitLanguageDictionary): void {
        this.cells.forEach((rowId: number, colId: number): void => {
            const cell = this.cells.get(rowId, colId);
            if (!cell) return;
            else if (cell.value === true) cell.formattedValue = dictionary.getText('TRUE');
            else if (cell.value === false) cell.formattedValue = dictionary.getText('FALSE');

        });
    }

    private cellFormattedValue(
        value: Value,
        dataType?: FitDataType
    ): string | undefined {
        try {
            const cellType: DataTypeName = this.cellType(value, dataType?.getName());
            if (cellType === 'number') {
                return createCellNumberFormatter().formatValue(value, dataType?.getFormat());
            } else if (cellType === 'date-time') {
                return createCellDateFormatter().formatValue(value, dataType?.getFormat());
            } else if (cellType === 'boolean') {
                return createCellBooleanFormatter().formatValue(value);
            }
        } catch (error) {
            if (error instanceof MissingFactoryError) return undefined;
            return '#InvalidFormat';
        }
        return undefined;
    }

    private cellType(cellValue?: Value, dataTypeName?: DataTypeName): DataTypeName {
        if (dataTypeName) {
            return dataTypeName;
        } else {
            if (cellValue !== undefined) return (typeof cellValue) as DataTypeName;
        }
        return 'string';
    }

    /** Table data */

    setDataDef(rowId: number, colId: number, dataDef?: FitDataDef): this {
        if (dataDef) this.dataDefs.set(rowId, colId, dataDef.getDto());
        else this.dataDefs.remove(rowId, colId);
        return this;
    }

    getDataDef(rowId: number, colId: number): FitDataDef | undefined {
        const dto: FitDataDefDto | undefined = this.dataDefs.get(rowId, colId);
        return dto ? createDataDef4Dto<FitDataDef>(dto) : undefined;
    }

    forEachDataDef(dataDefFn: (rowId: number, colId: number) => void): void {
        this.dataDefs.forEach(dataDefFn);
    }

    setDataRefPerspective(perspective: boolean): this {
        this.dto.isDataRefPerspective = perspective;
        return this;
    }

    isDataRefPerspective(): boolean {
        return this.dto.isDataRefPerspective ?? false;
    }

    setCellDataRef(rowId: number, colId: number, dataRef?: string): this {
        const cell = this.cells.get(rowId, colId);
        if (dataRef) {
            if (cell) cell.dataRef = dataRef;
            else this.cells.set(rowId, colId, { dataRef })
        } else if (cell) {
            delete cell['dataRef'];
            !Object.keys(cell).length && this.cells.remove(rowId, colId);
        }
        return this;
    }

    getCellDataRef(rowId: number, colId: number): string | undefined {
        return this.cells.get(rowId, colId)?.dataRef;
    }

    loadData(...dataSet: FitData[]): this {
        const dataDefs = this.getDataDefs(dataSet);
        for (const data of dataSet) {
            const dataDef = dataDefs.get(data.getDataDef());
            if (!dataDef) continue;
            this.expandTableRowsByData(dataDef, data)
            const keyFields: string[] = dataDef.item.getKeyFields();
            const keyLength = keyFields.length ?? 0;
            const valueFields: string[] = dataDef.item.getValueFields();
            const values: (Value | null)[][] = data.getValues();
            for (let i = 0; i < values.length; i++) {
                const keys = this.getRowKeys(dataDef, data, i, keyLength);
                for (let j = keyLength; j < values[i].length; j++) {
                    const value = values[i][j];
                    const rowId = i + dataDef.rowId;
                    const colId = j + dataDef.colId - keyLength;
                    const valueField: string = valueFields[colId];
                    const dataRef = keys
                        ? createDataRef(dataDef.item.getName(), valueField, keys)
                        : this.getCellDataRef(rowId, colId);
                    this.setCellDataRef(rowId, colId, dataRef);
                    this.setCellValue(rowId, colId, value ?? undefined);
                }
            }
        }
        return this;
    }

    private getDataDefs(dataSet: FitData[]): Map<string, DataDefWrapper> {
        const dataDefs = new Map<string, DataDefWrapper>();
        this.dataDefs.forEach((rowId, colId) => {
            const dto = this.dataDefs.get(rowId, colId);
            dto && dataDefs.set(dto.name, { rowId, colId, item: createDataDef4Dto(dto) });
        });
        for (const data of dataSet) {
            if (!dataDefs.has(data.getDataDef())) {
                throw new Error(`Missing data definition for data dto ${data.getDataDef()}`);
            }
        }
        return dataDefs;
    }

    private expandTableRowsByData(dataDef: DataDefWrapper, data: FitData): void {
        if (!dataDef.item.canExpandRows()) return;
        const move = data.getValues().length - 1;
        for (let i = this.dto.numberOfRows - 1; i >= dataDef.rowId; i--) {
            this.moveRow(i, move);
            this.removeRow(i);
            this.moveRowCells(i, move);
            this.removeRowCells(i);
        }
        this.dto.numberOfRows += move;
        this.copyCellStyleAndDataType(dataDef.rowId + move, dataDef.rowId, dataDef.rowId + move - 1);
    }

    private copyCellStyleAndDataType(sourceRowId: number, fromRowId: number, toRowId: number): void {
        for (let colId = 0; colId < this.getNumberOfCols(); colId++) {
            const sourceStyleName = this.getCellStyleName(sourceRowId, colId);
            const sourceDataType = this.getCellDataType(sourceRowId, colId);
            for (let rowId = fromRowId; rowId <= toRowId; rowId++) {
                this.setCellStyleName(rowId, colId, sourceStyleName);
                this.setCellDataType(rowId, colId, sourceDataType);
            }
        }
    }

    private getRowKeys(
        dataDef: DataDefWrapper, data: FitData, rowId: number, keyLength?: number): Fields | undefined {
        let keys: Fields | undefined = undefined;
        if (keyLength) {
            keys = {};
            for (let j = 0; j < keyLength; j++) {
                keys[dataDef.item.getKeyFields()[j]] = data.getValues()[rowId][j];
            }
        }
        return keys;
    }
}

export class FitTableFactory implements TableFactory {
    public createTable(): FitTable {
        return new FitTable();
    }

    public createTable4Dto(dto: FitTableDto): FitTable {
        return new FitTable(dto);
    }
}