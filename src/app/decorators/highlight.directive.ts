import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
  selector: "[highlight]",
})
export class HighlightDirective implements OnChanges {
  @Input() highlight!: string;
  @Input() fullText!: string;

  constructor(private el: ElementRef) {}

  ngOnChanges() {
    if (this.fullText && this.highlight) {
      let text = '';
      let updatedText = this.fullText;
      let match, normalizedText='';
      const term = this.highlight.normalize("NFD").replace(/\p{Diacritic}/giu, "");
      const regex = new RegExp(`${term}`, "gi");
      
      do {
        normalizedText = updatedText.normalize("NFD").replace(/\p{Diacritic}/giu, "");
        match = regex.exec(normalizedText);

        if (match) {
          text = text+updatedText.substring(0, match.index)+'<span class="highlighted-text">'+updatedText.substring(match.index,match.index+term.length)+'</span>';
          updatedText = updatedText.substring(match.index + term.length, updatedText.length);
        } else {
          if (text.length != updatedText.length) text += updatedText;
          break;
        }
      } while (true);

      this.el.nativeElement.innerHTML = text
    } else {
      this.el.nativeElement.innerHTML = this.fullText;
    }
  }
}
