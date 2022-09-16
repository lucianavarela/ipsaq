import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textFound'
})
export class TextFoundPipe implements PipeTransform {

  transform(text: string, searchedText: string): string {
    if (text) {
      const regex = new RegExp(`${searchedText}`, 'gi');
      return text.replace(regex, searchedText.toUpperCase());
    }
    return '';
  }

}
