import { Component, OnInit, AfterViewInit, OnDestroy } from "@angular/core";
import { AvailabilityService } from "src/app/services/availability.service";
import { Availability } from "src/app/classes/availability";
import { Profile } from "src/app/classes/profile";
import { CommonModule } from "@angular/common";
import { ProfilesService } from "src/app/services/profiles.service";
import { OrderByNamePipe } from "src/app/decorators/order-by-name.pipe";
import { Title } from "@angular/platform-browser";
import { FormsModule } from '@angular/forms';

@Component({
  selector: "app-planning-general",
  templateUrl: "./planning-general.component.html",
  styleUrls: ["./planning-general.component.scss"],
  standalone: true,
  imports: [CommonModule, OrderByNamePipe, FormsModule],
})
export class PlanningGeneralComponent implements OnInit, AfterViewInit, OnDestroy {
  availabilities: Availability[] = [];
  profiles: Profile[] = [];
  sundays: string[] = [];
  months: { name: string; dates: string[] }[] = [];
  table: { [profileId: number]: { [date: string]: boolean } } = {};
  grouped: {
    [date: string]: {
      instruments: { available: Profile[]; absent: Profile[] };
      choir: { available: Profile[]; absent: Profile[] };
      directing?: Profile | null;
    };
  } = {};

  private profileColorMap: { [profileId: number]: string } = {};
  private colorPalette: string[] = [
    "#fdfd03", "#499ae9", "#fe8b05", "#4eb72a", "#7bfbf6", "#05a149", "#ffc165", "#fe0312",
    "#0197fd", "#d1ae07", "#d355b4", "#8974dd", "#e55151",  ];

  showAddProfile: { [key: string]: boolean } = {};
  selectedProfileId: { [key: string]: number|null } = {};
  showDesignadosResumen = false;

  constructor(
    private sAvailability: AvailabilityService,
    private sProfile: ProfilesService,
    private sTitle: Title
  ) {}

  async ngOnInit() {
    this.sTitle.setTitle(`Planificación General`);
    await this.loadData();
  }

  async loadData() {
    // Get all availabilities (only defined, not tbd)
    const res = await this.sAvailability.getAvailabilityLogs(null);
    const availabilitiesRaw = (res.data || []).filter(
      (a: any) => a.is_available !== null && a.is_available !== undefined
    );
    this.availabilities = Availability.mapObjects(availabilitiesRaw);
    // Get all profiles with at least one availability
    const profileIds = Array.from(
      new Set(this.availabilities.map((a) => a.profile?.id))
    );
    const profilesRes = await this.sProfile.getProfiles();
    const profilesRaw = profilesRes.data || [];
    this.profiles = profilesRaw
      .map((u: any) => new Profile(u));
    // Generar todos los domingos de los próximos 3 meses (a partir de mañana)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(today);
    end.setMonth(today.getMonth() + 3);
    const allSundays: string[] = [];
    let d = new Date(start);
    // Buscar el próximo domingo
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
    while (d <= end) {
      allSundays.push(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() + 7);
    }
    this.sundays = allSundays;
    // Agrupar fechas por mes (en español)
    const monthsMap: { [month: string]: { name: string, dates: string[] } } = {};
    const locale = 'es-ES';
    this.sundays.forEach(dateStr => {
      const dateObj = new Date(dateStr + 'T12:00:00'); // Forzar horario para evitar problemas de zona
      // Usar mes y año para evitar colisiones de nombre y agrupar correctamente
      const monthKey = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const monthName = dateObj.toLocaleString(locale, { month: 'long' });
      if (!monthsMap[monthKey]) monthsMap[monthKey] = { name: monthName, dates: [] };
      monthsMap[monthKey].dates.push(dateStr);
    });
    this.months = Object.keys(monthsMap)
      .sort()
      .map(key => ({ name: monthsMap[key].name, dates: monthsMap[key].dates }));
    // Build table
    this.table = {};
    this.profiles.forEach((profile) => {
      this.table[profile.id!] = {};
      this.sundays.forEach((date) => {
        const found = this.availabilities.find(
          (a) => a.profile?.id === profile.id && a.sermon_date === date
        );
        if (found) {
          this.table[profile.id!][date] = found.is_available === true;
        }
      });
    });
    // Agrupar por fecha y rol
    this.grouped = {};
    this.sundays.forEach((date) => {
      const forDate = this.availabilities.filter((a) => a.sermon_date === date);
      const instrumentsAvailable: Profile[] = [];
      const instrumentsAbsent: Profile[] = [];
      const choirAvailable: Profile[] = [];
      const choirAbsent: Profile[] = [];
      let directing: Profile | null = null;
      forDate.forEach((a) => {
        if (a.is_directing) {
          directing = a.profile || null;
        } else {
          if (a.profile?.band_role) {
            if (a.is_available) instrumentsAvailable.push(a.profile);
            else instrumentsAbsent.push(a.profile);
          }
          if (a.profile?.choir_role) {
            if (a.is_available) choirAvailable.push(a.profile);
            else choirAbsent.push(a.profile);
          }
        }
      });
      this.grouped[date] = {
        instruments: {
          available: instrumentsAvailable,
          absent: instrumentsAbsent,
        },
        choir: { available: choirAvailable, absent: choirAbsent },
        directing,
      };
    });
  }

