import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  createClient,
  PostgrestResponse,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from '../environments/environment'

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {
  private supabase: SupabaseClient

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get user() {
    return this.supabase.auth.user()
  }

  get(table: string, queryFields?: string) {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`);
  }

  getById(id: number, table: string, queryFields?: string) {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`).eq('id', id).single()
  }

  getByEqCriteria(id: number, table: string, queryFields?: string, matchingField: string = 'id') {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`).eq(matchingField, id)
  }

  add(obj: any, table: string) {
    return this.supabase.from(table).insert(obj);
  }

  update(obj: any, table: string) {
    return this.supabase.from(table).update(obj);
  }

  delete(id: number, table: string) {
    return this.supabase.from(table).delete().eq('id', id)
  }

  // LOGIN

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signIn({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  get session() {
    return this.supabase.auth.session()
  }

}


/*

FILTERING QUERIES INFO

.eq('column', 'Equal to')
.gt('column', 'Greater than')
.lt('column', 'Less than')
.gte('column', 'Greater than or equal to')
.lte('column', 'Less than or equal to')
.like('column', '%CaseSensitive%')
.ilike('column', '%CaseInsensitive%')
.is('column', null)
.in('column', ['Array', 'Values'])
.neq('column', 'Not equal to')

// Arrays
.cs('array_column', ['array', 'contains'])
.cd('array_column', ['contained', 'by'])

----

READ FOREIGN TABLES
let { data: songs, error } = await supabase
  .from('songs')
  .select(`
    some_column,
    other_table (
      foreign_key
    )
  `)
  
WITH PAGINATION
let { data: songs, error } = await supabase
  .from('songs')
  .select('*')
  .range(0, 9)

*/