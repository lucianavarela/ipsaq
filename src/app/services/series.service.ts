import { Injectable } from '@angular/core';
import { Series } from '../classes/series';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SeriesService {
  table='series';
  table_with_dates='series_with_dates';

  constructor(public sSupabase: SupabaseService) { }

  getSeries() {
    return this.sSupabase.get(this.table_with_dates, '*, sermons(count)').order('ultimo', {ascending: false});
  }

  getSerie(id: number) {
    return this.sSupabase.getById(id, this.table, '*, sermons!left(*)');
  }

  async createSerie(name: string) {
    return await this.sSupabase.add({'name': name}, this.table);
  }
}
