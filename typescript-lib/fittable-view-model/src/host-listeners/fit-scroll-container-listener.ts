import {
  FitHtmlDivElement,
  ScrollContainer,
  ScrollContainerListener,
  ScrollContainerListenerFactory,
} from 'fittable-core/view-model';

export class FitScrollContainerListener implements ScrollContainerListener {
  constructor(
    readonly div: FitHtmlDivElement,
    private readonly scrollContainer: ScrollContainer
  ) {
    scrollContainer //
      .setSize({
        getWidth: (): number => div.clientWidth,
        getHeight: (): number => div.clientHeight,
      })
      .setScroller({
        getLeft: (): number => div.scrollLeft,
        getTop: (): number => div.scrollTop,
        scroll: (left: number, top: number): void => div.scrollTo(left, top),
      });

    setTimeout((): void => {
      scrollContainer.renderModel();
    });
  }

  public onScroll(): void {
    this.scrollContainer.renderModel();
  }
}

export class FitScrollContainerListenerFactory
  implements ScrollContainerListenerFactory
{
  public createScrollContainerListener(
    div: FitHtmlDivElement,
    scrollContainer: ScrollContainer
  ): FitScrollContainerListener {
    return new FitScrollContainerListener(div, scrollContainer);
  }
}
