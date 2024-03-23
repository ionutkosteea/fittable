import { Directive, ElementRef, Input, Renderer2, inject } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[fitSvgImage]',
})
export class SvgImageDirective {
  @Input() svgContent?: string;

  private readonly element = inject(ElementRef);
  private readonly renderer = inject(Renderer2);

  ngOnInit() {
    this.insertSvg();
  }

  private insertSvg() {
    if (!this.svgContent) return;
    this.element.nativeElement.innerHTML = this.svgContent;
  }
}
