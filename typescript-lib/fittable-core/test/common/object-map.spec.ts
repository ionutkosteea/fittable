import { } from 'jasmine';

import { ObjectMap } from '../../dist/common/index.js';

describe('object-map.spec.ts', () => {
    it('set -> get', () => {
        const map = new ObjectMap<string, string>()
            .set('0', 'Zero');
        expect(map.get('0')).toBe('Zero');
    });

    it('remove', () => {
        const map = new ObjectMap<string, string>({ '0': 'Zero', '1': 'One' })
        map.remove('0');
        expect(map.get('0')).toBeUndefined();
        expect(map.get('1')).toBe('One');
    });

    it('getKeys', () => {
        const map = new ObjectMap<string, string>({ '0': 'Zero', '1': 'One' })
        expect(map.getKeys()[0]).toBe('0');
        expect(map.getKeys()[1]).toBe('1');
    });

    it('getObjects', () => {
        const map = new ObjectMap<string, string>({ '0': 'Zero', '1': 'One' })
        expect(map.getObjects()[0]).toBe('Zero');
        expect(map.getObjects()[1]).toBe('One');
    });
});
