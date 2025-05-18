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
      const nameA = (a.nickname || a.first_name || a.email || '').toLowerCase();
      const nameB = (b.nickname || b.first_name || b.email || '').toLowerCase();
      return nameA.localeCompare(nameB, 'es');
    });
  }
}
