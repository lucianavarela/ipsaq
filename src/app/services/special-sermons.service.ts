import { Injectable } from '@angular/core';
import { SpecialSermon } from '../classes/special-sermon';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialSermonsService {
  table = 'special_sermons';

  constructor(public sSupabase: SupabaseService) { }

  getSpecialSermons() {
    return this.sSupabase.get(this.table, '*').order('sermon_date', { ascending: true });
  }

  addSpecialSermon(event: SpecialSermon) {
    return this.sSupabase.add(event, this.table);
  }

  deleteSpecialSermon(id: number) {
    return this.sSupabase.delete([id], this.table);
  }
}
