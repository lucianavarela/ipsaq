import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from 'src/app/classes/profile';
import { PlanningService } from 'src/app/services/planning.service';
import { ProfileColorPipe } from 'src/app/decorators/profile-color.pipe';

@Component({
  selector: 'app-availability-cell',
  templateUrl: './availability-cell.component.html',
  styleUrls: ['./availability-cell.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ProfileColorPipe]
})
export class AvailabilityCellComponent {
  @Input() profiles: Profile[] = [];
  @Input() profileOptions: Profile[] = [];
  @Input() date: string = '';
  @Input() type: 'available' | 'absent' | 'directing' = 'available';
  @Input() section: 'instruments' | 'choir' | 'directing' = 'instruments';
  @Input() showAddForm = false;
  @Input() selectedProfileId: number | null = null;
  @Input() disabled: boolean = false;

  @Output() addProfile = new EventEmitter<void>();
  @Output() showFormChange = new EventEmitter<boolean>();
  @Output() selectedProfileChange = new EventEmitter<number | null>();

  constructor(public planningData: PlanningService) {}

  onAddClick(): void {
    this.showFormChange.emit(true);
  }

  onProfileSelect(id: string): void {
    this.selectedProfileChange.emit(id ? Number(id) : null);
  }

  onAddConfirm(): void {
    this.addProfile.emit();
  }

  onCancelClick(): void {
    this.showFormChange.emit(false);
  }
}
