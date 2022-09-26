import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
  selector: "[highlight]",
})
export class HighlightDirective implements OnChanges {
  @Input() highlight!: string;
  @Input() fullText!: string;

  constructor(private el: ElementRef) {
  }
  
  ngOnChanges() {
    if (this.fullText && this.highlight) {
      let html = this.fullText;
      const regex = new RegExp(`(${this.highlight})`, 'gi');
      this.el.nativeElement.innerHTML = html.replace(regex, `<span class='highlighted-text'>$1</span>`);
    } else {
      this.el.nativeElement.innerHTML = this.fullText;
    }
  }
}
