import {
  ScrollContainer,
  ScrollElement,
  ScrollContainerListener,
  ScrollContainerListenerFactory,
} from 'fittable-core/view-model/index.js';

export class FitScrollContainerListener implements ScrollContainerListener {
  constructor(
    readonly div: ScrollElement,
    private readonly scroller: ScrollContainer
  ) {
    scroller.init(div).resizeViewportHeight().resizeViewportWidth();
  }

  public onScroll(): void {
    this.scroller.renderModel();
  }
}

export class FitScrollContainerListenerFactory
  implements ScrollContainerListenerFactory
{
  public createScrollContainerListener(
    div: ScrollElement,
    scroller: ScrollContainer
  ): FitScrollContainerListener {
    return new FitScrollContainerListener(div, scroller);
  }
}
