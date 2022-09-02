import { Injectable } from '@angular/core';
import { Sermon } from '../classes/sermon';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SermonsService {
  table = 'sermons';

  constructor(public sSupabase: SupabaseService) { }

  getSermon(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  getSermons() {
    return this.sSupabase.get(this.table);
  }

  async updateSermon(sermon: Sermon) {
    return await this.sSupabase.update(sermon, this.table);
  }

  async createSermon(sermon: Sermon) {
    return await this.sSupabase.add(sermon, this.table);
  }
}
