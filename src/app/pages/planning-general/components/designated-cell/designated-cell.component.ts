import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from 'src/app/classes/profile';
import { PlanningService } from 'src/app/services/planning.service';

@Component({
  selector: 'app-designated-cell',
  templateUrl: './designated-cell.component.html',
  styleUrls: ['./designated-cell.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class DesignatedCellComponent {
  @Input() profiles: Profile[] = [];
  @Input() date: string = '';
  @Input() table: { [profileId: number]: { [date: string]: boolean } } = {};

  @Output() designatedChange = new EventEmitter<{
    profileId: number;
    date: string;
    checked: boolean;
  }>();

  constructor(public planningData: PlanningService) {}

  onCheckboxChange(event: Event, profileId: number): void {
    this.designatedChange.emit({
      profileId,
      date: this.date,
      checked: (event.target as HTMLInputElement).checked
    });
  }
}
