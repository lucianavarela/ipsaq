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
      return this.sSupabase.get(this.table, '*, id_user!inner(*)').filter('id_user', 'eq', id_user).order('sermon_date', {ascending: true});
    } else {
      return this.sSupabase.get(this.table, '*, id_user!inner(*)').order('sermon_date', {ascending: true});
    }
  }

  getUpcomingAvailabilityLogs() {
    const from = new Date();
    const to = new Date(new Date().setDate(new Date().getDate() + 30));
    return this.sSupabase.get(this.table, '*, id_user!inner(*)')
    .filter('sermon_date', 'gte', from.toISOString().split("T")[0])
    .filter('sermon_date', 'lte', to.toISOString().split("T")[0])
    .or('is_designated.eq.true,is_directing.eq.true')
    .order('sermon_date', {ascending: true});
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
