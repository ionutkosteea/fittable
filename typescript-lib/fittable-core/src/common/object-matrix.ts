import { ObjectListDto } from "./object-list.js";

export type ObjectMatrixDto<Obj> = { [rowId: number]: ObjectListDto<Obj> }

export class ObjectMatrix<Obj> {
    constructor(private readonly dto: ObjectMatrixDto<Obj> = {}) { }

    getDto(): ObjectMatrixDto<Obj> {
        return this.dto;
    }

    set(rowId: number, colId: number, obj: Obj): this {
        if (!this.dto[rowId]) this.dto[rowId] = {};
        this.dto[rowId][colId] = obj;
        return this;
    }

    get(rowId: number, colId: number): Obj | undefined {
        return this.dto[rowId] && this.dto[rowId][colId];
    }

    remove(rowId: number, colId: number): this {
        if (!this.dto[rowId] || !this.dto[rowId][colId]) return this;
        delete this.dto[rowId][colId];
        !Object.keys(this.dto[rowId]).length && delete this.dto[rowId];
        return this;
    }

    removeRow(rowId: number): this {
        if (this.dto) {
            delete this.dto[rowId];
        }
        return this;
    }

    moveRow(rowId: number, move: number): this {
        if (this.dto && this.dto[rowId]) {
            const row = { ...this.dto[rowId] };
            delete this.dto[rowId];
            this.dto[rowId + move] = row;
        }
        return this;
    }


    removeCol(colId: number): this {
        for (const rowId of Object.keys(this.dto)) {
            delete this.dto[Number(rowId)][colId];
        }
        return this;
    }

    moveCol(colId: number, move: number): this {
        for (const rowId of Object.keys(this.dto)) {
            const row = this.dto[Number(rowId)];
            const obj = typeof row[colId] === 'object'
                ? { ...row[colId] }
                : row[colId];
            if (obj) {
                delete row[colId];
                row[colId + move] = obj;
            }
        }
        return this;
    }

    forEach(objFn: (rowId: number, colId: number) => void): void {
        for (const i of Object.keys(this.dto)) {
            for (const j of Object.keys(this.dto[Number(i)])) {
                objFn(Number(i), Number(j));
            }
        }
    }
}