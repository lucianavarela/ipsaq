import { Injectable } from '@angular/core';
import { PostgrestResponse } from '@supabase/supabase-js';
import { Song } from '../classes/song';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  table = 'songs';

  constructor(public sSupabase: SupabaseService) { }

  getSong(id: number) {
    return this.sSupabase.getById(id, this.table);
  }

  getSongs() {
    return this.sSupabase.get(this.table);
  }

  updateSong(song: Song) {
    return this.sSupabase.update(song, this.table);
  }

  async createSong(song: Song) {
    return await this.sSupabase.add(song, this.table);
  }
}
