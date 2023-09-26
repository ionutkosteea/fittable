export type Images<Id extends string> = { [id in Id]?: string };

export interface ImageRegistry<Id extends string> {
  setAll(images: Images<Id>): this;
  set(id: Id, url: string): this;
  remove(id: Id): this;
  removeAll(): this;
  getIds(): Id[];
  getUrl(id: Id): string | undefined;
}

export interface ImageRegistryFactory {
  createImageRegistry(): ImageRegistry<string>;
}
