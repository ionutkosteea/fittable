import { getViewModelConfig } from '../view-model-config.js';

export type Images = { [id: string]: string };

export interface ImageRegistry {
  setImages(images: Images): this;
  setImage(imgId: string, imgUrl: string): this;
  removeImage(imgId: string): this;
  removeAllImages(): this;
  getImageIds(): string[];
  getImageUrl(imgId: string): string | undefined;
}

export interface ImageRegistryFactory {
  createImageRegistry(): ImageRegistry;
}

export function createImageRegistry(): ImageRegistry {
  return getViewModelConfig().imageRegistryFactory.createImageRegistry();
}