  getProfileColor(profileId: number | undefined | null, alpha = 1): string {
    if (!profileId && profileId !== 0) return alpha === 1 ? '#bbb' : 'rgba(187,187,187,0.2)';
    if (!this.profileColorMap[profileId]) {
      const colorIdx = profileId % this.colorPalette.length;
      this.profileColorMap[profileId] = this.colorPalette[colorIdx];
    }
    const hex = this.profileColorMap[profileId];
    if (alpha === 1) return hex;
    // Convertir hex a rgba
    const rgb = hex.replace('#','').match(/.{1,2}/g)?.map(x => parseInt(x, 16)) || [187,187,187];
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  }

  openAddProfile(section: 'instruments'|'choir'|'directing', status: 'available'|'absent'|'unique', date: string) {
    this.showAddProfile[`${section}-${status}-${date}`] = true;
    this.selectedProfileId[`${section}-${status}-${date}`] = null;
  }

  closeAddProfile(section: 'instruments'|'choir'|'directing', status: 'available'|'absent'|'unique', date: string) {
    this.showAddProfile[`${section}-${status}-${date}`] = false;
    this.selectedProfileId[`${section}-${status}-${date}`] = null;
  }

  async addProfileToCell(section: 'instruments'|'choir', status: 'available'|'absent', date: string) {
    const key = `${section}-${status}-${date}`;
    const profileId = this.selectedProfileId[key];
    if (!profileId) return;
    // Buscar el profile
    const profile = this.profiles.find(p => p.id === +profileId);
    if (!profile) return;
    // Determinar is_available
    let is_available = status === 'available';
    // Buscar si ya existe una disponibilidad para ese usuario y fecha
    const existing = this.availabilities.find(a => a.profile?.id === +profileId && a.sermon_date === date);
    if (existing) {
      // Si ya existe y el estado es distinto, actualizar
      if (existing.is_available !== is_available) {
        // Si pasa de disponible a ausente y estaba designado, quitar designación
        let updateObj: any = { id: existing.id, is_available };
        if (!is_available && existing.is_designated) {
          updateObj.is_designated = false;
        }
        await this.sAvailability.updateAvailability(updateObj);
      }
      // Si ya existe y el estado es igual, no hacer nada
    } else {
      // Si no existe, crear
      await this.sAvailability.logAvailability({
        sermon_date: date,
        id_user: profileId,
        is_available
      });
    }
    this.showAddProfile[key] = false;
    this.selectedProfileId[key] = null;
    await this.loadData();
  }

  // Devuelve la Availability para un profileId y date
  getAvailability(profileId: number, date: string): Availability | undefined {
    return this.availabilities.find(a => a.profile?.id === profileId && a.sermon_date === date);
  }

  // Cambia el valor de is_designated y actualiza en Supabase
  async toggleDesignated(profileId: number, date: string, checked: boolean) {
    const availability = this.getAvailability(profileId, date);
    if (!availability) return;
    await this.sAvailability.updateAvailability({
      id: availability.id,
      is_designated: checked
    });
    // Refrescar datos para reflejar el cambio
    await this.loadData();
  }

  // Handler para el checkbox de designado en la UI
  onDesignatedCheckboxChange(event: Event, profileId: number, date: string) {
    const checked = (event.target as HTMLInputElement).checked;
    this.toggleDesignated(profileId, date, checked);
  }

