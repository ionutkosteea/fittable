export type ObjectMapDto<Key extends string, Obj> = { [key in Key]?: Obj }

export class ObjectMap<Key extends string, Obj> {

    constructor(private readonly dto: ObjectMapDto<Key, Obj> = {}) { }

    set(key: Key, obj: Obj): this {
        this.dto[key] = obj;
        return this;
    }

    get(key: Key): Obj | undefined {
        return this.dto[key];
    }

    remove(key: Key): this {
        delete this.dto[key];
        return this;
    }

    getKeys(): Key[] {
        return Object.keys(this.dto) as Key[];
    }

    getObjects(): Obj[] {
        return Object.values(this.dto);
    }
}