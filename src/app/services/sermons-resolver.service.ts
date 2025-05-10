import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';
import { SermonsService } from './sermons.service';
import { inject } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class SermonsResolverService {
  constructor(private sSermons: SermonsService, private router: Router) {}
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!isNaN(Number(route.paramMap.get('id')))) {
      return this.sSermons.getSermon(Number(route.paramMap.get('id'))).then(res => {
        if (res.status == 200) {
          return res
        } else {
          this.router.navigateByUrl('/cultos');
          return false;
        }
      });
    } else {
      this.router.navigateByUrl('/cultos');
      return;
    }
  }
}

export const sermonResolver: ResolveFn<any> = (route: ActivatedRouteSnapshot) => {
  return inject(SermonsResolverService).resolve(route, {} as RouterStateSnapshot);
};
