import { Component } from '@angular/core';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.scss'
})

export class DownloadsComponent {
  filtersClasses: string = 'filter-choir filter-players filter-directors';

  constructor() {

  }



  onFiltersChange(event: any) {
    this.filtersClasses = '';
    event.value.forEach((f: string) => this.filtersClasses = this.filtersClasses.concat(` filter-${f}`));
  }
}
