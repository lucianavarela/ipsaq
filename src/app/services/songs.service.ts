import { Injectable } from '@angular/core';
import { Song } from '../classes/song';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  table = 'songs';
  usage_view = 'songs_with_usage';

  constructor(public sSupabase: SupabaseService) { }

  getSong(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  getSongByIndex(index: number) {
    return this.sSupabase.get(this.table).filter('index', 'eq', index).single();
  }

  getSongs(with_usage?: boolean) {
    return this.sSupabase.get(with_usage? this.usage_view: this.table).filter('suggestion', 'eq', 'false').order('index');
  }

  getLatestSongs() {
    return this.sSupabase.get(this.usage_view).filter('suggestion', 'eq', 'false').order('created_at', {ascending: false}).limit(10);
  }

  getSuggestedSongs() {
    return this.sSupabase.get(this.table).filter('suggestion', 'is', 'true');
  }

  getLastIndex() {
    return this.sSupabase.get(this.table).filter('index', 'not.is', 'null').select('index').order('index', {ascending: false}).limit(1);
  }

  async updateSong(song: Song) {
    return await this.sSupabase.update(song, this.table).eq('id', song.id);;
  }

  async createSong(song: Song) {
    return await this.sSupabase.add(song, this.table);
  }
  
  async deleteSong(id: number) {
    return await this.sSupabase.deleteById(id, this.table);
  }
}


/*

READ FOREIGN TABLES
let { data: songs, error } = await supabase
  .from('songs')
  .select('*,sermon_song (*)')
  
*/