import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Availability } from '../classes/availability';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  table='availability';

  constructor(public sSupabase: SupabaseService) { }

  getAvailabilityLogs(id_user: string|null) {
    if (id_user) {
      return this.sSupabase.get(this.table, '*, id_user!inner(*)').filter('id_user.id_user', 'eq', id_user).order('sermon_date', {ascending: true});
    } else {
      return this.sSupabase.get(this.table, '*, id_user!inner(*)').order('sermon_date', {ascending: true});
    }
  }

  getAvailability(id: number) {
    return this.sSupabase.getById(id, this.table);
  }
  
  async updateAvailability(obj: any) {
    return await this.sSupabase.update(obj, this.table).eq('id', obj.id);
  }

  async logAvailability(obj: any) {
    return await this.sSupabase.add(obj, this.table);
  }

  async deleteAvailabilityLog(id: number) {
    return await this.sSupabase.deleteById(id, this.table);
  }
}
