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
      const regex = new RegExp(`\{([a-zA-Z0-9]+)\}`, 'gm');
      console.log(text.match(regex))
      text = text.replace(regex, `<span class='chord'>$1</span>`);
      this.el.nativeElement.innerHTML = text;
      console.log(text)
    }
  }
}
