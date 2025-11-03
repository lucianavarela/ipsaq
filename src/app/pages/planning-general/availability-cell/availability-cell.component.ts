import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from 'src/app/classes/profile';
import { PlanningService } from 'src/app/services/planning.service';
import { ProfileColorPipe } from 'src/app/decorators/profile-color.pipe';
import { Availability } from 'src/app/classes/availability';

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
  filteredProfileOptions: Profile[] = [];
  @Input() date: string = '';
  @Input() type: 'available' | 'absent' | 'directing' = 'available';
  @Input() section: 'instruments' | 'choir' | 'directing' = 'instruments';
  @Input() showAddForm = false;
  @Input() selectedProfileId: number | null = null;
  @Input() disabled: boolean = false;
  @Input() availabilities: Availability[] = [];

  @Output() addProfile = new EventEmitter<void>();
  @Output() showFormChange = new EventEmitter<boolean>();
  @Output() selectedProfileChange = new EventEmitter<number | null>();
  @Output() toggleDesignated = new EventEmitter<{ profileId: number|undefined, date: string }>();

  constructor(public planningData: PlanningService) {
  }
  
  ngOnInit() {
    this.filterProfileOptions();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['profiles'] || changes['profileOptions']) {
      this.filterProfileOptions();
    }
  }

  filterProfileOptions() {
    this.filteredProfileOptions = this.profileOptions.filter(
      p => !this.profiles.some(profile => profile.id === p.id)
    );
  }

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

  isDesignated(profileId: number|undefined): boolean {
    return this.availabilities.some(a => a.profile?.id === profileId && a.sermon_date === this.date && a.is_designated);
  }

  onToggleDesignated(profileId: number|undefined): void {
    this.toggleDesignated.emit({ profileId, date: this.date });
  }
}
