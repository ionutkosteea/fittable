import { getViewModelConfig } from '../view-model-config.js';

export type Images = { [id: string]: string };

export interface ImageRegistry<ImageId extends string> {
  setImages(images: Images): this;
  setImage(imgId: ImageId, imgUrl: string): this;
  removeImage(imgId: ImageId): this;
  removeAllImages(): this;
  getImageIds(): ImageId[];
  getImageUrl(imgId: ImageId): string | undefined;
}

export interface ImageRegistryFactory {
  createImageRegistry(): ImageRegistry<string>;
}

export function createImageRegistry<ImageId extends string>(): //
ImageRegistry<ImageId> {
  const imageRegistry: ImageRegistry<string> =
    getViewModelConfig().imageRegistryFactory.createImageRegistry();
  return imageRegistry as ImageRegistry<ImageId>;
}
