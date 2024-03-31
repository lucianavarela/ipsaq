import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noAccents'
})
export class NoAccentsPipe implements PipeTransform {

  transform(value: string): string {
    if (value) {
      let accent = [
        /[\300-\306]/g, /[\340-\346]/g, // A, a
        /[\310-\313]/g, /[\350-\353]/g, // E, e
        /[\314-\317]/g, /[\354-\357]/g, // I, i
        /[\322-\330]/g, /[\362-\370]/g, // O, o
        /[\331-\334]/g, /[\371-\374]/g, // U, u
        /[\321]/g, /[\361]/g, // N, n
        /[\307]/g, /[\347]/g, // C, c
      ],
        noaccent = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'N', 'n', 'C', 'c'];

      for (var i = 0; i < accent.length; i++) {
        value = value.replace(accent[i], noaccent[i]);
      }
    }
    return value;
  }

}
