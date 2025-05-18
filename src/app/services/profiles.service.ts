import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
  table='users';

  constructor(public sSupabase: SupabaseService) { }

  getProfiles() {
    return this.sSupabase.get(this.table).order('nickname', {ascending: true});
  }

  getProfile(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  getProfileByAuthId(id: string) {
    return this.sSupabase.get(this.table).filter('id_user', 'eq', id).single();
  }

  async createProfile(name: string) {
    return await this.sSupabase.add({'name': name}, this.table);
  }
}
