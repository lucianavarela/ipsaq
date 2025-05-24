import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from 'src/app/classes/profile';
import { PlanningDataService } from 'src/app/services/planning-data.service';

@Component({
  selector: 'app-availability-cell',
  templateUrl: './availability-cell.component.html',
  styleUrls: ['./availability-cell.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AvailabilityCellComponent {
  @Input() profiles: Profile[] = [];
  @Input() date: string = '';
  @Input() type: 'available' | 'absent' = 'available';
  @Input() section: 'instruments' | 'choir' = 'instruments';
  @Input() showAddForm = false;
  @Input() selectedProfileId: number | null = null;

  @Output() addProfile = new EventEmitter<void>();
  @Output() showFormChange = new EventEmitter<boolean>();
  @Output() selectedProfileChange = new EventEmitter<number>();

  constructor(public planningData: PlanningDataService) {}

  onAddClick(): void {
    this.showFormChange.emit(true);
  }

  onProfileSelect(id: number): void {
    this.selectedProfileChange.emit(id);
  }

  onAddConfirm(): void {
    this.addProfile.emit();
  }
}
