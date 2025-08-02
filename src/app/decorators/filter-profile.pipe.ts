import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from 'src/app/classes/profile';

@Pipe({
  name: 'filterProfile',
  standalone: true
})
export class FilterProfilePipe implements PipeTransform {
  transform(arr: (Profile | null | undefined)[]): Profile[] {
    return arr.filter((p): p is Profile => !!p);
  }
}
