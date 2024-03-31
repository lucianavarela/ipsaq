import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  table='users';

  constructor(public sSupabase: SupabaseService) { }

  getUsers() {
    return this.sSupabase.get(this.table).order('nickname', {ascending: true});
  }

  getUser(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  async createUser(name: string) {
    return await this.sSupabase.add({'name': name}, this.table);
  }
}
