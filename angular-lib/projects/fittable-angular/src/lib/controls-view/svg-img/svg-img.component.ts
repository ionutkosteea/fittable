import { Component, inject, input } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";


@Component({
  selector: 'fit-svg-img',
  standalone: true,
  template: '<span class="img-container" [innerHTML]="getContent()"></span>',
  styles: [
    `
      .img-container {
        display: flex;
        align-items: center;
        pointer-events: none;
      }
    `
  ]
})
export class SvgImgComponent {
  content = input<string>();

  private readonly domSanitizer = inject(DomSanitizer);

  getContent(): SafeHtml | undefined {
    const htmlContent = this.content();
    return htmlContent ? this.domSanitizer.bypassSecurityTrustHtml(htmlContent) : undefined;
  }
}
