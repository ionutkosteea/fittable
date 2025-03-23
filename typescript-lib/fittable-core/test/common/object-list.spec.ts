import { } from 'jasmine';

import { ObjectList } from '../../dist/common/index.js';

describe('object-list.spec.ts', () => {
    it('set -> get', () => {
        const list = new ObjectList()
            .set(0, "Zero");
        expect(list.get(0)).toBe("Zero");
    });

    it('remove', () => {
        const list = new ObjectList({ 0: "Zero", 1: "One" });
        list.remove(0);
        expect(list.get(0)).toBeUndefined();
        expect(list.get(1)).toBe("One");
    });

    it('move', () => {
        const list = new ObjectList({ 0: "Zero", 1: "One" });
        list.move(1, 1);
        expect(list.get(0)).toBe("Zero");
        expect(list.get(1)).toBeUndefined();
        expect(list.get(2)).toBe("One");
    })
});