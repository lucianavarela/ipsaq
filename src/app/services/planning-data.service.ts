import { Injectable } from '@angular/core';
import { Profile } from '../classes/profile';
import { Availability } from '../classes/availability';
import { addMonths, startOfMonth, endOfMonth, isAfter, isToday } from 'date-fns';
import { SpecialSermon } from '../classes/special-sermon';

export interface AvailabilitySummary {
  date: string;
  director: string;
  band: string[];
  choir: string[];
}

@Injectable({
  providedIn: 'root'
})
export class PlanningDataService {
  private colorPalette: string[] = [
    "#fdfd03", "#499ae9", "#fe8b05", "#4eb72a", "#7bfbf6", "#05a149", "#ffc165", "#fe0312",
    "#0197fd", "#d1ae07", "#d355b4", "#8974dd", "#e55151"
  ];
  private profileColorMap: { [profileId: number]: string } = {};
  
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

  getProfileColor(profileId: number | undefined | null, alpha = 1): string {
    if (!profileId && profileId !== 0) return alpha === 1 ? '#bbb' : 'rgba(187,187,187,0.2)';
    if (!this.profileColorMap[profileId]) {
      const colorIdx = profileId % this.colorPalette.length;
      this.profileColorMap[profileId] = this.colorPalette[colorIdx];
    }
    const hex = this.profileColorMap[profileId];
    if (alpha === 1) return hex;
    
    const rgb = hex.replace('#','').match(/.{1,2}/g)?.map(x => parseInt(x, 16)) || [187,187,187];
    return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
  }

  getProfileName(profile: Profile | null | undefined): string {
    return profile ? (profile.nickname || profile.first_name || profile.email || '') : '';
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
    // Group availabilities by date
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
    
    // Convert grouped data to AvailabilitySummary array
    return Object.entries(groupedByDate).map(([date, data]) => {
      const director = data.directorAvailability ? data.directorAvailability.nickname ?? '' : '';

      const bandMembers = data.bandMembers
        .map(p => p.nickname || '');

      const choirMembers = data.choirMembers
        .map(p => p.nickname || '');

      return {
        date,
        director,
        band: bandMembers,
        choir: choirMembers
      };
    }).sort((a, b) => a.date.localeCompare(b.date)); // Sort by date
  }
}
