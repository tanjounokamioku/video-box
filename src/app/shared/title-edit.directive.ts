import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appContentEditable]',
})
export class TitleEditDirective {
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event.target']) onClick(target: HTMLElement) {
    if (target.isEqualNode(this.el.nativeElement)) {
      this.el.nativeElement.contentEditable = 'true';
      this.el.nativeElement.focus();
    }
  }

  @HostListener('keydown.enter') onEnter() {
    this.el.nativeElement.contentEditable = 'false';
  }

  @HostListener('blur') onBlur() {
    this.el.nativeElement.contentEditable = 'false';
  }
}
