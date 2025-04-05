import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Availability } from '../classes/availability';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  table='availability';

  constructor(public sSupabase: SupabaseService) { }

  getAvailabilityLogs() {
    return this.sSupabase.get(this.table).order('sermon_date', {ascending: true});
  }

  getAvailability(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  async logAvailability(obj: Availability) {
    return await this.sSupabase.add(obj, this.table);
  }
}
