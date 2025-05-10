import { Injectable, inject } from '@angular/core';
import { Router, UrlTree, CanActivateFn } from '@angular/router';
import { Observable } from 'rxjs';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private sSupabase: SupabaseService, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.sSupabase.isLoggedIn()) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}

export const AuthGuard: CanActivateFn = () => {
  return inject(AuthGuardService).canActivate();
};
