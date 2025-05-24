import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { OrderByNamePipe } from "src/app/decorators/order-by-name.pipe";
import { Title } from "@angular/platform-browser";
import { Profile } from "src/app/classes/profile";
import { Availability } from "src/app/classes/availability";
import { PlanningService } from "src/app/services/planning.service";
import { PlanningDataService } from "src/app/services/planning-data.service";

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
    OrderByNamePipe, 
    FormsModule
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

  private colorPalette: string[] = [
    "#fdfd03", "#499ae9", "#fe8b05", "#4eb72a", "#7bfbf6", "#05a149", "#ffc165", "#fe0312",
    "#0197fd", "#d1ae07", "#d355b4", "#8974dd", "#e55151"
  ];
  private profileColorMap: { [key: number]: string } = {};

  constructor(
    private sTitle: Title,
    private planningService: PlanningService,
    public planningData: PlanningDataService
  ) {}

  async ngOnInit() {
    this.sTitle.setTitle('Planificación General');
    await this.loadData();
  }

  async loadData() {
    // Cargar datos básicos
    const { availabilities, profiles } = await this.planningService.getAvailabilities();
    this.availabilities = availabilities;
    this.profiles = profiles;

    // Cargar fechas especiales y domingos
    const specialSermons = await this.planningService.getSpecialSermons();
    const specialDates = specialSermons.map(e => e.sermon_date);
    const sundays = this.planningService.getSundays();
    this.sermonDates = Array.from(new Set([...sundays, ...specialDates])).sort();

    // Agrupar datos
    this.months = this.planningData.groupByMonth(this.sermonDates);
    this.table = this.planningData.buildAvailabilityTable(this.profiles, this.sermonDates, this.availabilities);
    this.grouped = this.planningData.groupAvailabilitiesByDate(this.sermonDates, this.availabilities);
  }
  async onDesignatedChange(event: { profileId: number; date: string; checked: boolean }): Promise<void> {
    const availability = this.getAvailability(event.profileId, event.date);
    if (!availability?.id) return;
    await this.planningService.updateAvailability(availability.id, { is_designated: event.checked });
    await this.loadData();
  }

  async onDesignatedCheckboxChange(event: Event, profileId: number, date: string): Promise<void> {
    const checked = (event.target as HTMLInputElement).checked;
    await this.onDesignatedChange({ profileId, date, checked });
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
        await this.planningService.updateAvailability(existing.id, changes);
      }
    } else {
      await this.planningService.createAvailability({
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
        await this.planningService.updateAvailability(a.id, { is_directing: false });
      }
    }

    // Asignar nuevo director
    const existing = this.getAvailability(profileId, date);
    if (existing?.id) {
      await this.planningService.updateAvailability(existing.id, {
        is_directing: true,
        is_available: false,
        is_designated: false
      });
    } else {
      await this.planningService.createAvailability({
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
        await this.planningService.updateAvailability(existing.id, changes);
      }
    } else {
      await this.planningService.createAvailability({
        sermon_date: date,
        id_user: profileId,
        is_available
      });
    }

    this.showAddProfile[key] = false;
    this.selectedProfileId[key] = null;
    await this.loadData();
  }

  getAvailability(profileId: number, date: string): Availability | undefined {
    return this.availabilities.find(a => 
      a.profile?.id === profileId && a.sermon_date === date
    );
  }

  getDirectorName(date: string): string {
    const director = this.grouped[date]?.directing;
    return director ? this.planningData.getProfileName(director) : '';
  }

  getDesignatedBySection(date: string) {
    return {
      instruments: this.availabilities
        .filter(a => a.sermon_date === date && a.is_designated && a.profile?.band_role)
        .map(a => this.planningData.getProfileName(a.profile)),
      choir: this.availabilities
        .filter(a => a.sermon_date === date && a.is_designated && a.profile?.choir_role)
        .map(a => this.planningData.getProfileName(a.profile))
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

  getProfileColor(profileId: number | undefined | null, alpha = 1): string {
    if (!profileId && profileId !== 0) return alpha === 1 ? '#bbb' : 'rgba(187,187,187,0.2)';
    if (!this.profileColorMap[profileId]) {
      this.profileColorMap[profileId] = this.colorPalette[profileId % this.colorPalette.length];
    }
    const hex = this.profileColorMap[profileId];
    if (alpha === 1) return hex;
    const rgb = hex.replace('#', '').match(/.{1,2}/g)?.map(x => parseInt(x, 16)) || [187, 187, 187];
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
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
    await this.planningService.addSpecialSermon(this.newSpecialDate);
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
