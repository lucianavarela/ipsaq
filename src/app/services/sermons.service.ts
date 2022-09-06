import { Injectable } from '@angular/core';
import { Sermon } from '../classes/sermon';
import { SermonSong } from '../classes/sermon-song';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SermonsService {
  table = 'sermons';
  tableLastSermon = 'last_sermon';
  tableUpcomingSermon = 'upcoming_sermon';
  tableSermonSong = 'sermon_song';

  constructor(public sSupabase: SupabaseService) { }

  getSermon(id: number) {
    return this.sSupabase.getById(id, this.table, '*, related_series');
  }

  getSpecificSermon(isLastSermon: boolean) {
    return this.sSupabase.get(isLastSermon ? this.tableLastSermon : this.tableUpcomingSermon);
  }

  getSermons() {
    return this.sSupabase.get(this.table, '*, related_series');
  }

  getSongsOfSermon(id: number) {
    return this.sSupabase.getByEqCriteria(id, this.tableSermonSong, 'id, songs!inner(*)', 'id_sermon');
  }

  async updateSermon(sermon: Sermon) {
    return await this.sSupabase.update(sermon, this.table);
  }

  async createSermon(sermon: Sermon) {
    return await this.sSupabase.add(sermon, this.table);
  }

  async removeSermonSong(id: number) {
    return await this.sSupabase.delete(id, this.tableSermonSong);
  }

  async addSermonSong(sermonSong: any) {
    return await this.sSupabase.add(sermonSong, this.tableSermonSong);
  }
}
