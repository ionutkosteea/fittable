import { MobileLayout } from '../../../dist/view-model/index.js';

export class TstMobileLayout implements MobileLayout {
  bodyOffset = {};
  pageHeaderOffset = {};
  rowHeaderOffset = {};
  colHeaderOffset = {};
  bodySelectionRectangles = [];
  pageHeaderSelectionRectangles = [];
  rowHeaderSelectionRectangles = [];
  colHeaderSelectionRectangles = [];
  destroy(): void {
    throw new Error('Method not implemented.');
  }
}
