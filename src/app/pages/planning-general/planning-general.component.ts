import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { Title } from "@angular/platform-browser";
import { Profile } from "src/app/classes/profile";
import { Availability } from "src/app/classes/availability";
import { PlanningService } from "src/app/services/planning.service";
import { ProfileColorPipe } from "src/app/decorators/profile-color.pipe";
import { OrderByNamePipe } from "src/app/decorators/order-by-name.pipe";
import { AvailabilityCellComponent } from "./availability-cell/availability-cell.component";

type Section = 'instruments' | 'choir' | 'directing';
type Status = 'available' | 'absent' | 'unique';

interface AvailabilityChanges {
  is_available?: boolean;
  is_designated?: boolean;
  is_directing?: boolean;
}

@Component({
  selector: "app-planning-general",
  templateUrl: "./planning-general.component.html",
  styleUrls: ["./planning-general.component.scss"],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    AvailabilityCellComponent,
    ProfileColorPipe,
    OrderByNamePipe
  ],
})
export class PlanningGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  availabilities: Availability[] = [];
  profiles: Profile[] = [];
  sermonDates: string[] = [];
  months: { name: string; dates: string[] }[] = [];
  table: { [profileId: number]: { [date: string]: boolean } } = {};
  grouped: {
    [date: string]: {
      instruments: { available: Profile[]; absent: Profile[] };
      choir: { available: Profile[]; absent: Profile[] };
      directing?: Profile | null;
    };
  } = {};

  showAddProfile: { [key: string]: boolean } = {};
  selectedProfileId: { [key: string]: number|null } = {};
  showSummary = false;
  showAddSpecialDate = false;
  newSpecialDate: string = '';

  constructor(
    private sTitle: Title,
    public planningData: PlanningService
  ) {}

  async ngOnInit() {
    this.sTitle.setTitle('Planificación General');
    await this.loadData();
  }

  async loadData() {
    // Cargar datos básicos
    const { availabilities, profiles } = await this.planningData.getAvailabilities();
    this.availabilities = availabilities;
    this.profiles = profiles;

    // Cargar fechas especiales y domingos
    const specialSermons = await this.planningData.getSpecialSermons();
    const specialDates = specialSermons.map(e => e.sermon_date);
    const sundays = this.planningData.getSundays();
    this.sermonDates = Array.from(new Set([...sundays, ...specialDates])).sort();

    // Agrupar datos
    this.months = this.planningData.groupByMonth(this.sermonDates);
    this.table = this.planningData.buildAvailabilityTable(this.profiles, this.sermonDates, this.availabilities);
    this.grouped = this.planningData.groupAvailabilitiesByDate(this.sermonDates, this.availabilities);
  }
  async onDesignatedChange(event: { profileId: number; date: string; checked: boolean }): Promise<void> {
    const availability = this.getAvailability(event.profileId, event.date);
    if (!availability?.id) return;
    await this.planningData.updateAvailability(availability.id, { is_designated: event.checked });
    await this.loadData();
  }

  async onDesignatedCheckboxChange(event: { profileId: number; date: string; checked: boolean }): Promise<void> {
    await this.onDesignatedChange(event);
  }

  async addProfileToCell(section: Section, status: Status, date: string): Promise<void> {
    const key = `${section}-${status}-${date}`;
    const profileId = this.selectedProfileId[key];
    if (!profileId) return;

    const is_available = status === 'available';
    const existing = this.getAvailability(profileId, date);

    if (existing?.id) {
      if (existing.is_available !== is_available) {
        const changes: AvailabilityChanges = { is_available };
        if (!is_available && existing.is_designated) {
          changes.is_designated = false;
        }
        await this.planningData.updateAvailability(existing.id, changes);
      }
    } else {
      await this.planningData.createAvailability({
        sermon_date: date,
        id_user: profileId,
        is_available
      });
    }

    this.showAddProfile[key] = false;
    this.selectedProfileId[key] = null;
    await this.loadData();
  }

  addProfileToDirecting(date: string): Promise<void> {
    return this.onDirectorAdd(date);
  }

  async onDirectorAdd(date: string): Promise<void> {
    const key = `directing-unique-${date}`;
    const profileId = this.selectedProfileId[key];
    if (!profileId) return;

    // Desmarcar director actual si existe
    for (const a of this.availabilities.filter(a => a.sermon_date === date && a.is_directing)) {
      if (a.id) {
        await this.planningData.updateAvailability(a.id, { is_directing: false });
      }
    }

    // Asignar nuevo director
    const existing = this.getAvailability(profileId, date);

    if (existing?.id) {
      await this.planningData.updateAvailability(existing.id, {
        is_directing: true,
        is_available: false,
        is_designated: false
      });
    } else {
      await this.planningData.createAvailability({
        sermon_date: date,
        id_user: profileId,
        is_directing: true,
        is_available: false,
        is_designated: false
      });
    }

    this.showAddProfile[key] = false;
    this.selectedProfileId[key] = null;
    await this.loadData();
  }

  async onAvailabilityAdd(section: Section, status: Status, date: string): Promise<void> {
    const key = `${section}-${status}-${date}`;
    const profileId = this.selectedProfileId[key];
    if (!profileId) return;

    const is_available = status === 'available';
    const existing = this.getAvailability(profileId, date);

    if (existing?.id) {
      if (existing.is_available !== is_available) {
        const changes: AvailabilityChanges = { is_available };
        if (!is_available && existing.is_designated) {
          changes.is_designated = false;
        }
        await this.planningData.updateAvailability(existing.id, changes);
      }
    } else {
      await this.planningData.createAvailability({
        sermon_date: date,
        id_user: profileId,
        is_available
      });
    }

    this.showAddProfile[key] = false;
    this.selectedProfileId[key] = null;
    await this.loadData();
  }

  async onToggleDesignated({ profileId, date }: { profileId: number|undefined, date: string }) {
    const availability = this.getAvailability(profileId, date);
    if (!availability?.id) return;
    await this.planningData.updateAvailability(availability.id, { is_designated: !availability.is_designated });
    await this.loadData();
  }

  getAvailability(profileId: number|undefined, date: string): Availability | undefined {
    return this.availabilities.find(a => 
      a.profile?.id == profileId && a.sermon_date == date
    );
  }

  getDirectorName(date: string): string {
    const director = this.grouped[date]?.directing;
    return director?.nickname ?? '';
  }

  getDesignatedBySection(date: string) {
    return {
      instruments: this.availabilities
        .filter(a => a.sermon_date === date && a.is_designated && a.profile?.band_role)
        .map(a => a.profile?.nickname || ''),
      choir: this.availabilities
        .filter(a => a.sermon_date === date && a.is_designated && a.profile?.choir_role)
        .map(a => a.profile?.nickname || '')
    };
  }

  handleGlobalClick = (event: MouseEvent) => {
    const openKeys = Object.keys(this.showAddProfile).filter(k => this.showAddProfile[k]);
    if (openKeys.length === 0) return;

    for (const key of openKeys) {
      const el = document.querySelector(`[data-add-profile-key='${key}']`);
      if (el && el.contains(event.target as Node)) return;
    }

    for (const key of openKeys) {
      this.showAddProfile[key] = false;
      this.selectedProfileId[key] = null;
    }
  }

  getProfilesForSection(section: Section): Profile[] {
    switch (section) {
      case 'instruments':
        return this.profiles.filter(p => p.band_role);
      case 'choir':
        return this.profiles.filter(p => p.choir_role);
      case 'directing':
        return this.profiles.filter(p => p.direction_role);
      default:
        return [];
    }
  }

  openAddProfile(section: Section, status: Status, date: string): void {
    const key = `${section}-${status}-${date}`;
    this.showAddProfile[key] = true;
    this.selectedProfileId[key] = null;
  }

  ngAfterViewInit() {
    document.addEventListener('mousedown', this.handleGlobalClick, true);
  }

  ngOnDestroy() {
    document.removeEventListener('mousedown', this.handleGlobalClick, true);
  }

  openAddSpecialDate() {
    this.showAddSpecialDate = true;
    this.newSpecialDate = '';
  }

  async addSpecialDate() {
    if (!this.newSpecialDate) return;
    await this.planningData.addSpecialSermon(this.newSpecialDate);
    this.showAddSpecialDate = false;
    this.newSpecialDate = '';
    await this.loadData();
  }

  getAvailabilitySummary() {
    const designatedAvailabilities = this.availabilities.filter(a => 
      a.is_designated || a.is_directing
    );
    return this.planningData.getAvailabilitySummary(designatedAvailabilities);
  }
}