  // Cierra el dropdown al hacer click fuera usando un event listener global
  ngAfterViewInit() {
    document.addEventListener('mousedown', this.handleGlobalClick, true);
  }
  ngOnDestroy() {
    document.removeEventListener('mousedown', this.handleGlobalClick, true);
  }

  handleGlobalClick = (event: MouseEvent) => {
    const openKeys = Object.keys(this.showAddProfile).filter(k => this.showAddProfile[k]);
    if (openKeys.length === 0) return;
    for (const key of openKeys) {
      const el = document.querySelector(`[data-add-profile-key='${key}']`);
      if (el && el.contains(event.target as Node)) {
        // Click adentro, no cerrar
        return;
      }
    }
    // Click afuera, cerrar todos
    for (const key of openKeys) {
      this.showAddProfile[key] = false;
      this.selectedProfileId[key] = null;
    }
  }

  onDropdownFocusOut(event: FocusEvent, section: 'instruments'|'choir'|'directing', status: 'available'|'absent'|'unique', date: string) {
    // Si el focus se va fuera del formulario, ocultar el dropdown
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    const key = `${section}-${status}-${date}`;
    // Si el focusout es hacia un elemento dentro del mismo formulario, no cerrar
    if (relatedTarget && event.currentTarget && (event.currentTarget as HTMLElement).contains(relatedTarget)) {
      return;
    }
    this.showAddProfile[key] = false;
    this.selectedProfileId[key] = null;
  }

  // Helpers para filtrar perfiles según el rol
  getProfilesForSection(section: 'instruments'|'choir'|'directing') {
    if (section === 'instruments') {
      return this.profiles.filter(p => p.band_role);
    } else if (section === 'choir') {
      return this.profiles.filter(p => p.choir_role);
    } else if (section === 'directing') {
      return this.profiles.filter(p => p.direction_role);
    }
    return [];
  }

  async addProfileToDirecting(date: string) {
    const key = `directing-unique-${date}`;
    const profileId = this.selectedProfileId[key];
    if (!profileId) return;
    // Desmarcar a todos los que sean director en esa fecha
    for (const a of this.availabilities.filter(a => a.sermon_date === date)) {
      if (a.is_directing) {
        await this.sAvailability.updateAvailability({ id: a.id, is_directing: false });
      }
    }
    // Buscar cualquier availability para ese usuario y fecha (aunque esté como ausente, disponible o designado)
    let availability = this.availabilities.find(a => a.profile?.id == profileId && a.sermon_date == date);
    if (availability) {
      // Actualizar el registro existente a director y limpiar los otros flags
      await this.sAvailability.updateAvailability({ id: availability.id, is_directing: true, is_available: false, is_designated: false });
    } else {
      // Si no existe, crear uno nuevo
      await this.sAvailability.logAvailability({
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

  // Devuelve los designados por sección para una fecha
  getDesignatedBySection(date: string) {
    const result = { instruments: [] as string[], choir: [] as string[] };
    this.availabilities.forEach(a => {
      if (a.sermon_date === date && a.is_designated) {
        const name = a.profile?.nickname || a.profile?.first_name || a.profile?.email || '';
        if (a.profile?.band_role) result.instruments.push(name);
        if (a.profile?.choir_role) result.choir.push(name);
      }
    });
    return result;
  }

  // Handler para el radio de director en la UI
  async onDirectingRadioChange(event: Event, profileId: number, date: string) {
    if (!(event.target as HTMLInputElement).checked) return;
    // Desmarcar a todos los demás como director, músicos, coro y designado para esa fecha
    for (const a of this.availabilities.filter(a => a.sermon_date === date)) {
      if (a.profile?.id === profileId) {
        await this.sAvailability.updateAvailability({ id: a.id, is_directing: true, is_available: false, is_designated: false });
      } else {
        // Si estaba como director, músicos, coro o designado, desmarcar
        await this.sAvailability.updateAvailability({ id: a.id, is_directing: false, is_available: false, is_designated: false });
      }
    }
    await this.loadData();
  }

  getDirectorName(date: string): string {
    const director = this.grouped[date]?.directing;
    return director ? (director.nickname || director.first_name || director.email || '') : '';
  }
}

