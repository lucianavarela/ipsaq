import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthUser,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {
  private supabase: SupabaseClient;
  private user!: AuthUser;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get(table: string, queryFields?: string) {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`);
  }
  
  getById(id: number, table: string, queryFields?: string) {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`).eq('id', id).single()
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

  functions(body: object) {
    return this.supabase.functions.invoke('ipsaq-func', {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*"
      },
      body: JSON.stringify(body),
    });
  }

  // LOGIN

  get getUser() {
    return this.user;
  }

  setUser(user?: AuthUser) {
    if (user) {
      this.user = user;
    } else {
      let logged_user = this.supabase.auth.user();
      if (logged_user) this.user = logged_user;
    }
  }

  isLoggedIn() {
    return this.user && this.user != null;
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string, pw: string) {
    return this.supabase.auth.signIn({ 'email': email, password: pw})
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  get session() {
    return this.supabase.auth.session()
  }

  resetPW(access_token: string, new_pw: string) {
    return this.supabase.auth.api.updateUser(access_token, { password: new_pw, })
  }

  requestReset(email: string) {
    return this.supabase.auth.api.resetPasswordForEmail(email)
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