import { Component, OnInit } from "@angular/core";
import { AvailabilityService } from "src/app/services/availability.service";
import { Availability } from "src/app/classes/availability";
import { Profile } from "src/app/classes/profile";
import { CommonModule } from "@angular/common";
import { ProfilesService } from "src/app/services/profiles.service";

@Component({
  selector: "app-planning-general",
  templateUrl: "./planning-general.component.html",
  styleUrls: ["./planning-general.component.scss"],
  standalone: true,
  imports: [CommonModule],
})
export class PlanningGeneralComponent implements OnInit {
  availabilities: Availability[] = [];
  profiles: Profile[] = [];
  sundays: string[] = [];
  months: { name: string; dates: string[] }[] = [];
  table: { [profileId: number]: { [date: string]: boolean } } = {};
  grouped: {
    [date: string]: {
      instruments: { available: Profile[]; absent: Profile[] };
      choir: { available: Profile[]; absent: Profile[] };
    };
  } = {};

  private profileColorMap: { [profileId: number]: string } = {};
  private colorPalette: string[] = [
    "#fdfd03", "#499ae9", "#fe8b05", "#4eb72a", "#7bfbf6", "#05a149", "#ffc165", "#fe0312",
    "#0197fd", "#d1ae07", "#d355b4", "#8974dd", "#e55151",  ];

  constructor(
    private sAvailability: AvailabilityService,
    private sProfile: ProfilesService
  ) {}

  async ngOnInit() {
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
      .filter((u: any) => profileIds.includes(u.id))
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
    const monthsMap: { [month: string]: string[] } = {};
    const locale = 'es-ES';
    this.sundays.forEach(dateStr => {
      const dateObj = new Date(dateStr);
      const monthName = dateObj.toLocaleString(locale, { month: 'long' });
      if (!monthsMap[monthName]) monthsMap[monthName] = [];
      monthsMap[monthName].push(dateStr);
    });
    this.months = Object.entries(monthsMap).map(([name, dates]) => ({ name, dates }));
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
      forDate.forEach((a) => {
        if (a.profile?.band_role) {
          if (a.is_available) instrumentsAvailable.push(a.profile);
          else instrumentsAbsent.push(a.profile);
        }
        if (a.profile?.choir_role) {
          if (a.is_available) choirAvailable.push(a.profile);
          else choirAbsent.push(a.profile);
        }
      });
      this.grouped[date] = {
        instruments: {
          available: instrumentsAvailable,
          absent: instrumentsAbsent,
        },
        choir: { available: choirAvailable, absent: choirAbsent },
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
}

// Archivo renombrado/eliminado: usar PlanningGeneralComponent
