import { Injectable } from '@angular/core';
import { Sermon } from '../classes/sermon';
import { SupabaseService } from './supabase.service';
import { Observable, combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SermonsService {
  table = 'sermons';
  tableSermonSong = 'sermon_song';
  tableSermonBand = 'sermon_band';

  constructor(public sSupabase: SupabaseService) { }

  getSermon(id: number) {
    return this.sSupabase.getById(id, this.table, '*, related_series!left(*), id_preacher(id, nickname), id_director(id, nickname), sermon_band(*)');
  }

  getUpcomingSermon() {
    let date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return this.sSupabase.get(this.table, '*, related_series!left(*)')
      .filter('link_youtube', 'not.is', 'null')
      .eq('date', date.toISOString().split('T')[0])
      .order('date', { ascending: false })
      .limit(1);
  }

  getLastsSermons() {
    return this.sSupabase.get(this.table, '*, related_series!left(*)').filter('link_youtube', 'not.is', 'null').order('date', { ascending: false }).limit(3);
  }

  getSermons() {
    return this.sSupabase.get(this.table, '*, related_series!left(*), id_preacher(id, nickname), id_director(id, nickname)').order('date', { ascending: false });
  }

  getSermonsWithBand() {
    let date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    return this.sSupabase.get(this.table, '*, sermon_band(*)').gt('date', date.toISOString().split('T')[0]).order('date', { ascending: false });
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

  async updateSermonBands(sermonSongs: any[], ids: any[]) {
    const execution = [];
    if (sermonSongs.length) execution.push(this.sSupabase.add(sermonSongs, this.tableSermonBand));
    if (ids.length) execution.push(this.sSupabase.delete(ids, this.tableSermonBand));

    return await Promise.all(execution);
  }
}
