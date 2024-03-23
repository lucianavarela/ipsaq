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
  tableSermonBand = 'sermon_band';

  constructor(public sSupabase: SupabaseService) { }

  getSermon(id: number) {
    return this.sSupabase.getById(id, this.table, '*, related_series!left(*)');
  }

  getUpcomingSermon() {
    return this.sSupabase.get(this.table, '*, related_series!left(*)').order('date', {ascending: false}).limit(1);
  }

  getLastsSermons() {
    return this.sSupabase.get(this.table, '*, related_series!left(*)').order('date', {ascending: false}).limit(3);
  }

  getSermons() {
    return this.sSupabase.get(this.table, '*, related_series!left(*)').order('date', {ascending: false});
  }

  getSermonsWithBand() {
    return this.sSupabase.get(this.table, '*, sermon_band(*)').gt('date', '2022-08-14').order('date', {ascending: false});
  }

  getSongsOfSermon(id: number) {
    return this.sSupabase.get(this.tableSermonSong, 'id, songs!inner(*)').eq('id_sermon', id);
  }

  getBandOfSermon(id: number) {
    return this.sSupabase.get(this.tableSermonBand, 'id, users!inner(*)').eq('id_sermon', id);
  }
  
  async updateSermon(sermon: Sermon) {
    return await this.sSupabase.update(sermon, this.table).eq('id', sermon.id);;
  }

  async createSermon(sermon: Sermon) {
    return await this.sSupabase.add(sermon, this.table);
  }

  async removeSermonSong(id: number) {
    return await this.sSupabase.deleteById(id, this.tableSermonSong);
  }

  async addSermonSong(sermonSong: any) {
    return await this.sSupabase.add(sermonSong, this.tableSermonSong);
  }

  async removeSermonBands(ids: number[]) {
    return await this.sSupabase.delete(ids, this.tableSermonBand);
  }

  async addSermonBands(sermonSong: any) {
    return await this.sSupabase.add(sermonSong, this.tableSermonSong);
  }
}
