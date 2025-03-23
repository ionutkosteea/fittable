import { } from 'jasmine';

import { ObjectMatrixDto, ObjectMatrix } from '../../dist/common/index.js';

describe('object-matrix.spec.ts', () => {
    it('set -> get', () => {
        const matrix = new ObjectMatrix();
        matrix.set(0, 0, "[0,0]")
        expect(matrix.get(0, 0)).toBe("[0,0]")
    });

    it('remove', () => {
        const matrixDto: ObjectMatrixDto<string> = { 0: { 0: "[0,0]" } };
        const matrix = new ObjectMatrix(matrixDto);
        matrix.remove(0, 0);
        expect(matrix.get(0, 0)).toBeUndefined();
    });

    it('removeRow', () => {
        const matrix = new ObjectMatrix()
            .set(0, 0, "[0,0]")
            .set(0, 1, "[0,1]")
            .set(1, 0, "[1,0]")
            .set(1, 1, "[1,1]");
        matrix.removeRow(0);
        expect(matrix.get(0, 0)).toBeUndefined();
        expect(matrix.get(0, 1)).toBeUndefined();
        expect(matrix.get(1, 0)).toBe('[1,0]');
        expect(matrix.get(1, 1)).toBe('[1,1]');
    });

    it('moveRow', () => {
        const matrix = new ObjectMatrix()
            .set(0, 0, '[0,0]')
            .set(0, 1, '[0,1]')
            .set(1, 0, '[1,0]')
            .set(1, 1, '[1,1]');
        matrix.moveRow(1, 1);
        expect(matrix.get(0, 0)).toBe('[0,0]');
        expect(matrix.get(0, 1)).toBe('[0,1]');
        expect(matrix.get(1, 0)).toBeUndefined();
        expect(matrix.get(1, 1)).toBeUndefined();
        expect(matrix.get(2, 0)).toBe('[1,0]');
        expect(matrix.get(2, 1)).toBe('[1,1]');
    });

    it('removeCol', () => {
        const matrix = new ObjectMatrix()
            .set(0, 0, "[0,0]")
            .set(0, 1, "[0,1]")
            .set(1, 0, "[1,0]")
            .set(1, 1, "[1,1]");
        matrix.removeCol(0);
        expect(matrix.get(0, 0)).toBeUndefined();
        expect(matrix.get(0, 1)).toBe('[0,1]');
        expect(matrix.get(1, 0)).toBeUndefined();
        expect(matrix.get(1, 1)).toBe('[1,1]');
    });

    it('moveCol', () => {
        const matrix = new ObjectMatrix()
            .set(0, 0, '[0,0]')
            .set(0, 1, '[0,1]')
            .set(1, 0, '[1,0]')
            .set(1, 1, '[1,1]');
        matrix.moveCol(1, 1);
        expect(matrix.get(0, 0)).toBe('[0,0]');
        expect(matrix.get(0, 1)).toBeUndefined();
        expect(matrix.get(0, 2)).toBe('[0,1]');
        expect(matrix.get(1, 0)).toBe('[1,0]');
        expect(matrix.get(1, 1)).toBeUndefined();
        expect(matrix.get(1, 2)).toBe('[1,1]');
    });
});