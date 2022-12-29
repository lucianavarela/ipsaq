import { Injectable } from '@angular/core';
import { Sermon } from '../classes/sermon';
import { SermonSong } from '../classes/sermon-song';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SermonsService {
  table = 'sermons';
  tableSermonSong = 'sermon_song';

  constructor(public sSupabase: SupabaseService) { }

  getSermon(id: number) {
    return this.sSupabase.getById(id, this.table, '*, related_series!left(*)');
  }

  getLastsSermons() {
    return this.sSupabase.get(this.table).order('date', {ascending: false}).limit(3);
  }

  getSermons() {
    return this.sSupabase.get(this.table, '*, related_series!left(*)');
  }

  getSongsOfSermon(id: number) {
    return this.sSupabase.get(this.tableSermonSong, 'id, songs!inner(*)').eq('id_sermon', id);
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
