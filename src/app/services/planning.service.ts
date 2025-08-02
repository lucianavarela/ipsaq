import { Injectable } from '@angular/core';
import { Availability } from '../classes/availability';
import { Profile } from '../classes/profile';
import { AvailabilityService } from './availability.service';
import { ProfilesService } from './profiles.service';
import { SpecialSermon } from '../classes/special-sermon';
import { SpecialSermonsService } from './special-sermons.service';

@Injectable({
  providedIn: 'root'
})
export class PlanningService {
  constructor(
    private sAvailability: AvailabilityService,
    private sProfile: ProfilesService,
    private sSpecialSermons: SpecialSermonsService
  ) {}

  getSundays(monthsAmount:number=3): string[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() + 1);
    const end = new Date(today);
    end.setMonth(today.getMonth() + monthsAmount);
    const allSundays: string[] = [];
    let d = new Date(start);
    d.setDate(d.getDate() + ((7 - d.getDay()) % 7));
    while (d <= end) {
      allSundays.push(d.toISOString().split("T")[0]);
      d.setDate(d.getDate() + 7);
    }
    return allSundays;
  }

  async getSpecialSermons(): Promise<SpecialSermon[]> {
    const res = await this.sSpecialSermons.getSpecialSermons();
    return (res.data || []).map((e: any) => new SpecialSermon(e));
  }

  async getAvailabilities(): Promise<{
    availabilities: Availability[];
    profiles: Profile[];
  }> {
    // Get all availabilities (only defined, not tbd)
    const res = await this.sAvailability.getAvailabilityLogs(null);
    const availabilitiesRaw = (res.data || []).filter(
      (a: any) => a.is_available !== null && a.is_available !== undefined
    );
    const availabilities = Availability.mapObjects(availabilitiesRaw);

    // Get all profiles
    const profilesRes = await this.sProfile.getProfiles();
    const profilesRaw = profilesRes.data || [];
    const profiles = profilesRaw.map((u: any) => new Profile(u));

    return { availabilities, profiles };
  }

  async updateAvailability(id: number, changes: {
    is_available?: boolean;
    is_designated?: boolean;
    is_directing?: boolean;
  }): Promise<void> {
    await this.sAvailability.updateAvailability({ id, ...changes });
  }

  async createAvailability(data: {
    sermon_date: string;
    id_user: number;
    is_available?: boolean;
    is_designated?: boolean;
    is_directing?: boolean;
  }): Promise<void> {
    await this.sAvailability.logAvailability(data);
  }

  async addSpecialSermon(date: string): Promise<void> {
    await this.sSpecialSermons.addSpecialSermon({ sermon_date: date });
  }

  getSundaysInRange(start: Date, end: Date): Date[] {
    const sundays: Date[] = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0) {
        sundays.push(new Date(d));
      }
    }
    return sundays;
  }

  groupByMonth(dates: string[]): { name: string; dates: string[] }[] {
    const monthsMap: { [month: string]: { name: string, dates: string[] } } = {};
    const locale = 'es-ES';
    dates.forEach(dateStr => {
      const dateObj = new Date(dateStr + 'T12:00:00');
      const monthKey = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const monthName = dateObj.toLocaleString(locale, { month: 'long' });
      if (!monthsMap[monthKey]) monthsMap[monthKey] = { name: monthName, dates: [] };
      monthsMap[monthKey].dates.push(dateStr);
    });
    return Object.keys(monthsMap)
      .sort()
      .map(key => ({ name: monthsMap[key].name, dates: monthsMap[key].dates.sort() }));
  }

  buildAvailabilityTable(profiles: Profile[], dates: string[], availabilities: Availability[]): { 
    [profileId: number]: { [date: string]: boolean } 
  } {
    const table: { [profileId: number]: { [date: string]: boolean } } = {};
    profiles.forEach((profile) => {
      table[profile.id!] = {};
      dates.forEach((date) => {
        const found = availabilities.find(
          (a) => a.profile?.id === profile.id && a.sermon_date === date
        );
        if (found) {
          table[profile.id!][date] = found.is_available === true || found.is_designated === true;
        }
      });
    });
    return table;
  }

  groupAvailabilitiesByDate(dates: string[], availabilities: Availability[]): {
    [date: string]: {
      instruments: { available: Profile[]; absent: Profile[] };
      choir: { available: Profile[]; absent: Profile[] };
      directing?: Profile | null;
    }
  } {
    const grouped: any = {};
    dates.forEach((date) => {
      const forDate = availabilities.filter((a) => a.sermon_date === date);
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
      grouped[date] = {
        instruments: { available: instrumentsAvailable, absent: instrumentsAbsent },
        choir: { available: choirAvailable, absent: choirAbsent },
        directing
      };
    });
    return grouped;
  }

  filterProfilesByRole(profiles: Profile[], role: 'instruments' | 'choir' | 'directing'): Profile[] {
    if (role === 'instruments') {
      return profiles.filter(p => p.band_role);
    } else if (role === 'choir') {
      return profiles.filter(p => p.choir_role);
    } else if (role === 'directing') {
      return profiles.filter(p => p.direction_role);
    }
    return [];
  }

  getAvailabilitySummary(availabilities: Availability[]): AvailabilitySummary[] {
    const groupedByDate = availabilities.reduce((acc, availability) => {
      if (!availability.sermon_date) return acc;
      if (!acc[availability.sermon_date]) {
        acc[availability.sermon_date] = {
          directorAvailability: undefined,
          bandMembers: [],
          choirMembers: []
        };
      }
      if (availability.is_directing) {
        acc[availability.sermon_date].directorAvailability = availability.profile;
      } else {
        if (availability.profile?.band_role) {
          acc[availability.sermon_date].bandMembers.push(availability.profile);
        }
        if (availability.profile?.choir_role) {
          acc[availability.sermon_date].choirMembers.push(availability.profile);
        }
      }
      return acc;
    }, {} as { [key: string]: {
      directorAvailability?: Profile,
      bandMembers: Profile[],
      choirMembers: Profile[]
    }});
    return Object.entries(groupedByDate).map(([date, data]) => {
      const director = data.directorAvailability ? data.directorAvailability.nickname ?? '' : '';
      const bandMembers = data.bandMembers.map(p => p.nickname || '');
      const choirMembers = data.choirMembers.map(p => p.nickname || '');
      return {
        date,
        director,
        band: bandMembers,
        choir: choirMembers
      };
    }).sort((a, b) => a.date.localeCompare(b.date));
  }
}

export interface AvailabilitySummary {
  date: string;
  director: string;
  band: string[];
  choir: string[];
}
