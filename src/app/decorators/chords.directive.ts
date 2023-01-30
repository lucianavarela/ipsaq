import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector: "[chords]",
})
export class ChordsDirective implements OnChanges {
  @Input() chords!: string | undefined;

  constructor(private el: ElementRef) {
  }
  
  ngOnChanges() {
    let text = this.chords;
    if (text) {
      const regex = new RegExp(`\$\{([a-zA-Z0-9]+)\}`, 'gi');
      text = text.replace(regex, `<span class='color'>$1</span>`);
      console.log(text)
      this.el.nativeElement.innerHTML = text;
    }
  }
}
