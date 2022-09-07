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

  getSongs(with_usage?: boolean) {
    return this.sSupabase.get(with_usage? this.usage_view: this.table);
  }

  getLatestSongs() {
    return this.sSupabase.getSortedWithLimit(this.table, 'created_at', false, 10);
  }

  async updateSong(song: Song) {
    return await this.sSupabase.update(song, this.table);
  }

  async createSong(song: Song) {
    return await this.sSupabase.add(song, this.table);
  }
}


/*

READ FOREIGN TABLES
let { data: songs, error } = await supabase
  .from('songs')
  .select('*,sermon_song (*)')
  
*/