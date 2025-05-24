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
}
