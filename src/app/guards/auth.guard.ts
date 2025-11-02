import { Injectable, inject } from '@angular/core';
import { Router, UrlTree, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private sSupabase: SupabaseService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.sSupabase.authState$.pipe(
      filter(val => val !== null),
      take(1),
      map(isLoggedIn => {
        if (!isLoggedIn) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    );
  }
}

export const AuthGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate();
};
