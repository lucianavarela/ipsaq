import { Pipe, PipeTransform } from '@angular/core';
import { Profile } from '../classes/profile';

@Pipe({
  name: 'orderByName',
  standalone: true
})
export class OrderByNamePipe implements PipeTransform {
  transform(profiles: Profile[]): Profile[] {
    if (!profiles) return [];
    return [...profiles].sort((a, b) => {
      const nameA = (a.nickname || '').toLowerCase();
      const nameB = (b.nickname || '').toLowerCase();
      return nameA.localeCompare(nameB, 'es');
    });
  }
}
