import { Injectable, Type } from '@angular/core'
import {
  AuthChangeEvent,
  AuthUser,
  createClient,
  Session,
  SupabaseClient,
} from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import { Profile } from '../classes/profile';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SupabaseService {
  private supabase: SupabaseClient;
  private user!: any;
  private authStateSubject = new BehaviorSubject<boolean|null>(null);
  public authState$ = this.authStateSubject.asObservable();

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    // Check initial session
    this.supabase.auth.getSession().then(s => {
      const session = s?.data?.session;
      const loggedIn = !!session?.user;
      this.user = loggedIn ? new Profile(session.user) : null;
      this.authStateSubject.next(loggedIn);
    });

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      const loggedIn = !!session?.user;
      this.user = loggedIn ? new Profile(session.user) : null;
      this.authStateSubject.next(loggedIn);
    });
  }

  get(table: string, queryFields?: string) {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`);
  }

  getById(id: number, table: string, queryFields?: string) {
    return this.supabase.from(table).select(`${queryFields ? queryFields : '*'}`).eq('id', id).single()
  }

  add(obj: any, table: string) {
    return this.supabase.from(table).insert(obj).select();
  }

  update(obj: any, table: string) {
    return this.supabase.from(table).update(obj);
  }

  delete(ids: number[], table: string) {
    return this.supabase.from(table).delete().in('id', ids);
  }

  deleteById(id: number, table: string) {
    return this.supabase.from(table).delete().eq('id', id);
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


  /*  LOGIN  */

  get getUser() {
    return this.user;
  }

  async setUser(user?: AuthUser): Promise<Profile | void> {
    if (user) {
      return Promise.resolve(this.user = new Profile(user));
    } else {
      return this.supabase.auth.getSession().then(s => {
        this.user = new Profile(s?.data?.session?.user) || null;
      });
    }
  }

  authChanges(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string, pw: string) {
    return this.supabase.auth.signInWithPassword({ 'email': email, password: pw });
  }

  signOut() {
    return this.supabase.auth.signOut().then(() => {
      this.user = null
    });
  }

  resetPW(new_pw: string) {
    return this.supabase.auth.updateUser({ password: new_pw });
  }

  requestReset(email: string) {
    const url = 'https://presbiquilmes.org.ar/reset';
    //const url = 'localhost:4200/reset';
    return this.supabase.auth.resetPasswordForEmail(email, { redirectTo: url })
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