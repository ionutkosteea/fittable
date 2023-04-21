import { ImageRegistry, Images } from '../../../dist/view-model/index.js';

export class TstImageRegistry implements ImageRegistry {
  setImages(images: Images): this {
    throw new Error('Method not implemented.');
  }
  setImage(imgId: string, imgUrl: string): this {
    throw new Error('Method not implemented.');
  }
  removeImage(imgId: string): this {
    throw new Error('Method not implemented.');
  }
  removeAllImages(): this {
    throw new Error('Method not implemented.');
  }
  getImageIds(): string[] {
    throw new Error('Method not implemented.');
  }
  getImageUrl(imgId: string): string | undefined {
    throw new Error('Method not implemented.');
  }
}
