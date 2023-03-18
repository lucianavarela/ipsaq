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
    return this.sSupabase.get(this.table, '*, sermons!left(*)').order('id', {ascending: false});
  }

  getSerie(id: number) {
    return this.sSupabase.getById(id, this.table, '*, sermons!left(*)');
  }

  async createSerie(name: string) {
    return await this.sSupabase.add({'name': name}, this.table);
  }
}
