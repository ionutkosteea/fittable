import {
  ImageRegistry,
  ImageRegistryFactory,
  Images,
} from 'fit-core/view-model/index.js';
import { defaultImages, FitImages, toSvgUrl } from './fit-images.js';

export class FitImageRegistry<ImageId extends string>
  implements ImageRegistry<ImageId>
{
  private images: Images = {};

  public setImages(images: Images): this {
    this.images = images;
    return this;
  }

  public setImage(imgId: ImageId, imgUrl: string): this {
    this.images[imgId] = imgUrl;
    return this;
  }

  public removeImage(imgId: ImageId): this {
    Reflect.deleteProperty(this.images, imgId);
    return this;
  }

  public removeAllImages(): this {
    this.images = {};
    return this;
  }

  public getImageIds(): ImageId[] {
    return Reflect.ownKeys(this.images) as ImageId[];
  }

  public getImageUrl(imgId: ImageId): string | undefined {
    const imgUrl: string | undefined = this.images[imgId];
    !imgUrl && console.error('No image found for ID ' + imgId);
    return imgUrl;
  }
}

export type FitImageId = keyof FitImages;

export class FitImageRegistryFactory implements ImageRegistryFactory {
  public createImageRegistry(): ImageRegistry<FitImageId> {
    return new FitImageRegistry<FitImageId>() //
      .setImages(toSvgUrl(defaultImages));
  }
}
