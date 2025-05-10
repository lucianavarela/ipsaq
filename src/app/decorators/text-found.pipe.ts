import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFound',
  standalone: true
})
export class TextFoundPipe implements PipeTransform {

  transform(fullText: string, searchedText: string): string {
    if (fullText && searchedText) {
      let text = '';
      let updatedText = fullText;
      let match, normalizedText='';
      const term = searchedText.normalize("NFD").replace(/\p{Diacritic}/giu, "");
      const regex = new RegExp(`${term}`, "gi");
      
      do {
        normalizedText = updatedText.normalize("NFD").replace(/\p{Diacritic}/giu, "");
        match = regex.exec(normalizedText);

        if (match) {
          text = text+updatedText.substring(0, match.index)+updatedText.substring(match.index,match.index+term.length).toUpperCase();
          updatedText = updatedText.substring(match.index + term.length, updatedText.length);
        } else {
          if (text.length != updatedText.length) text += updatedText;
          break;
        }
      } while (true);

      return text
    } else {
      return fullText;
    }
  }

}
