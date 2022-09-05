import { Injectable } from '@angular/core';
import { Series } from '../classes/series';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  table='series';

  constructor(public sSupabase: SupabaseService) { }

  getSeries() {
    return this.sSupabase.get(this.table);
  }

  async createSerie(name: string) {
    return await this.sSupabase.add({'name': name}, this.table);
  }
}
