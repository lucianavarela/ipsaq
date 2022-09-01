import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  createClient,
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

  get(obj: any, table: string) {
    return this.supabase.from(table).select('id', obj?.id).single()
  }

  add(obj: any, table: string) {
    return this.supabase.from(table).insert(obj);
  }

  update(obj: any, table: string) {
    return this.supabase.from(table).update(obj);
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