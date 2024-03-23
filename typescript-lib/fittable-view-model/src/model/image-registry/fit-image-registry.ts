import {
  ImageRegistry,
  ImageRegistryFactory,
  getImageRegistry as getCoreImageRegistry,
} from 'fittable-core/view-model';

import { FitImageId, FitImages } from './fit-image-ids.js';
import { FIT_IMAGES } from './fit-images.js';

export class FitImageRegistry implements ImageRegistry<FitImageId> {
  private images: FitImages = {};

  public setAll(images: FitImages): this {
    this.images = images;
    return this;
  }

  public set(id: FitImageId, url: string): this {
    this.images[id] = url;
    return this;
  }

  public remove(id: FitImageId): this {
    Reflect.deleteProperty(this.images, id);
    return this;
  }

  public removeAll(): this {
    this.images = {};
    return this;
  }

  public getIds(): FitImageId[] {
    return Reflect.ownKeys(this.images) as FitImageId[];
  }

  public getUrl(id: FitImageId): string | undefined {
    const url: string | undefined = this.images[id];
    !url && console.error(`No image was found for ID '${id}'.`);
    return url;
  }
}

export class FitImageRegistryFactory implements ImageRegistryFactory {
  public createImageRegistry(): FitImageRegistry {
    return new FitImageRegistry().setAll(FIT_IMAGES);
  }
}

export function getImageRegistry(): ImageRegistry<FitImageId> {
  return getCoreImageRegistry<FitImageId>();
}
