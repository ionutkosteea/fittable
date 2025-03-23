export type ObjectListDto<Obj> = { [id: number]: Obj }

export class ObjectList<Obj> {
    constructor(private readonly dto: ObjectListDto<Obj> = {}) { }

    getDto(): ObjectListDto<Obj> {
        return this.dto;
    }

    set(id: number, obj: Obj): this {
        this.dto[id] = obj;
        return this;
    }

    get(id: number): Obj | undefined {
        return this.dto[id];
    }

    remove(id: number): this {
        delete this.dto[id];
        return this;
    }

    move(id: number, move: number): this {
        if (this.dto && this.dto[id]) {
            const obj: Obj = typeof this.dto[id] === 'object'
                ? { ...this.dto[id] }
                : this.dto[id];
            delete this.dto[id];
            this.dto[id + move] = obj;
        }
        return this;
    }
}