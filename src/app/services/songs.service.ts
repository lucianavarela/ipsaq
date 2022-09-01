import { Injectable } from '@angular/core';
import { Song } from '../classes/song';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  table = 'songs';

  constructor(public sSupabase: SupabaseService) { }

  async updateSong(song: Song) {
    return this.sSupabase.update(song, this.table);
  }

  async createSong(song: Song) {
    return this.sSupabase.add(song, this.table);
  }
}
